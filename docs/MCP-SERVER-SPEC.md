# 🤖 MCP Server Specification

**Model Context Protocol для Yana.Diia.AI**  
**Дата:** 23.11.2025

---

## 🎯 Що таке MCP?

**MCP (Model Context Protocol)** - стандарт для підключення LLM до зовнішніх інструментів та даних.

### Використання в Yana.Diia.AI

1. **RAG для Diia Design System** - пошук компонентів
2. **API Hub Integration** - виклик державних API
3. **Flow Validation** - перевірка згенерованих flows

---

## 📁 Структура MCP Server

```
backend/mcp/
├── server.py           # Головний MCP сервер
├── tools/
│   ├── component_search.py   # Пошук Diia компонентів
│   ├── api_caller.py          # Виклик державних API
│   └── flow_validator.py      # Валідація flows
└── prompts/
    ├── diia_system.txt        # Системний промпт для Diia
    └── judge_rubric.txt       # Rubric для Judge LLM
```

---

## 🔌 MCP Tools

### 1. Component Search (RAG)

**Призначення:** Знайти правильний Diia компонент для user flow

```python
# backend/mcp/tools/component_search.py
from mcp import Tool

@Tool(
    name="search_diia_component",
    description="Search Diia Design System for UI component"
)
async def search_component(query: str) -> dict:
    """
    Args:
        query: User intent (e.g. "show error message")
    
    Returns:
        {
            "component_name": "error_modal",
            "props": {...},
            "usage_example": "..."
        }
    """
    # Query Weaviate vector DB
    results = weaviate_client.query.get(
        "DiiaComponent",
        ["name", "props", "usage_rules"]
    ).with_near_text({"concepts": [query]}).do()
    
    return results["data"]["Get"]["DiiaComponent"][0]
```

**Приклад виклику (LLM):**

```python
# LLM prompt
"User wants to show error when service unavailable. Find component."

# MCP response
{
  "component_name": "unavailable_banner",
  "props": {
    "title": "Послуга тимчасово недоступна",
    "type": "error"
  },
  "usage_example": "<UnavailableBanner title='...' />"
}
```

---

### 2. API Caller

**Призначення:** Викликати державні API для автозаповнення

```python
# backend/mcp/tools/api_caller.py
@Tool(
    name="call_ukraine_api",
    description="Call Ukrainian government API (EDR, Tax, Vehicle, etc.)"
)
async def call_api(
    api_type: str,  # "edr", "tax", "vehicle"
    identifier: str  # edrpou, inn, plate
) -> dict:
    """
    Returns data from government registries
    """
    endpoint = API_ENDPOINTS[api_type]
    response = await http_client.get(f"{endpoint}/{identifier}")
    return response.json()
```

**Приклад:**

```python
# LLM decides to pre-fill FOP data
await call_api(api_type="edr", identifier="12345678")

# Returns
{
  "name": "ФОП Іваненко І.П.",
  "status": "active",
  "registration_date": "2020-01-15"
}
```

---

### 3. Flow Validator (Judge)

**Призначення:** Оцінити згенерований flow за Diia Rubric

```python
# backend/mcp/tools/flow_validator.py
@Tool(
    name="validate_flow",
    description="Score user flow using Diia Flow Scoring Rubric"
)
async def validate_flow(flow_json: dict) -> dict:
    """
    Scores:
    - Flow Length (25%)
    - Component Compliance (30%)
    - WCAG (20%)
    - Screen Saturation (15%)
    - API Dependency (10%)
    """
    scores = {
        "flow_length": calculate_flow_length_score(flow_json),
        "component_compliance": check_diia_components(flow_json),
        "wcag": check_accessibility(flow_json),
        "screen_saturation": calculate_cognitive_load(flow_json),
        "api_dependency": check_api_usage(flow_json)
    }
    
    total = (
        scores["flow_length"] * 0.25 +
        scores["component_compliance"] * 0.30 +
        scores["wcag"] * 0.20 +
        scores["screen_saturation"] * 0.15 +
        scores["api_dependency"] * 0.10
    )
    
    return {
        "total_score": total,
        "breakdown": scores,
        "passed": total >= 70
    }
```

---

## 🚀 MCP Server Setup

### Installation

```bash
cd backend
pip install mcp anthropic weaviate-client
```

### Server Configuration

**Файл:** `backend/mcp/server.py`

```python
from mcp import Server
from tools.component_search import search_component
from tools.api_caller import call_api
from tools.flow_validator import validate_flow

# Initialize MCP server
server = Server(name="yana-diia-mcp")

# Register tools
server.add_tool(search_component)
server.add_tool(call_api)
server.add_tool(validate_flow)

# Run server
if __name__ == "__main__":
    server.run(port=8001)
```

### Запуск

```bash
python backend/mcp/server.py
```

---

## 🔗 Integration з LLM

### Generator (Llama 3.1)

```python
# backend/ai/generator.py
import requests

def generate_flow(brd_text: str) -> dict:
    # Generator uses MCP tools via special syntax
    prompt = f"""
    Generate user flow for: {brd_text}
    
    Available tools:
    - search_diia_component(query)
    - call_ukraine_api(api_type, identifier)
    
    Use tools to find correct components and pre-fill data.
    """
    
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.1",
            "prompt": prompt,
            "tools": ["http://localhost:8001/tools"]  # MCP endpoint
        }
    )
    
    return response.json()
```

### Judge (GPT-4)

```python
# backend/ai/judge.py
from openai import OpenAI

def judge_flow(flow_variants: list) -> dict:
    client = OpenAI()
    
    # Judge uses validate_flow MCP tool
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Validate these flows: {flow_variants}"
        }],
        tools=[{
            "type": "function",
            "function": {
                "name": "validate_flow",
                "description": "Score flow using Diia Rubric",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "flow_json": {"type": "object"}
                    }
                }
            }
        }]
    )
    
    return response.choices[0].message.tool_calls[0].function.arguments
```

---

## 📊 Demo Day Scenario

### Input (BRD)

```
"Реєстрація ФОП для IT-спеціаліста"
```

### MCP Workflow

1. **Generator викликає:** `search_diia_component("форма реєстрації ФОП")`
   - **MCP повертає:** `form_step` component

2. **Generator викликає:** `call_ukraine_api("edr", "12345678")`
   - **MCP повертає:** Дані про існуючих ФОП (для перевірки)

3. **Generator створює flow** (4 кроки)

4. **Judge викликає:** `validate_flow(generated_flow)`
   - **MCP повертає:**

     ```json
     {
       "total_score": 85,
       "breakdown": {
         "flow_length": 90,
         "component_compliance": 95,
         "wcag": 80,
         "screen_saturation": 75,
         "api_dependency": 85
       },
       "passed": true
     }
     ```

---

## 🔐 Security

### Environment Variables

```bash
# backend/.env
MCP_SERVER_PORT=8001
MCP_API_KEY=your_secret_key
WEAVIATE_URL=http://localhost:8080
```

### Authentication

```python
# backend/mcp/server.py
from mcp import Server

server = Server(
    name="yana-diia-mcp",
    auth_token=os.getenv("MCP_API_KEY")
)
```

---

## ✅ Checklist

- [ ] MCP server installed (`pip install mcp`)
- [ ] Tools registered (component_search, api_caller, flow_validator)
- [ ] Weaviate running for RAG
- [ ] LLM configured to use MCP endpoint
- [ ] Mock APIs working for Demo Day

---

**Статус:** ✅ Architecture Defined  
**Наступний крок:** Component Database Schema
