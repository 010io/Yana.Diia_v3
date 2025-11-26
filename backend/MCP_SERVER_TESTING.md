# 🧪 MCP Server Testing & Integration

**Created:** 23.11.2025

---

## ✅ What's Implemented

### MCP Server (`backend/mcp-servers/yana_mcp_server.py`)

**3 AI Tools:**

1. **Component Search** - RAG пошук Diia компонентів
   - Mock mode з 5 критичними компонентами
   - Ready for Weaviate integration

2. **API Caller** - Виклик державних API
   - Integration з Mock Registry
   - Supports: ЄДР, Tax, Vehicle, Land

3. **Flow Validator** - Diia Scoring Rubric
   - 5 criteria scoring (Flow Length, Component Compliance, WCAG, Saturation, API Dependency)
   - Issues detection + suggestions

### Integration Layer (`backend/services/mcp_integration.py`)

**Enhanced Flow Generation:**

- MCP Component Search → Generator LLM → Judge LLM → MCP Validation
- Full pipeline test script included

---

## 🚀 Testing

### Run MCP Tests

```bash
cd backend
python services/mcp_integration.py
```

### Expected Output

```
🧪 Testing MCP Server Integration

1️⃣ Testing Component Search...
✅ Found: error_modal

2️⃣ Testing API Caller...
✅ API Result: ФОП Mock 12345678

3️⃣ Testing Flow Validator...
✅ Validation Score: 88/100
   Passed: True

🎉 All MCP tests completed!
```

---

## 🔗 Integration з Dual-LLM

```python
from services.mcp_integration import generate_flow_with_mcp

# Generate flow з повним MCP pipeline
result = await generate_flow_with_mcp(
    brd_text="Реєстрація ФОП для IT-спеціаліста"
)

print(f"Score: {result['final_score']}/100")
print(f"Passed: {result['passed']}")
```

---

## 📊 MCP Tool Specifications

### Tool 1: `search_diia_component`

**Input:**

```json
{
  "query": "показати помилку користувачу",
  "limit": 1
}
```

**Output:**

```json
[{
  "component_name": "error_modal",
  "display_name": "Модальне Вікно Помилки",
  "usage_context": "Показати критичну помилку...",
  "props_schema": {...},
  "example_code": "<ErrorModal ... />"
}]
```

### Tool 2: `call_ukraine_api`

**Input:**

```json
{
  "api_type": "edr",
  "identifier": "12345678"
}
```

**Output:**

```json
{
  "edrpou": "12345678",
  "name": "ФОП Іваненко І.П.",
  "status": "active"
}
```

### Tool 3: `validate_flow`

**Input:**

```json
{
  "flow_json": {
    "flow_id": "test-1",
    "steps": [...]
  }
}
```

**Output:**

```json
{
  "total_score": 88,
  "breakdown": {
    "flow_length_score": 90,
    "component_compliance_score": 95,
    ...
  },
  "passed": true,
  "issues": [],
  "suggestions": [...]
}
```

---

## 🎯 Next Steps

- [ ] Test MCP integration (`python services/mcp_integration.py`)
- [ ] Integrate with Frontend API route
- [ ] Add Weaviate для real component search
- [ ] Deploy MCP server для Demo Day

---

**Status:** ✅ MCP Server Ready for Testing
