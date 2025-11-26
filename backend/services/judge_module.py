"""
Judge Module - Diia Flow Scoring Rubric Implementation
LLM-as-a-Judge для оцінки GovTech-комплаєнсу flow
"""
import os
from openai import OpenAI
from typing import Dict, Any, List
import json
import structlog

logger = structlog.get_logger()

# Критична система промптів для Judge
JUDGE_SYSTEM_PROMPT = """
Ви є LLM-Judge (Експертний Аудитор), який оцінює якість та GovTech-комплаєнс прототипів державних послуг «Дія».

Ви ОБОВ'ЯЗКОВО повертаєте структурований JSON з оцінками (0-100) та текстовим обґрунтуванням.

=== РУБРИКА ОЦІНКИ (Diia Flow Scoring Rubric) ===

1. **Component Compliance Score (Вага 40%)**
   Чи ВСІ використані UI-елементи (Step Components) є частиною затвердженої Diia Design System?
   
   Критерії:
   - 100 балів: Всі компоненти з Diia D-DS, використані правильно згідно з UX-гайдлайнами
   - 85 балів: Всі компоненти з Diia D-DS, але є питання до контексту використання
   - 70 балів: 1 компонент не з Diia D-DS або неправильно використаний
   - 50 балів: 2+ компоненти не з Diia D-DS
   - 0 балів: Використання кастомних компонентів замість існуючих у D-DS
   
   Перевіряти за RAG-контекстом DiiaComponents.
   Штрафувати -15 балів за кожен кастомний компонент.

2. **Flow Length Score (Вага 30%)**
   Чи є флоу максимально коротким та ефективним?
   
   Критерії:
   - 100 балів: 3-4 кроки (ідеально для більшості послуг)
   - 90 балів: 5 кроків
   - 80 балів: 6-7 кроків
   - 60 балів: 8-10 кроків
   - 40 балів: 11+ кроків (занадто довгий UX)
   
   Ідеальний флоу: "Запит → Підпис (Diia.Signature) → Результат"
   Штрафувати -10 балів за кожен зайвий крок понад оптимальні 4.

3. **API Dependency Checking (Вага 30%)**
   Чи НЕ вимагає флоу ручного введення даних, які доступні автоматично через державні реєстри?
   
   Критерії:
   - 100 балів: Всі дані отримані з API, нуль ручного вводу
   - 80 балів: 1 поле вимагає ручного вводу (виправдано)
   - 60 балів: 2-3 поля ручного вводу
   - 40 балів: 4+ полів ручного вводу
   - 0 балів: Ключові дані (РНОКПП, статус ФОП, адреса) вимагають ручного вводу
   
   Перевіряти за RAG-контекстом APIMock (доступні поля з реєстрів).
   Штрафувати -20 балів за кожне поле яке має бути з API але запитується вручну.

=== ФОРМАТ ВІДПОВІДІ ===

Поверніть ЛИШЕ валідний JSON (без markdown):

{
  "component_compliance_score": 95,
  "component_compliance_justification": "Всі 4 компоненти з Diia D-DS. eligibility_banner використаний правильно для відображення результату перевірки ЄДР. form_step містить лише поля які НЕ доступні через API (КВЕД).",
  "component_issues": ["Немає"],
  
  "flow_length_score": 90,
  "flow_length_justification": "4 кроки - оптимально. Крок 1: перевірка ЄДР, Крок 2: вибір КВЕД, Крок 3: Diia.Signature, Крок 4: підтвердження.",
  "redundant_steps": [],
  
  "api_dependency_score": 85,
  "api_dependency_justification": "Використано ЄДР API для автоперевірки статусу ФОП. Податковий API для перевірки боргів. КВЕД вимагає ручного вибору (правильно, бо кожен ФОП обирає свій). Дані User Profile отримані з Diia Documents API.",
  "manual_input_violations": ["Немає критичних"],
  
  "total_weighted_score": 90.5,
  "overall_assessment": "PASSED",
  "recommendations": [
    "Розглянути можливість попереднього заповнення найпопулярніших КВЕД для IT-фрілансерів"
  ]
}
"""


