"""
MCP Server для Yana.Diia.AI
Model Context Protocol - Tools для Generator та Judge LLM
"""
import os
import json
from typing import Dict, Any, List, Optional
import structlog

logger = structlog.get_logger()

# ==================== MCP Tool 1: Component Search (RAG) ====================

class ComponentSearchTool:
    """
    Пошук Diia Design System компонентів через RAG
    Використовує семантичний пошук у векторній БД
    """
    
    def __init__(self, weaviate_url: str = "http://localhost:8080"):
        self.weaviate_url = weaviate_url
        # TODO: Initialize Weaviate client when ready
        self.mock_mode = True  # Demo Day fallback
        
        # Mock component database
        self.mock_components = {
            "eligibility_banner": {
                "component_name": "eligibility_banner",
                "display_name": "Банер Перевірки Права",
                "category": "banner",
                "usage_context": "Показати результат автоматичної перевірки права на послугу через API",
                "props_schema": {
                    "eligible": "boolean",
                    "title": "string",
                    "message": "string",
                    "actionLabel": "string"
                },
                "example_code": "<EligibilityBanner eligible={true} title='Ви маєте право' />"
            },
            "error_modal": {
                "component_name": "error_modal",
                "display_name": "Модальне Вікно Помилки",
                "category": "modal",
                "usage_context": "Показати критичну помилку або блокуючу ситуацію",
                "props_schema": {
                    "title": "string (required)",
                    "description": "string",
                    "primaryAction": "object",
                    "secondaryAction": "object"
                },
                "example_code": "<ErrorModal title='Помилка' description='Сервіс недоступний' />"
            },
            "form_step": {
                "component_name": "form_step",
                "display_name": "Крок Форми",
                "category": "form",
                "usage_context": "Багатокроковий флоу з формами, валідацією, навігацією",
                "props_schema": {
                    "stepNumber": "number",
                    "totalSteps": "number",
                    "fields": "array",
                    "onNext": "function",
                    "onBack": "function"
                },
                "example_code": "<FormStep stepNumber={1} totalSteps={4} fields={[...]} />"
            },
            "recipient_card_single": {
                "component_name": "recipient_card_single",
                "display_name": "Картка Отримувача",
                "category": "card",
                "usage_context": "Відобразити дані отримувача, завантажені через API (ПІБ, РНОКПП)",
                "props_schema": {
                    "fullName": "string",
                    "inn": "string",
                    "address": "string",
                    "editable": "boolean (default: false)"
                },
                "example_code": "<RecipientCardSingle fullName='Шевченко Т.Г.' inn='1234567890' />"
            },
            "unavailable_banner": {
                "component_name": "unavailable_banner",
                "display_name": "Банер Недоступності",
                "category": "banner",
                "usage_context": "Послуга тимчасово недоступна через технічні причини",
                "props_schema": {
                    "title": "string",
                    "reason": "string",
                    "estimatedRestore": "string"
                },
                "example_code": "<UnavailableBanner title='Послуга недоступна' reason='Технічні роботи' />"
            }
        }
    
    async def search(self, query: str, limit: int = 1) -> List[Dict[str, Any]]:
        """
        Семантичний пошук компонента за описом потреби
        
        Args:
            query: Опис потреби (напр. "показати помилку користувачу")
            limit: Кількість результатів
            
        Returns:
            Список знайдених компонентів
        """
        logger.info("Component search", query=query, mock_mode=self.mock_mode)
        
        if self.mock_mode:
            # Simple keyword matching for demo
            query_lower = query.lower()
            results = []
            
            for comp_name, comp_data in self.mock_components.items():
                if any(keyword in query_lower for keyword in [
                    'помилк' if 'error' in comp_name else '',
                    'форм' if 'form' in comp_name else '',
                    'перевірк' if 'eligibility' in comp_name else '',
                    'недоступн' if 'unavailable' in comp_name else '',
                    'картк' if 'card' in comp_name else ''
                ]):
                    results.append(comp_data)
            
            return results[:limit] if results else [self.mock_components["form_step"]]
        
        # TODO: Real Weaviate search
        # client.query.get("DiiaComponent", [...]).with_near_text({"concepts": [query]})
        return []


# ==================== MCP Tool 2: API Caller ====================

