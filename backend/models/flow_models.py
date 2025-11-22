"""
Flow structure models
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class FlowField(BaseModel):
    """Field in a form step"""
    
    name: str = Field(..., description="Field name")
    type: str = Field(..., description="Field type (text, email, tel, etc)")
    label: str = Field(..., description="Field label")
    required: bool = Field(True, description="Whether field is required")
    placeholder: Optional[str] = Field(None, description="Placeholder text")


class FlowStep(BaseModel):
    """Single step in a flow"""
    
    id: str = Field(..., description="Step ID")
    type: str = Field(..., description="Step type (form, confirmation, etc)")
    title: str = Field(..., description="Step title")
    message: Optional[str] = Field(None, description="Step message")
    fields: Optional[List[FlowField]] = Field(None, description="Form fields if type=form")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "step_1",
                "type": "form",
                "title": "Введіть дані",
                "fields": [
                    {
                        "name": "name",
                        "type": "text",
                        "label": "Ім'я",
                        "required": True
                    }
                ]
            }
        }


class Flow(BaseModel):
    """Complete flow structure"""
    
    id: str = Field(..., description="Flow ID")
    name: str = Field(..., description="Flow name")
    description: Optional[str] = Field(None, description="Flow description")
    steps: List[FlowStep] = Field(..., description="Flow steps")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "flow_001",
                "name": "Реєстрація у Дія",
                "description": "Форма реєстрації користувача",
                "steps": [
                    {
                        "id": "step_1",
                        "type": "form",
                        "title": "Введіть дані",
                        "fields": []
                    }
                ],
                "metadata": {
                    "created_at": "2025-11-22T12:00:00Z",
                    "version": "1.0"
                }
            }
        }