class DiiaJudge:
    """
    Judge Module для Dual-LLM Architecture
    Використовує GPT-4 для критичної оцінки згенерованих flow
    """
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY_JUDGE"))
        self.model = os.getenv("LLM_MODEL_JUDGE", "gpt-4-turbo")
        
        # Ваги з .env
        self.weights = {
            "component_compliance": float(os.getenv("SCORING_COMPONENT_COMPLIANCE_WEIGHT", 0.40)),
            "flow_length": float(os.getenv("SCORING_FLOW_LENGTH_WEIGHT", 0.30)),
            "api_dependency": float(os.getenv("SCORING_API_DEPENDENCY_WEIGHT", 0.30)),
        }
        
        # Штрафи з .env
        self.penalties = {
            "custom_component": int(os.getenv("PENALTY_CUSTOM_COMPONENT", 15)),
            "redundant_step": int(os.getenv("PENALTY_REDUNDANT_STEP", 10)),
            "manual_input": int(os.getenv("PENALTY_MANUAL_INPUT", 20)),
        }
        
        logger.info("DiiaJudge initialized", model=self.model, weights=self.weights)
    
    def judge_flow(
        self,
        flow_json: Dict[str, Any],
        rag_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Оцінити flow за Diia Flow Scoring Rubric
        
        Args:
            flow_json: Згенерований flow (DiiaFlow JSON)
            rag_context: Контекст з RAG (DiiaComponents, APIMock)
            
        Returns:
            Structured evaluation з scores та recommendations
        """
        logger.info("Starting flow evaluation", flow_id=flow_json.get("flow_id"))
        
        # Підготовка контексту для Judge
        user_prompt = self._prepare_judge_prompt(flow_json, rag_context)
        
        try:
            # Виклик GPT-4
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,  # Низька для консистентності
                max_tokens=1500,
                response_format={"type": "json_object"}  # Force JSON
            )
            
            evaluation = json.loads(response.choices[0].message.content)
            
            # Додаткова валідація
            evaluation = self._validate_and_enhance(evaluation, flow_json)
            
            logger.info(
                "Flow evaluation complete",
                total_score=evaluation.get("total_weighted_score"),
                passed=evaluation.get("overall_assessment") == "PASSED"
            )
            
            return evaluation
            
        except Exception as e:
            logger.error("Judge evaluation failed", error=str(e))
            # Fallback to rule-based scoring
            return self._fallback_scoring(flow_json)
    
    def _prepare_judge_prompt(
        self,
        flow_json: Dict[str, Any],
        rag_context: Dict[str, Any]
    ) -> str:
        """Підготувати промпт для Judge з RAG контекстом"""
        
        prompt = f"""
Оцініть наступний User Flow для державної послуги:

=== FLOW DATA ===
Service: {flow_json.get('service_name_ua', 'Unknown')}
Total Steps: {flow_json.get('total_steps', 0)}

Steps:
{json.dumps(flow_json.get('steps', []), indent=2, ensure_ascii=False)}

Required APIs: {', '.join(flow_json.get('required_apis', []))}

=== RAG CONTEXT (Available Components) ===
"""
        
        if rag_context and "components" in rag_context:
            prompt += "\nDiia Design System Components:\n"
            for comp in rag_context["components"]:
                prompt += f"- {comp['component_name']}: {comp['usage_context']}\n"
        
        if rag_context and "api_mocks" in rag_context:
            prompt += "\n\nAvailable API Data:\n"
            for api in rag_context["api_mocks"]:
                prompt += f"- {api['api_name_ua']}: {', '.join(api['available_fields'])}\n"
        
        prompt += "\n\nОцініть flow та поверніть JSON з оцінками."
        
        return prompt
    
    def _validate_and_enhance(
        self,
        evaluation: Dict[str, Any],
        flow_json: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Валідувати та доповнити оцінку від Judge"""
        
        # Перевірка наявності ключових полів
        required_fields = [
            "component_compliance_score",
            "flow_length_score",
            "api_dependency_score"
        ]
        
        for field in required_fields:
            if field not in evaluation:
                logger.warning(f"Missing field in evaluation: {field}")
                evaluation[field] = 50  # Default
        
        # Обчислення weighted score (на випадок якщо Judge не порахував)
        if "total_weighted_score" not in evaluation:
            evaluation["total_weighted_score"] = (
                evaluation["component_compliance_score"] * self.weights["component_compliance"] +
                evaluation["flow_length_score"] * self.weights["flow_length"] +
                evaluation["api_dependency_score"] * self.weights["api_dependency"]
            )
        
        # Додаткові метадані
        evaluation["judged_at"] = "2025-11-23T13:40:00Z"
        evaluation["judge_model"] = self.model
        evaluation["flow_id"] = flow_json.get("flow_id")
        
        # Pass/Fail threshold
        evaluation["overall_assessment"] = (
            "PASSED" if evaluation["total_weighted_score"] >= 70 else "FAILED"
        )
        
        return evaluation
    
    def _fallback_scoring(self, flow_json: Dict[str, Any]) -> Dict[str, Any]:
        """Rule-based fallback якщо Judge LLM недоступний"""
        
        logger.warning("Using fallback rule-based scoring")
        
        steps = flow_json.get("steps", [])
        num_steps = len(steps)
        
        # Simple rules
        flow_length_score = max(40, 100 - (num_steps - 4) * 10)
        component_compliance_score = 50  # Unknown without RAG
        api_dependency_score = len(flow_json.get("required_apis", [])) * 20
        
        total_score = (
            component_compliance_score * self.weights["component_compliance"] +
            flow_length_score * self.weights["flow_length"] +
            api_dependency_score * self.weights["api_dependency"]
        )
        
        return {
            "component_compliance_score": component_compliance_score,
            "flow_length_score": flow_length_score,
            "api_dependency_score": api_dependency_score,
            "total_weighted_score": total_score,
            "overall_assessment": "PASSED" if total_score >= 70 else "FAILED",
            "component_compliance_justification": "Fallback scoring (Judge LLM unavailable)",
            "flow_length_justification": f"Flow has {num_steps} steps",
            "api_dependency_justification": f"Uses {len(flow_json.get('required_apis', []))} APIs",
            "recommendations": ["Judge LLM unavailable - using basic rules"]
        }


# Instantiate Judge
diia_judge = DiiaJudge()
