"""
CodeMie SDK Service для Yana.Diia.AI
Інтеграція з EPAM CodeMie для генерації flows та UI прототипів
"""
import os
import json
import logging
from typing import Optional, Dict, Any
from utils.retry import async_retry
from utils.http_client import get_http_client

logger = logging.getLogger(__name__)


class CodeMieService:
    """Service для роботи з CodeMie SDK"""
    
    def __init__(self):
        """Initialize CodeMie client with credentials from environment"""
        self.username = os.getenv("CODEMIE_USERNAME")
        self.password = os.getenv("CODEMIE_PASSWORD")
        self.api_key = os.getenv("CODEMIE_API_KEY")
        self.api_url = os.getenv("CODEMIE_API_URL")
        
        self.agent_flow_id = os.getenv("AGENT_FLOW_GENERATOR")
        self.agent_ui_id = os.getenv("AGENT_UI_RENDERER")
        
        # Validate credentials
        if not all([self.username, self.password, self.api_key]):
            raise ValueError("Missing CodeMie credentials in environment")
        
        logger.info(f"CodeMie Service initialized. API URL: {self.api_url}")
        
        # HTTP client for API calls
        self.http_client = get_http_client()
        
        # TODO: Initialize CodeMie SDK client here
        # from codemie_sdk import CodeMieClient
        # self.client = CodeMieClient(
        #     username=self.username,
        #     password=self.password,
        #     api_key=self.api_key,
        #     api_url=self.api_url
        # )
    
    @async_retry(max_attempts=3, initial_delay=1.0, exceptions=(Exception,))
    async def generate_flow(self, prompt: str) -> Dict[str, Any]:
        """
        Generate flow using CodeMie Agent 1 (Flow Generator)
        With automatic retry on failure (3 attempts, exponential backoff)
        
        Args:
            prompt: User prompt describing the desired flow
            
        Returns:
            Dict containing generated flow structure
        """
        logger.info(f"Generating flow for prompt: {prompt[:100]}...")
        
        try:
            # TODO: Replace with actual CodeMie SDK call
            # response = await self.client.invoke_assistant(
            #     assistant_id=self.agent_flow_id,
            #     prompt=prompt
            # )
            # return response.to_dict()
            
            # MOCK RESPONSE для тестування
            mock_flow = {
                "id": "flow_001",
                "name": "Реєстрація у Дія",
                "steps": [
                    {
                        "id": "step_1",
                        "type": "form",
                        "title": "Введіть дані",
                        "fields": [
                            {"name": "name", "type": "text", "label": "Ім'я"},
                            {"name": "email", "type": "email", "label": "Email"}
                        ]
                    },
                    {
                        "id": "step_2",
                        "type": "confirmation",
                        "title": "Підтвердження",
                        "message": "Перевірте введені дані"
                    }
                ]
            }
            
            logger.info(f"Flow generated successfully: {mock_flow['id']}")
            return mock_flow
            
        except Exception as e:
            logger.error(f"Flow generation failed: {str(e)}")
            raise
    
    @async_retry(max_attempts=3, initial_delay=1.0, exceptions=(Exception,))
    async def generate_ui(self, flow: Dict[str, Any]) -> str:
        """
        Generate UI using CodeMie Agent 2 (UI Renderer)
        With automatic retry on failure (3 attempts, exponential backoff)
        
        Args:
            flow: Flow structure from generate_flow()
            
        Returns:
            HTML/Tailwind UI prototype as string
        """
        logger.info(f"Generating UI for flow: {flow.get('id', 'unknown')}")
        
        try:
            # TODO: Replace with actual CodeMie SDK call
            # response = await self.client.invoke_assistant(
            #     assistant_id=self.agent_ui_id,
            #     prompt=json.dumps(flow)
            # )
            # return response.html
            
            # MOCK RESPONSE для тестування
            mock_ui = f"""
            <div class="min-h-screen bg-gray-50 p-8">
                <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">{flow.get('name', 'Форма')}</h1>
                    
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Ім'я</label>
                            <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            Продовжити
                        </button>
                    </form>
                </div>
            </div>
            """
            
            logger.info("UI generated successfully")
            return mock_ui.strip()
            
        except Exception as e:
            logger.error(f"UI generation failed: {str(e)}")
            raise
    
    async def generate_complete(self, prompt: str) -> Dict[str, Any]:
        """
        Complete generation pipeline: Flow + UI
        
        Args:
            prompt: User prompt
            
        Returns:
            Dict with flow, ui, and status
        """
        try:
            # Step 1: Generate flow
            flow = await self.generate_flow(prompt)
            
            # Step 2: Generate UI from flow
            ui_html = await self.generate_ui(flow)
            
            return {
                "flow": flow,
                "ui": ui_html,
                "status": "ready",
                "prompt": prompt
            }
            
        except Exception as e:
            logger.error(f"Complete generation failed: {str(e)}")
            return {
                "flow": None,
                "ui": None,
                "status": "error",
                "error": str(e),
                "prompt": prompt
            }
