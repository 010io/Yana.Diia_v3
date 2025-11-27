# 🏗️ Yana.Diia.AI - Технічна Архітектура "Під Капотом"

**Базовано на:** Стратегічний архітектурний аналіз GovTech 2.0  
**Дата:** 23.11.2025, 03:55 EET

---

## 1. Архітектурний Дизайн

### 1.1. Технологічний Стек

**Фронтенд (UI/UX):**

- Next.js 16 / React 19 (TypeScript)
- Tailwind CSS + Diia Design System
- Компоненти:
  - `components/lego-diia/canvas.tsx` - Полотно для прототипування
  - `components/lego-diia/component-library.tsx` - Бібліотека Diia компонентів
  - `components/lego-diia/yana-analyzer.tsx` - Модуль оцінки якості flows

**Бекенд (AI Orchestration):**

- Python 3.11+ / FastAPI
- LangChain для RAG
- Weaviate для векторної БД (knowledge base)

**AI Ядро (Dual-LLM):**

1. **Generator Module:** Llama 3.1, Gemma (швидкі, економічні)
2. **Judge Module:** GPT-4 / Claude Opus (потужні, валідація)

---

## 1.2. Механізм RAG (Retrieval-Augmented Generation)

### База Знань

| Джерело | Призначення | Деталізація |
|---------|-------------|-------------|
| **Flow Data Model** | Структура послуг Дія | Векторизація `flow_data.json` (flows, services, step_components) |
| **Design System** | Правила UI/UX | Індексація diia-ui-kit (пропси, стани, поведінка) |
| **API Hub** | Доступність реєстрів | OpenAPI/Swagger specs державних API |

### Критичні компоненти для RAG

- `eligibility_banner`
- `error_modal`
- `recipient_card_single`
- `unavailable_banner`

---

## 1.3. LLM-as-a-Judge: Вбудований Аудитор

### Diia Flow Scoring Rubric

1. **Flow Length Score (25%):** Мінімально необхідна кількість кроків
2. **Component Compliance Score (30%):** Відповідність diia-ui-kit
3. **WCAG Score (20%):** Доступність
4. **Screen Saturation (15%):** Когнітивне навантаження
5. **API Dependency Checking (10%):** Автоматизація через реєстри

**Принцип:** Judge штрафує flows, що вимагають ручного введення даних, доступних через API (принцип "running data, not people").

---

## 2. Операційне Розгортання - Чек-лист

### А. Безпека (BFF Architecture)

**Backend for Frontend** - ВСІ API ключі на бекенді!

| Параметр | Призначення | Приклад | Локація |
|----------|-------------|---------|---------|
| `NODE_ENV` | Режим роботи | `production` | Frontend `.env` |
| `OPENAI_API_KEY` | Judge модуль (GPT-4) | `sk-xxxx...` | Backend `.env` |
| `CODEMIE_API_KEY` | CodeMie SDK | `cm_xxxx...` | Backend `.env` |
| `LLM_ENDPOINT_JUDGE` | URL Judge LLM | `https://api.openai.com/v1/chat/completions` | Backend `.env` |
| `LLM_ENDPOINT_GENERATOR` | URL Generator (Ollama) | `http://localhost:11434/api/generate` | Backend `.env` |
| `WEAVIATE_URL` | Векторна БД (RAG) | `http://localhost:8080/` | Backend `.env` |
| `HUGGINGFACE_API_TOKEN` | Lapa LLM (українська) | `hf_xxxx...` | Backend `.env` |

---

### Б. Dual-LLM Розгортання

#### 1. Generator (Ollama / Llama 3.1)

**Встановлення:**

```bash
# Download Ollama
curl https://ollama.ai/install.sh | sh

# Pull Llama 3.1
ollama pull llama3.1

# Run server (port 11434)
ollama serve
```

**Python клієнт:**

```python
import requests

def generate_flow(brd_text: str) -> dict:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.1",
            "prompt": f"Generate user flow for: {brd_text}",
            "stream": False
        }
    )
    return response.json()
```

#### 2. Judge Module (GPT-4 / Claude)

**FastAPI Integration:**

```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def judge_flow(flow_variants: list) -> dict:
    """Оцінює flows за Diia Flow Scoring Rubric"""
    prompt = f"""
    Evaluate these flows based on:
    - Flow Length (25%)
    - Component Compliance (30%)
    - WCAG (20%)
    - Screen Saturation (15%)
    - API Dependency (10%)
    
    Flows: {flow_variants}
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

---

### В. Ініціалізація RAG (Weaviate)

**Docker Compose для Weaviate:**

```yaml
version: '3.4'
services:
  weaviate:
    image: semitechnologies/weaviate:latest
    ports:
      - "8080:8080"
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: './data'
```

**Векторизація Diia Design System:**

```python
import weaviate

client = weaviate.Client("http://localhost:8080")

# Create schema
client.schema.create_class({
    "class": "DiiaComponent",
    "properties": [
        {"name": "name", "dataType": ["string"]},
        {"name": "props", "dataType": ["text"]},
        {"name": "usage_rules", "dataType": ["text"]}
    ]
})

# Index components
components = parse_diia_ui_kit()  # Parse from diia-ui-kit repo
for comp in components:
    client.data_object.create(comp, "DiiaComponent")
```

---

### Г. Mock Layer (Імітація API)

**Registry Mock:**

```python
# backend/mocks/registry_mock.py
MOCK_REGISTRY_DATA = {
    "edr": {
        "12345678": {
            "is_fop": True,
            "registration_date": "2020-01-15",
            "status": "active"
        }
    },
    "tax": {
        "12345678": {
            "has_debt": False,
            "last_declaration": "2024-Q3"
        }
    }
}

def get_registry_data(registry: str, rnokpp: str):
    return MOCK_REGISTRY_DATA.get(registry, {}).get(rnokpp, {})
```

**Deep Links Config:**

```json
{
  "deeplinks": {
    "fop_registration": "/services/fop-registration",
    "passport": "/documents/passport",
    "subsidies": "/services/subsidies",
    "covid_cert": "/documents/covid-certificate"
  }
}
```

---

## 3. Критичний Шлях Імплементації

### День 1-2 (23-24.11)

1. ✅ BFF setup (ключі на backend)
2. ✅ Ollama + Llama 3.1 (Generator)
3. ✅ OpenAI GPT-4 (Judge)
4. [ ] Basic Dual-LLM orchestration

### День 3-4 (25-26.11)

1. [ ] Weaviate setup
2. [ ] Парсинг diia-ui-kit
3. [ ] flow_data.json векторизація
4. [ ] RAG query implementation

### День 5 (27.11)

1. [ ] Diia Flow Scoring Rubric
2. [ ] Judge evaluation logic
3. [ ] Mock Registry API

### День 6 (28.11)

1. [ ] Lego-Diia Canvas
2. [ ] Testing + bug fixes

### День 7 (29.11)

🎯 **DEMO DAY**

---

**Status:** ТЕХНІЧНА СПЕЦИФІКАЦІЯ ЗАТВЕРДЖЕНА  
**Готово до імплементації:** 100%
