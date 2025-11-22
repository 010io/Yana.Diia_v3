"""
Request models for API endpoints
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from utils.validators import validate_prompt, sanitize_input


class GenerateRequest(BaseModel):
    """Request model for /generate endpoint"""
    
    prompt: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Опис бажаного flow українською мовою",
        examples=["Створити форму для реєстрації у Дія з полями: ім'я, прізвище, email, телефон"]
    )
    
    model: Optional[str] = Field(
        None,
        description="Optional model override for CodeMie agent"
    )
    
    @field_validator('prompt')
    @classmethod
    def validate_and_sanitize_prompt(cls, v: str) -> str:
        """Validate and sanitize prompt"""
        # Sanitize input
        sanitized = sanitize_input(v)
        
        # Validate
        is_valid, error_msg = validate_prompt(sanitized)
        if not is_valid:
            raise ValueError(error_msg)
        
        return sanitized
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Створити форму для реєстрації у Дія з полями: ім'я, прізвище, email, телефон",
                "model": None
            }
        }
