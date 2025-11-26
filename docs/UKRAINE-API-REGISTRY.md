# 🇺🇦 Ukraine API Registry

**Для:** Yana.Diia.AI | **Дата:** 23.11.2025

---

## 📋 Державні API

### 1. ЄДР (Єдиний Державний Реєстр)

**Провайдер:** Мін'юст України  
**Endpoint:** `GET /api/mock/edr/{edrpou}`

```json
{
  "edrpou": "12345678",
  "name": "ФОП Іваненко І.П.",
  "type": "fop",
  "status": "active",
  "registration_date": "2020-01-15"
}
```

---

### 2. Податкова (ДПС)

**Endpoint:** `GET /api/mock/tax/{inn}`

```json
{
  "inn": "1234567890",
  "has_debt": false,
  "last_declaration": "2024-Q3",
  "simplified_tax": true
}
```

---

### 3. Diia Documents

**Endpoint:** `GET /api/mock/diia/documents/{type}`

**Types:** `passport`, `driver_license`, `vehicle_license`, `covid_cert`

```json
{
  "document_type": "passport",
  "data": {
    "series": "ЕН",
    "number": "123456",
    "full_name": "Шевченко Т.Г.",
    "birth_date": "1990-05-20"
  }
}
```

---

### 4. Транспорт (МРЕО)

**Endpoint:** `GET /api/mock/vehicle/{plate}`

```json
{
  "license_plate": "AA1234BB",
  "brand": "BMW",
  "model": "X5",
  "year": 2019,
  "owner_inn": "1234567890"
}
```

---

### 5. Субсидії

**Endpoint:** `POST /api/mock/subsidies/check`

```json
{
  "eligible": true,
  "subsidy_amount": 2500,
  "required_docs": ["utility_bills", "income_statement"]
}
```

---

## 🔧 Mock Server

**Файл:** `backend/api/mock_registry.py`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/mock/edr/{edrpou}")
async def get_edr(edrpou: str):
    return {
        "edrpou": edrpou,
        "name": f"Mock Company {edrpou}",
        "status": "active"
    }
```

**Запуск:**

```bash
cd backend
uvicorn api.mock_registry:app --reload --port 8000
```

---

## 🔐 Security (BFF Pattern)

```typescript
// Frontend - НЕ викликати API напряму!
export async function getCompanyData(edrpou: string) {
  const response = await fetch(`/api/proxy/edr/${edrpou}`);
  return response.json();
}
```

```python
# Backend - API ключі тут
@app.get("/api/proxy/edr/{edrpou}")
async def proxy_edr(edrpou: str):
    api_key = os.getenv("OPENDATABOT_API_KEY")
    # Call external API securely
```

---

**Статус:** ✅ Ready for Demo Day
