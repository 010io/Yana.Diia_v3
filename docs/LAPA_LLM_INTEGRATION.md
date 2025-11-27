# 🇺🇦 Lapa LLM Integration Guide

## Офіційний спосіб використання Lapa LLM для Yana.Diia.AI

### 🟢 HuggingFace Inference API

**API Endpoint:**

```
https://api-inference.huggingface.co/models/lapa-ai/lapa-7b
```

---

## Python Integration (Backend)

### Базовий приклад

```python
from huggingface_hub import InferenceApi

# Ініціалізація
lapa = InferenceApi(repo_id="lapa-ai/lapa-7b")

# Генерація BRD
result = lapa(inputs="Згенеруй BRD для державної послуги реєстрації ФОП")
print(result)
```

### З параметрами

```python
from huggingface_hub import InferenceApi

lapa = InferenceApi(
    repo_id="lapa-ai/lapa-7b",
    token="hf_yourapitoken"  # Optional для більше запитів
)

response = lapa(
    inputs="Створи acceptance criteria для держпослуги пошуку пільг",
    parameters={
        "max_length": 1024,
        "temperature": 0.8,
        "top_p": 0.9
    }
)
```

### Інтеграція в Yana Backend

```python
# backend/services/lapa_service.py
import os
from huggingface_hub import InferenceApi

class LapaService:
    def __init__(self):
        self.api = InferenceApi(
            repo_id="lapa-ai/lapa-7b",
            token=os.getenv("HUGGINGFACE_API_TOKEN")
        )
    
    def generate_brd(self, service_description: str) -> str:
        """Generate BRD from service description in Ukrainian"""
        prompt = f"Згенеруй детальний BRD для державної послуги: {service_description}"
        result = self.api(inputs=prompt, parameters={"max_length": 2048})
        return result[0]["generated_text"]
    
    def generate_acceptance_criteria(self, user_story: str) -> list:
        """Generate acceptance criteria from user story"""
        prompt = f"Створи acceptance criteria для: {user_story}"
        result = self.api(inputs=prompt, parameters={"max_length": 1024})
        return result[0]["generated_text"].split("\n")
```

---

## Node.js / JavaScript Integration (Frontend)

### Fetch API

```javascript
async function generateWithLapa(prompt) {
  const response = await fetch('https://api-inference.huggingface.co/models/lapa-ai/lapa-7b', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer hf_yourapitoken',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      inputs: prompt,
      parameters: {
        max_length: 1024,
        temperature: 0.8
      }
    })
  });
  
  const result = await response.json();
  return result[0].generated_text;
}

// Використання
const brd = await generateWithLapa("Згенеруй BRD для е-малятко послуги");
```

### Aixos

```javascript
import axios from 'axios';

const lapaAPI = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models/lapa-ai',
  headers: {
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function generateBRD(description) {
  const { data } = await lapaAPI.post('/lapa-7b', {
    inputs: `Створи BRD для: ${description}`,
    parameters: { max_length: 2048, temperature: 0.7 }
  });
  
  return data[0].generated_text;
}
```

---

## Environment Variables

### Backend (.env)

```bash
HUGGINGFACE_API_TOKEN=hf_your_token_here
LAPA_MODEL_ID=lapa-ai/lapa-7b
LAPA_MAX_LENGTH=2048
LAPA_TEMPERATURE=0.8
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_HUGGINGFACE_API_TOKEN=hf_your_token_here
```

---

## API Limits & Credits

### Безкоштовно

- 1000-2000 запитів/годину
- До 10,000 запитів/добу з акаунта
- Для hackathon це більш ніж достатньо

### При перевищенні

- Почекай 10 хвилин
- Або отримай HuggingFace PRO (не потрібно для хакатону)

---

## Інтеграція в Yana.Diia.AI

### Use Cases

1. **BRD Generation (українською):**

   ```python
   brd = lapa_service.generate_brd("Послуга для виплати допомоги ВПО")
   ```

2. **User Stories:**

   ```python
   user_story = lapa_service.generate_user_story(brd_text)
   ```

3. **Acceptance Criteria:**

   ```python
   criteria = lapa_service.generate_acceptance_criteria(user_story)
   ```

4. **Flow Descriptions:**

   ```python
   flow_desc = lapa_service.generate_flow_description(service_name)
   ```

### Архітектура

```
User Input (BRD) 
  ↓
Lapa LLM (Ukrainian text generation)
  ↓
CodeMie SDK (Flow + UI generation)
  ↓
Yana Output (User Stories + UI mockups)
```

---

## Quick Test

### Web Interface

Швидко протестувати: <https://huggingface.co/spaces/lapa-ai/lapa-chat>

### Local Test

```python
from huggingface_hub import InferenceApi

lapa = InferenceApi(repo_id="lapa-ai/lapa-7b")
result = lapa(inputs="Привіт! Створи приклад BRD для держпослуги")
print(result[0]["generated_text"])
```

---

## Benefits for Yana

- ✅ **Українська мова** - native Ukrainian text generation
- ✅ **Open Source** - можна показати на Demo Day
- ✅ **Free for hackathon** - no costs
- ✅ **Офіційний API** - stable infrastructure
- ✅ **Комбінується з CodeMie** - best of both worlds

---

## Next Steps

1. Додати `lapa_service.py` в `backend/services/`
2. Оновити `.env` з HuggingFace token
3. Інтегрувати в `/api/generate` endpoint
4. Тестувати генерацію BRD українською
5. Показати на Demo Day як "ukrainian-first AI"

---

**Готово для інтеграції! 🚀🇺🇦**
