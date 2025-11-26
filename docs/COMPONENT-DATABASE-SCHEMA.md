# 🗄️ Component Database Schema

**Diia Design System Components для RAG**  
**Дата:** 23.11.2025

---

## 📊 Database Choice: Weaviate (Vector DB)

**Чому Weaviate?**

- ✅ Векторний пошук (семантичний)
- ✅ GraphQL API
- ✅ Швидка інтеграція з LangChain
- ✅ Docker ready

---

## 🏗️ Schema Definition

### Class: DiiaComponent

```python
# backend/db/weaviate_schema.py
import weaviate

client = weaviate.Client("http://localhost:8080")

DIIA_COMPONENT_SCHEMA = {
    "class": "DiiaComponent",
    "description": "Diia Design System UI component",
    "vectorizer": "text2vec-transformers",
    "properties": [
        {
            "name": "component_name",
            "dataType": ["string"],
            "description": "Component identifier (e.g. 'eligibility_banner')"
        },
        {
            "name": "display_name",
            "dataType": ["string"],
            "description": "Ukrainian display name"
        },
        {
            "name": "category",
            "dataType": ["string"],
            "description": "Component category: banner, form, card, modal, navigation"
        },
        {
            "name": "usage_context",
            "dataType": ["text"],
            "description": "When to use this component (vectorized for search)"
        },
        {
            "name": "props_schema",
            "dataType": ["text"],
            "description": "JSON schema of component props"
        },
        {
            "name": "accessibility_level",
            "dataType": ["string"],
            "description": "WCAG level: A, AA, AAA"
        },
        {
            "name": "example_code",
            "dataType": ["text"],
            "description": "React/TypeScript usage example"
        },
        {
            "name": "diia_kit_url",
            "dataType": ["string"],
            "description": "Link to diia-ui-kit repo"
        }
    ]
}

# Create schema
client.schema.create_class(DIIA_COMPONENT_SCHEMA)
```

---

## 📦 Critical Components to Index

### 1. eligibility_banner

```json
{
  "component_name": "eligibility_banner",
  "display_name": "Банер Перевірки Права",
  "category": "banner",
  "usage_context": "Показати результат автоматичної перевірки права на послугу через API. Використовувати замість ручного введення даних.",
  "props_schema": {
    "type": "object",
    "properties": {
      "eligible": {"type": "boolean"},
      "title": {"type": "string"},
      "message": {"type": "string"},
      "actionLabel": {"type": "string"}
    }
  },
  "accessibility_level": "AA",
  "example_code": "<EligibilityBanner eligible={true} title='Ви маєте право' message='Перевірка через ЄДР пройдена' />",
  "diia_kit_url": "https://github.com/diia-open-source/diia-ui-kit/tree/main/components/eligibility-banner"
}
```

### 2. error_modal

```json
{
  "component_name": "error_modal",
  "display_name": "Модальне Вікно Помилки",
  "category": "modal",
  "usage_context": "Показати критичну помилку або блокуючу ситуацію. Вимагає дії користувача.",
  "props_schema": {
    "type": "object",
    "properties": {
      "title": {"type": "string", "required": true},
      "description": {"type": "string"},
      "primaryAction": {"type": "object"},
      "secondaryAction": {"type": "object"}
    }
  },
  "accessibility_level": "AA",
  "example_code": "<ErrorModal title='Помилка' description='Сервіс недоступний' primaryAction={{label: 'Спробувати ще', onClick: retry}} />"
}
```

### 3. recipient_card_single

```json
{
  "component_name": "recipient_card_single",
  "display_name": "Картка Отримувача",
  "category": "card",
  "usage_context": "Відобразити дані отримувача послуги, попередньо завантажені через API (ПІБ, РНОКПП, адреса).",
  "props_schema": {
    "type": "object",
    "properties": {
      "fullName": {"type": "string"},
      "inn": {"type": "string"},
      "address": {"type": "string"},
      "editable": {"type": "boolean", "default": false}
    }
  },
  "accessibility_level": "AA",
  "example_code": "<RecipientCardSingle fullName='Шевченко Т.Г.' inn='1234567890' address='Київ' />"
}
```

### 4. unavailable_banner

```json
{
  "component_name": "unavailable_banner",
  "display_name": "Банер Недоступності",
  "category": "banner",
  "usage_context": "Показати що послуга тимчасово недоступна через технічні причини або відсутність даних в реєстрі.",
  "props_schema": {
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "reason": {"type": "string"},
      "estimatedRestore": {"type": "string"}
    }
  },
  "accessibility_level": "AA",
  "example_code": "<UnavailableBanner title='Послуга недоступна' reason='Технічні роботи' estimatedRestore='12:00' />"
}
```

### 5. form_step

