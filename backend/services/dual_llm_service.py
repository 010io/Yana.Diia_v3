"""
Dual-LLM Service: Generator + Judge Architecture
Implements LLM-as-a-Judge pattern for Diia flow validation
"""
import os
import requests
from typing import List, Dict
from openai import OpenAI


class DualLLMService:
    """
    Orchestrates Dual-LLM system:
    - Generator: Fast, creative (Llama 3.1 via Ollama)
    - Judge: Powerful, validation (GPT-4 / Claude)
    """
    
    def __init__(self):
        # Generator (Local)
        self.generator_endpoint = os.getenv("LLM_ENDPOINT_GENERATOR", "http://localhost:11434/api/generate")
        self.generator_model = os.getenv("LLM_MODEL_GENERATOR", "llama3.1")
        
        # Judge (Cloud)
        self.judge_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.judge_model = os.getenv("LLM_MODEL_JUDGE", "gpt-4")
        
        # Scoring weights
        self.weights = {
            "flow_length": float(os.getenv("SCORING_FLOW_LENGTH_WEIGHT", 0.25)),
            "component_compliance": float(os.getenv("SCORING_COMPONENT_COMPLIANCE_WEIGHT", 0.30)),
            "wcag": float(os.getenv("SCORING_WCAG_WEIGHT", 0.20)),
            "screen_saturation": float(os.getenv("SCORING_SCREEN_SATURATION_WEIGHT", 0.15)),
            "api_dependency": float(os.getenv("SCORING_API_DEPENDENCY_WEIGHT", 0.10))
        }
    
    def generate_flow_variants(self, brd_text: str, n_variants: int = 3) -> List[Dict]:
        """
        Generator Module: Create N flow variants from BRD
        
        Args:
            brd_text: Business Requirements Document
            n_variants: Number of variants to generate
            
        Returns:
            List of flow variants
        """
        variants = []
        
        for i in range(n_variants):
            prompt = f"""
            Generate user flow variant {i+1} for the following government service:
            
            BRD: {brd_text}
            
            Requirements:
            - Use only components from Diia Design System
            - Minimize number of steps
            - Maximize automation through APIs
            - Ensure WCAG AA compliance
            
            Output as JSON with structure: {{"steps": [], "components": [], "api_calls": []}}
            """
            
            # Call Ollama
            response = requests.post(
                self.generator_endpoint,
                json={
                    "model": self.generator_model,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.7 + (i * 0.1)  # Vary creativity
                },
                timeout=120
            )
            
            if response.status_code == 200:
                variants.append({
                    "variant_id": i + 1,
                    "flow": response.json()["response"]
                })
        
        return variants
    
    def judge_flows(self, variants: List[Dict], rag_context: str = "") -> Dict:
        """
        Judge Module: Evaluate flows using Diia Flow Scoring Rubric
        
        Args:
            variants: List of generated flow variants
            rag_context: Retrieved context from knowledge base (Diia DS docs)
            
        Returns:
            Best variant with scores
        """
        judge_prompt = f"""
        You are an expert UX auditor for Ukrainian government services (Diia ecosystem).
        
        Evaluate the following flow variants using Diia Flow Scoring Rubric:
        
        Criteria (weights in parentheses):
        1. Flow Length Score ({self.weights['flow_length']*100}%): Fewer steps = higher score
        2. Component Compliance ({self.weights['component_compliance']*100}%): All components must exist in Diia Design System
        3. WCAG Score ({self.weights['wcag']*100}%): Accessibility compliance (AA minimum)
        4. Screen Saturation ({self.weights['screen_saturation']*100}%): Cognitive load, spacing, no horizontal scroll
        5. API Dependency ({self.weights['api_dependency']*100}%): Penalize manual data entry when API exists
        
        Knowledge Base (Diia Design System):
        {rag_context}
        
        Flow Variants to Evaluate:
        {variants}
        
        For each variant, provide:
        - Individual scores (0-100) for each criterion
        - Total weighted score
        - Detailed justification
        - Specific violations (if any)
        
        Return the BEST variant with all scores and explanations in JSON format.
        """
        
        response = self.judge_client.chat.completions.create(
            model=self.judge_model,
            messages=[
                {"role": "system", "content": "You are a UX auditor for Diia government services."},
                {"role": "user", "content": judge_prompt}
            ],
            temperature=0.1  # Low temperature for consistent evaluation
        )
        
        return {
            "evaluation": response.choices[0].message.content,
            "model": self.judge_model,
            "usage": response.usage.dict() if response.usage else {}
        }
    
    def orchestrate(self, brd_text: str, rag_context: str = "") -> Dict:
        """
        Full Dual-LLM pipeline: Generate → Judge → Return best
        
        Args:
            brd_text: Business Requirements Document
            rag_context: Retrieved context from RAG
            
        Returns:
            Best flow variant with scores
        """
        # Step 1: Generate variants
        print("🎨 Generating flow variants...")
        variants = self.generate_flow_variants(brd_text, n_variants=3)
        
        # Step 2: Judge variants
        print("⚖️ Evaluating with Judge module...")
        evaluation = self.judge_flows(variants, rag_context)
        
        return {
            "variants": variants,
            "evaluation": evaluation,
            "best_variant": evaluation  # Judge returns best
        }


# Instantiate service
dual_llm_service = DualLLMService()