class APICallerTool:
    """
    Виклик Ukrainian government APIs
    Інтеграція з Mock Registry
    """
    
    def __init__(self, api_base_url: str = "http://localhost:8000/api"):
        self.api_base_url = api_base_url
    
    async def call_api(
        self,
        api_type: str,
        identifier: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Універсальний виклик державного API
        
        Args:
            api_type: Тип API ("edr", "tax", "vehicle", "diia_docs", "subsidies")
            identifier: Ідентифікатор (ЄДРПОУ, РНОКПП, номер авто, etc.)
            
        Returns:
            Дані з API або помилка
        """
        logger.info("API call", api_type=api_type, identifier=identifier)
        
        endpoints = {
            "edr": f"{self.api_base_url}/mock/edr/{identifier}",
            "tax": f"{self.api_base_url}/mock/tax/{identifier}",
            "vehicle": f"{self.api_base_url}/mock/vehicle/{identifier}",
            "land": f"{self.api_base_url}/mock/land/{identifier}",
        }
        
        if api_type not in endpoints:
            return {"error": f"Unknown API type: {api_type}"}
        
        # For demo - return mock data directly without HTTP call
        mock_responses = {
            "edr": {
                "edrpou": identifier,
                "name": f"ФОП Mock {identifier}",
                "status": "active",
                "type": "fop"
            },
            "tax": {
                "inn": identifier,
                "has_debt": False,
                "last_declaration": "2024-Q3",
                "simplified_tax": True
            },
            "vehicle": {
                "license_plate": identifier,
                "brand": "Mock Brand",
                "model": "Mock Model",
                "year": 2020
            }
        }
        
        return mock_responses.get(api_type, {})


# ==================== MCP Tool 3: Flow Validator ====================

class FlowValidatorTool:
    """
    Оцінка user flow за Diia Flow Scoring Rubric
    Використовується Judge LLM
    """
    
    def __init__(self):
        self.weights = {
            "flow_length": 0.25,
            "component_compliance": 0.30,
            "wcag": 0.20,
            "screen_saturation": 0.15,
            "api_dependency": 0.10
        }
    
    async def validate(self, flow_json: Dict[str, Any]) -> Dict[str, Any]:
        """
        Оцінити flow за 5 критеріями
        
        Args:
            flow_json: DiiaFlow JSON object
            
        Returns:
            Scores та feedback
        """
        logger.info("Flow validation", flow_id=flow_json.get("flow_id", "unknown"))
        
        scores = {
            "flow_length_score": self._score_flow_length(flow_json),
            "component_compliance_score": self._score_component_compliance(flow_json),
            "wcag_score": self._score_wcag(flow_json),
            "screen_saturation_score": self._score_screen_saturation(flow_json),
            "api_dependency_score": self._score_api_dependency(flow_json),
        }
        
        # Calculate weighted total
        total_score = sum(
            scores[key] * self.weights[key.replace("_score", "")]
            for key in scores
        )
        
        issues = self._find_issues(flow_json, scores)
        
        return {
            "total_score": round(total_score, 2),
            "breakdown": scores,
            "passed": total_score >= 70,
            "issues": issues,
            "suggestions": self._generate_suggestions(flow_json, scores)
        }
    
    def _score_flow_length(self, flow: Dict) -> float:
        """Fewer steps = higher score"""
        steps = flow.get("steps", [])
        num_steps = len(steps)
        
        # Optimal: 3-5 steps
        if 3 <= num_steps <= 5:
            return 100
        elif num_steps < 3:
            return 80  # Too short, might be missing validation
        elif num_steps <= 7:
            return 90  # Acceptable
        else:
            return max(50, 100 - (num_steps - 7) * 5)  # Penalize long flows
    
    def _score_component_compliance(self, flow: Dict) -> float:
        """All components must be from Diia Design System"""
        # Mock: assume all components are valid for demo
        return 95
    
    def _score_wcag(self, flow: Dict) -> float:
        """WCAG AA compliance"""
        # Mock: return high score for demo
        return 85
    
    def _score_screen_saturation(self, flow: Dict) -> float:
        """Cognitive load check"""
        steps = flow.get("steps", [])
        avg_fields_per_step = sum(
            len(step.get("component", {}).get("props", {}).get("fields", []))
            for step in steps
        ) / max(len(steps), 1)
        
        # Optimal: 3-5 fields per screen
        if avg_fields_per_step <= 5:
            return 90
        else:
            return max(60, 90 - (avg_fields_per_step - 5) * 5)
    
    def _score_api_dependency(self, flow: Dict) -> float:
        """Penalize manual input when API available"""
        steps = flow.get("steps", [])
        api_steps = sum(1 for step in steps if step.get("api_calls"))
        
        if len(steps) == 0:
            return 50
        
        api_ratio = api_steps / len(steps)
        return min(100, api_ratio * 150)  # Reward API usage
    
    def _find_issues(self, flow: Dict, scores: Dict) -> List[Dict]:
        """Identify specific issues"""
        issues = []
        
        if scores["flow_length_score"] < 70:
            issues.append({
                "severity": "warning",
                "message_ua": "Занадто багато кроків у флоу",
                "fix_suggestion": "Об'єднати схожі кроки"
            })
        
        if scores["api_dependency_score"] < 70:
            issues.append({
                "severity": "warning",
                "message_ua": "Недостатньо використання API для автозаповнення",
                "fix_suggestion": "Додати виклики до державних реєстрів"
            })
        
        return issues
    
    def _generate_suggestions(self, flow: Dict, scores: Dict) -> List[str]:
        """Generate improvement suggestions"""
        suggestions = []
        
        if scores["api_dependency_score"] < 80:
            suggestions.append("Розглянути більше API інтеграцій для зменшення ручного введення")
        
        if scores["flow_length_score"] < 90:
            suggestions.append("Оптимізувати кількість кроків")
        
        return suggestions


# ==================== MCP Server Main Class ====================

class YanaMCPServer:
    """
    Main MCP Server для Yana.Diia.AI
    Provides tools для Generator та Judge LLMs
    """
    
    def __init__(self):
        self.component_search = ComponentSearchTool()
        self.api_caller = APICallerTool()
        self.flow_validator = FlowValidatorTool()
        logger.info("Yana MCP Server initialized")
    
    async def handle_tool_call(
        self,
        tool_name: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Route tool calls to appropriate handlers
        
        Args:
            tool_name: Name of tool ("search_component", "call_api", "validate_flow")
            **kwargs: Tool-specific arguments
            
        Returns:
            Tool result
        """
        if tool_name == "search_diia_component":
            return await self.component_search.search(
                query=kwargs.get("query", ""),
                limit=kwargs.get("limit", 1)
            )
        
        elif tool_name == "call_ukraine_api":
            return await self.api_caller.call_api(
                api_type=kwargs.get("api_type"),
                identifier=kwargs.get("identifier"),
                **kwargs
            )
        
        elif tool_name == "validate_flow":
            return await self.flow_validator.validate(
                flow_json=kwargs.get("flow_json", {})
            )
        
        else:
            return {"error": f"Unknown tool: {tool_name}"}


# ==================== Instantiate Server ====================

mcp_server = YanaMCPServer()
