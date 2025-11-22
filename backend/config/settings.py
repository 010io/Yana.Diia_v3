"""
Centralized Settings using Pydantic BaseSettings
Reads from environment variables with validation
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # CodeMie SDK Configuration
    codemie_username: str
    codemie_password: str
    codemie_api_key: str
    codemie_api_url: str = "https://codemie.lab.epam.com/code-assistant-api"
    
    # CodeMie Agents
    agent_flow_generator: str
    agent_ui_renderer: str
    
    # Server Configuration
    port: int = 8001
    log_level: str = "DEBUG"
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    
    # Rate Limiting
    rate_limit_requests: int = 10
    rate_limit_period: int = 60  # seconds
    
    # API Timeouts
    codemie_timeout: int = 30  # seconds
    
    # Security
    max_prompt_length: int = 2000
    min_prompt_length: int = 10
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Map environment variable names
        fields = {
            'codemie_username': {'env': 'CODEMIE_USERNAME'},
            'codemie_password': {'env': 'CODEMIE_PASSWORD'},
            'codemie_api_key': {'env': 'CODEMIE_API_KEY'},
            'codemie_api_url': {'env': 'CODEMIE_API_URL'},
            'agent_flow_generator': {'env': 'AGENT_FLOW_GENERATOR'},
            'agent_ui_renderer': {'env': 'AGENT_UI_RENDERER'},
            'port': {'env': 'PORT'},
            'log_level': {'env': 'LOG_LEVEL'},
            'cors_origins': {'env': 'CORS_ORIGINS'},
        }
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()