```json
{
  "component_name": "form_step",
  "display_name": "Крок Форми",
  "category": "form",
  "usage_context": "Багатокроковий флоу з формами. Містить поля, валідацію, кнопки навігації.",
  "props_schema": {
    "type": "object",
    "properties": {
      "stepNumber": {"type": "number"},
      "totalSteps": {"type": "number"},
      "fields": {"type": "array"},
      "onNext": {"type": "function"},
      "onBack": {"type": "function"}
    }
  },
  "accessibility_level": "AA",
  "example_code": "<FormStep stepNumber={1} totalSteps={4} fields={[...]} onNext={handleNext} />"
}
```

---

## 🔍 Indexing Script

**Файл:** `backend/scripts/index_components.py`

```python
import weaviate
import json

client = weaviate.Client("http://localhost:8080")

# Load components from Diia UI Kit parse
with open("backend/data/diia_components.json") as f:
    components = json.load(f)

# Index each component
for comp in components:
    client.data_object.create(
        data_object=comp,
        class_name="DiiaComponent"
    )

print(f"Indexed {len(components)} components")
```

---

## 🔎 Search Query Example

### Usage in MCP Tool

```python
# backend/mcp/tools/component_search.py
import weaviate

def search_component(user_intent: str) -> dict:
    """
    Example:
    user_intent = "показати що користувач має право на послугу"
    -> Returns: eligibility_banner
    """
    
    client = weaviate.Client("http://localhost:8080")
    
    result = (
        client.query
        .get("DiiaComponent", [
            "component_name",
            "display_name",
            "props_schema",
            "example_code"
        ])
        .with_near_text({"concepts": [user_intent]})
        .with_limit(1)
        .do()
    )
    
    return result["data"]["Get"]["DiiaComponent"][0]
```

### Test Cases

| User Intent (Ukrainian) | Expected Component |
|------------------------|-------------------|
| "показати помилку" | `error_modal` |
| "форма з кількома кроками" | `form_step` |
| "результат перевірки права" | `eligibility_banner` |
| "сервіс не працює" | `unavailable_banner` |
| "ПІБ та РНОКПП з API" | `recipient_card_single` |

---

## 🗂️ Additional Schema: FlowTemplate

### Class: FlowTemplate

```python
FLOW_TEMPLATE_SCHEMA = {
    "class": "FlowTemplate",
    "description": "Pre-built Diia service flow templates",
    "properties": [
        {
            "name": "service_name",
            "dataType": ["string"],
            "description": "e.g. 'FOP Registration'"
        },
        {
            "name": "steps",
            "dataType": ["text"],
            "description": "JSON array of flow steps"
        },
        {
            "name": "required_apis",
            "dataType": ["string[]"],
            "description": "APIs needed: ['edr', 'tax']"
        },
        {
            "name": "estimated_completion_time",
            "dataType": ["int"],
            "description": "Minutes to complete"
        },
        {
            "name": "wcag_score",
            "dataType": ["number"],
            "description": "Accessibility score (0-100)"
        }
    ]
}
```

### Example Flow Template

```json
{
  "service_name": "fop_registration",
  "steps": [
    {
      "step_id": 1,
      "type": "api_check",
      "component": "eligibility_banner",
      "api_call": "edr",
      "description": "Перевірка чи є вже діючий ФОП"
    },
    {
      "step_id": 2,
      "type": "form",
      "component": "form_step",
      "fields": ["kved", "tax_system"],
      "description": "Вибір КВЕД та системи оподаткування"
    },
    {
      "step_id": 3,
      "type": "signature",
      "component": "diia_signature",
      "description": "Підписання заяви через Дія.Підпис"
    },
    {
      "step_id": 4,
      "type": "confirmation",
      "component": "success_banner",
      "description": "Заявку відправлено"
    }
  ],
  "required_apis": ["edr", "tax"],
  "estimated_completion_time": 5,
  "wcag_score": 95
}
```

---

## 🚀 Setup Instructions

### 1. Start Weaviate

```bash
docker run -d \
  -p 8080:8080 \
  -e QUERY_DEFAULTS_LIMIT=25 \
  -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED='true' \
  semitechnologies/weaviate:latest
```

### 2. Create Schema

```bash
cd backend
python scripts/create_weaviate_schema.py
```

### 3. Index Components

```bash
python scripts/index_components.py
```

### 4. Test Search

```bash
python scripts/test_component_search.py
```

---

## ✅ Checklist

- [ ] Weaviate running (`docker ps`)
- [ ] Schema created (DiiaComponent, FlowTemplate)
- [ ] Components indexed (minimum 5 critical ones)
- [ ] Search query tested (semantic similarity working)
- [ ] MCP tool integrated with search

---

**Статус:** ✅ Schema Ready  
**Наступний крок:** Flow Data Model
