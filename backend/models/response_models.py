"""
Response models for API endpoints
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class GenerateResponse(BaseModel):
    """Response model for /generate endpoint"""
    
    flow: Optional[Dict[str, Any]] = Field(
        None,
        description="Згенерований flow structure"
    )
    
    ui: Optional[str] = Field(
        None,
        description="HTML/Tailwind UI prototype"
    )
    
    status: str = Field(
        ...,
        description="Status: ready, processing, error"
    )
    
    prompt: str = Field(
        ...,
        description="Original prompt"
    )
    
    error: Optional[str] = Field(
        None,
        description="Error message if status=error"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "flow": {
                    "id": "flow_001",
                    "name": "Реєстрація у Дія",
                    "steps": []
                },
                "ui": "<div>...</div>",
                "status": "ready",
                "prompt": "Створити форму реєстрації",
                "error": None
            }
        }


class StatusResponse(BaseModel):
    """Response model for /status endpoint"""
    
    codemie_available: bool = Field(
        ...,
        description="Whether CodeMie service is available"
    )
    
    agent_flow_id: Optional[str] = Field(
        None,
        description="Flow generator agent ID"
    )
    
    agent_ui_id: Optional[str] = Field(
        None,
        description="UI renderer agent ID"
    )
    
    api_url: Optional[str] = Field(
        None,
        description="CodeMie API URL"
    )
    
    error: Optional[str] = Field(
        None,
        description="Error message if service unavailable"
    )


class HealthResponse(BaseModel):
    """Response model for /health endpoint"""
    
    status: str = Field(
        ...,
        description="Health status: ok, degraded, error"
    )
    
    service: str = Field(
        ...,
        description="Service name"
    )
    
    version: str = Field(
        ...,
        description="Service version"
    )
    
    timestamp: Optional[str] = Field(
        None,
        description="Current timestamp"
    )
