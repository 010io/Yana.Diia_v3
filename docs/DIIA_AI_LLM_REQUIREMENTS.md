# ВИМОГИ ДО ШІ-АСИСТЕНТА Yana.Diia

## Загальна Концепція

Yana.Diia — це LLM-Driven Requirements Engineering платформа для автоматизації розробки Diia послуг. Основний пайплайн:

```
BRD текст (українською) → JSON DiiaFlow → Judge оцінка → Lego UI → Production
```

## Ключові Функції

### 1. Generator LLM (Українські моделі)

**Завдання:** Перетворення BRD тексту українською на структурований DiiaFlow JSON

**Вхід:**
- Текстовий опис послуги українською (BRD)
- Контекст Diia Design System

**Вихід:**
```json
{
  "serviceName": "Виплата допомоги ВПО",
  "steps": [
    {
      "id": "step1",
      "component": "EligibilityBanner",
      "api_calls": ["nais/vpo-status"],
      "validation": ["passport", "inn"]
    }
  ]
}
```

**Українські моделі (пріоритет):**

| Модель | Розмір | Якість UA | Швидкість | Ollama | HuggingFace |
|--------|--------|-----------|-----------|--------|-------------|
| **Gemma-2-2B-UA-Instruct Q3** | ~1.1GB | ⭐⭐⭐⭐⭐ | 8-12 tok/s | ✅ | [ukr-models/gemma-2-2b-uk](https://huggingface.co/ukr-models/gemma-2-2b-uk-instruct) |
| **Llama2-7B-UA Q2** | ~3GB | ⭐⭐⭐⭐ | 5-8 tok/s | ✅ | [NikolayKozloff/Llama-2-7b-Ukr](https://huggingface.co/NikolayKozloff/Llama-2-7b-Ukrainian-Q8_0-GGUF) |
| **Phi-3-Mini-UA Q4** | 1.8GB | ⭐⭐⭐⭐ | 10 tok/s | ✅ | [LoneStriker/Phi-3.5-mini](https://huggingface.co/LoneStriker/Phi-3.5-mini-instruct-GGUF) |
| **TinyLlama-1.1B-UA Q4** | 650MB | ⭐⭐⭐ | 15+ tok/s | ✅ | Custom UA datasets |

**Рекомендація:** Gemma-2-2B-UA Q3 — найкраща для Diia (fine-tune на ZNO/legal UA текстах, NPU accel на Android)

**MCP Tools Integration:**
- `search_diia_component` — RAG Weaviate для Diia Design System (50+ компонентів)
- `call_ukraine_api` — Mock/Real: EDR, ДПС, ПФУ, fiscal.gov.ua
- `validate_flow` — Перевірка за rubric (WCAG, Diia DS compliance)

### 2. Judge LLM (Оцінка якості)

**Завдання:** Оцінка згенерованого flow за 5 метриками

**Scoring Rubric (0-100):**

| Метрика | Вага | Опис | Критерії |
|---------|------|------|----------|
| **Flow Length** | 25% | Оптимальна кількість кроків | 3-8 steps = 100%, <3 або >8 = penalty |
| **Component Compliance** | 30% | Використання Diia DS | >80% Diia компонентів = 100% |
| **WCAG** | 20% | Доступність | A11y labels, contrast 4.5:1, keyboard nav |
| **Screen Saturation** | 15% | Заповненість екрану | >70% screen filled = optimal |
| **API Dependency** | 10% | Інтеграція з держ. API | ≥2 real APIs = 100% |

**Вихід:**
```json
{
  "score": 85,
  "passed": true,
  "feedback": {
    "issues": [
      {
        "severity": "medium",
        "message": "Крок 3: відсутня валідація ІПН",
        "fix_suggestion": "Додати validation: ['inn']"
      }
    ]
  }
}
```

**Моделі для Judge:**
- **Primary:** Gemma-2-9B-UA (якщо є ресурси)
- **Fallback:** Qwen2.5-7B-Instruct (добра підтримка UA)
- **Cloud (Demo Day):** GPT-4 / CodeMie (для швидкості)

### 3. RAG & Інтеграції

**Weaviate Schema (DiiaComponents):**
```json
{
  "class": "DiiaComponent",
  "properties": [
    {"name": "componentName", "dataType": ["text"]},
    {"name": "category", "dataType": ["text"]},
    {"name": "usage", "dataType": ["text"]},
    {"name": "wcag_compliant", "dataType": ["boolean"]}
  ]
}
```

**50+ Diia UI компонентів:**
- EligibilityBanner, FormStep, DocumentUpload, PaymentCard, StatusTracker, etc.

**Mock APIs (6 державних endpoints):**
1. NAIS — статус ВПО
2. ДПС — податкова інформація
3. ПФУ — пенсійні дані
4. fiscal.gov.ua — e-чеки
5. YouControl — EDR
6. Data.gov.ua — відкриті дані

### 4. Output & Export

**Формати експорту:**
- **Lego UI:** Drag-and-drop React конструктор
- **JSON:** DiiaFlow schema для API
- **Figma:** Design handoff
- **HTML/CSS:** Hackathon mockups
- **Blockchain Audit:** Sepolia testnet (immutable trail)

## Non-Functional Requirements

### Ukrainian-First
- Всі промпти, UI, документація українською
- Моделі з fine-tune на українських датасетах
- Підтримка української граматики та термінології

### WCAG AA Compliance
- Contrast ratio ≥ 4.5:1
- Keyboard navigation
- Screen reader support
- Alt text для всіх зображень

### Diia Design System
- Використання офіційних компонентів
- Дотримання spacing/typography guidelines
- Diia color palette

### Mock Mode (Demo Day)
- Offline робота без реальних API
- Симуляція blockchain транзакцій
- Fake data generators

## Локальний Запуск (Termux Android)

### 1. Termux Setup (POCO C65 / Xiaomi)

```bash
pkg update && pkg upgrade
pkg install cmake git clang make python nodejs
termux-setup-storage  # Доступ до файлів
```

### 2. llama.cpp Build

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
export CC=clang CXX=clang++
make -j$(nproc) LLAMA_CURL=1 LLAMA_ANDROID=1
```

### 3. Download UA Model (Gemma-2-2B-UA)

```bash
cd ~/storage/shared/
wget https://huggingface.co/ukr-models/gemma-2-2b-uk-instruct/resolve/main/gemma-2-2b-uk-instruct-Q3_K_M.gguf
```

### 4. Run Server

```bash
./llama-server \
  -m gemma-2-2b-uk-instruct-Q3_K_M.gguf \
  --host 0.0.0.0 \
  -p 8080 \
  -c 2048 \
  -ngl 10
```

**Доступ:** http://127.0.0.1:8080

**Швидкість:** ~10 tok/s на POCO C65 (4GB RAM)

### Ollama Alternative

```bash
pkg install ollama
ollama pull gemma2:2b  # Auto quant
ollama run gemma2:2b "Привіт, Дія!"
```

## Finance.AI Integration (Локальний ШІ)

### Концепція
Mono чеки → автоматичний підбір пільг/субсидій (ДПС, ПФУ, fiscal.gov.ua)

### Архітектура (Hybrid)

**Offline:**
- ШІ класифікує чек (категорія: комуналка → субсидія)
- Rule-based matching + LLM score

**Online:**
- Mono API (statement)
- ДПС e-чек (QR парсинг)

### Implementation

```python
import requests
import json

MODEL_URL = "http://127.0.0.1:8080/completion"

def analyze_check(check_text, mono_token):
    # Offline: Rule match
    subsidies = {
        "комуналка": "Субсидія +2500 грн (ЖКГ)",
        "АТБ": "Кешбек 150 грн (продукти)",
        "аптека": "Компенсація ліки 500 грн"
    }
    matched = [v for k,v in subsidies.items() if k in check_text.lower()]
    
    # LLM UA
    prompt = f"""З чека '{check_text}' підбери доступні пільги та субсидії в Україні.
    Формат: назва пільги, сума, умови отримання."""
    
    resp = requests.post(MODEL_URL, json={
        "prompt": prompt,
        "temperature": 0.3,
        "max_tokens": 200
    })
    llm_suggest = resp.json()["content"]
    
    # Online Mono (якщо є token)
    if mono_token:
        mono_resp = requests.get(
            "https://api.monobank.ua/personal/statement/0/2025/11",
            headers={"X-Token": mono_token}
        )
        transactions = mono_resp.json()
    else:
        transactions = []
    
    return {
        "matched_rules": matched,
        "llm_suggestions": llm_suggest,
        "mono_transactions": transactions
    }

# Запуск
result = analyze_check("АТБ 500 грн продукти", mono_token=None)
print(result)
```

### ДПС API Integration

```python
import pyzbar.pyzbar as pyzbar
from PIL import Image

def parse_fiscal_qr(image_path):
    """Парсинг QR коду з чека fiscal.gov.ua"""
    img = Image.open(image_path)
    decoded = pyzbar.decode(img)
    
    for obj in decoded:
        qr_data = obj.data.decode('utf-8')
        # Parse fiscal.gov.ua format
        return parse_fiscal_data(qr_data)
```

**Test на POCO:** ~5s/чек

## Рекомендовані Пристрої

| Пристрій | RAM | Процесор | Швидкість | Ціна |
|----------|-----|----------|-----------|------|
| **POCO M6 Pro** | 8GB | Helio G99 | 6-10 tok/s | ~$150 |
| **POCO F6** | 12GB | SD 8s Gen3 NPU | 20+ tok/s | ~$400 |
| **Xiaomi 14** | 16GB | SD 8 Gen3 | 40 tok/s | ~$800 |

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Agent (Богдан) — HTML генерація                            │
│  ↓                                                           │
│  Yana Lego (/api/import-html) — Парсинг HTML → JSON        │
│  ↓                                                           │
│  Drag-drop Editor (Ігор - Vercel) — Візуальне редагування  │
│  ↓                                                           │
│  JSON Output — DiiaFlow schema                              │
│  ↓                                                           │
│  Diia Testnet Deployment — Blockchain audit                 │
│  ↓                                                           │
│  Production (DevOps - Володимир) — Deploy на Vercel/AWS    │
└─────────────────────────────────────────────────────────────┘
```

## Ресурси

### Українські LLM
- [Gemma-2-2B-UA](https://huggingface.co/ukr-models/gemma-2-2b-uk-instruct)
- [Llama2-7B-UA](https://huggingface.co/NikolayKozloff/Llama-2-7b-Ukrainian-Q8_0-GGUF)
- [Phi-3-Mini-UA](https://huggingface.co/LoneStriker/Phi-3.5-mini-instruct-GGUF)

### Diia Integration
- [Diia API Docs](https://integration.diia.gov.ua/en/home.html)
- [Diia Design System](https://design.diia.gov.ua)
- [fiscal.gov.ua Open Data](https://fiscal.gov.ua/open/data)

### Tools
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Ollama](https://ollama.ai)
- [Termux](https://termux.dev)

---

**Статус:** 🚀 Ready for Demo Day (29.11.2025)

**Команда Be-Transparent:**
- 🧑‍💻 Наталія Ільчук — Капітан & PM
- 🧑‍💼 Ігор Омельченко — AI Архітектор
- ⚡ Богдан Параниця — AI Lead
- 💻 Володимир Сеферов — DevOps
- 🎨 Дарія Шевчук — Frontend/QA
