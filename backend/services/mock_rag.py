# 🚀 Backend Quick Start (WITHOUT Docker)

**Для тих у кого немає Docker**

---

## ✅ Встановлення залежностей

```powershell
cd c:\igor\Antigravity.exe.Workspace.Project\ДІЯ\01_Projects\Yana.Diia_v3\backend

# Встановити Python packages
pip install -r requirements.txt
```

**Очікуваний результат:** Всі пакети встановляться успішно!

---

## 🎯 Запуск Backend (Mock Mode)

### Варіант 1: Без RAG (найпростіше)

```powershell
# Створити .env файл
Copy-Item .env.example .env

# Відредагувати .env - додати хоча б один ключ:
# OPENAI_API_KEY_JUDGE=sk-proj-ваш-ключ

# Запустити сервер
python main.py
```

**Backend запуститься на:** http://localhost:8000

### Варіант 2: З Mock RAG (без Weaviate)

Якщо не хочеш встановлювати Docker/Weaviate, створю mock версію RAG:

<function_calls>
<invoke name="write_to_file">
<parameter name="CodeContent">"""
Mock RAG - без Weaviate для Demo Day
Використовує in-memory словник замість векторної БД
"""
from typing import List, Dict, Any


class MockRAG:
    """Mock implementation of RAG without Weaviate"""
    
    def __init__(self):
        # In-memory component database
        self.components = {
            "eligibility_banner": {
                "component_name": "eligibility_banner",
                "display_name": "Банер Перевірки Права",
                "category": "banner",
                "usage_context": "Показати результат автоматичної перевірки права на послугу через API",
                "props_schema": {
                    "eligible": "boolean",
                    "title": "string",
                    "message": "string"
                }
            },
            "error_modal": {
                "component_name": "error_modal",
                "display_name": "Модальне Вікно Помилки",
                "category": "modal",
                "usage_context": "Показати критичну помилку або блокуючу ситуацію",
                "props_schema": {
                    "title": "string (required)",
                    "description": "string"
                }
            },
            "form_step": {
                "component_name": "form_step",
                "display_name": "Крок Форми",
                "category": "form",
                "usage_context": "Багатокроковий флоу з формами, валідацією, навігацією",
                "props_schema": {
                    "stepNumber": "number",
                    "totalSteps": "number",
                    "fields": "array"
                }
            }
        }
        
        self.api_specs = {
            "edr": {
                "api_name": "edr",
                "api_name_ua": "Єдиний Державний Реєстр",
                "available_fields": ["edrpou", "name", "type", "status"]
            },
            "tax": {
                "api_name": "tax",
                "api_name_ua": "Податкова",
                "available_fields": ["inn", "has_debt", "simplified_tax"]
            }
        }
    
    def search_components(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Simple keyword search in components"""
        query_lower = query.lower()
        results = []
        
        for comp_name, comp_data in self.components.items():
            if query_lower in comp_data["usage_context"].lower():
                results.append(comp_data)
        
        return results[:limit] if results else [self.components["form_step"]]
    
    def get_api_specs(self) -> List[Dict[str, Any]]:
        """Get all API specifications"""
        return list(self.api_specs.values())


# Global instance
mock_rag = MockRAG()
