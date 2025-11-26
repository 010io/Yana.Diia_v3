# 🧪 Mock Registry API Testing Guide

**Backend:** Yana.Diia.AI  
**Created:** 23.11.2025

---

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd backend
python main.py
```

Server буде доступний на: `http://localhost:8000`

---

## 📝 API Endpoints

### 1. ЄДР (Єдиний Державний Реєстр)

```bash
# Test with existing data
curl http://localhost:8000/api/mock/edr/12345678

# Response
{
  "edrpou": "12345678",
  "name": "ФОП Іваненко Іван Петрович",
  "type": "fop",
  "status": "active",
  "registration_date": "2020-01-15"
}

# Test 404
curl http://localhost:8000/api/mock/edr/99999999
```

### 2. Податкова (Tax API)

```bash
curl http://localhost:8000/api/mock/tax/1234567890

# Response
{
  "inn": "1234567890",
  "taxpayer_type": "fop",
  "debts": {"has_debt": false, "total_amount": 0},
  "last_declaration": {"period": "2024-Q3"}
}
```

### 3. Транспорт (Vehicle Registry)

```bash
curl http://localhost:8000/api/mock/vehicle/AA1234BB

# Response
{
  "license_plate": "AA1234BB",
  "vin": "WBADT43452G123456",
  "vehicle": {"brand": "BMW", "model": "X5"}
}
```

### 4. Diia Documents

```bash
curl "http://localhost:8000/api/mock/diia/documents/passport?inn=1234567890"

# Response
{
  "document_type": "passport",
  "data": {
    "series": "ЕН",
    "number": "123456",
    "full_name": "Шевченко Тарас Григорович"
  }
}
```

### 5. Subsidies Check

```bash
curl -X POST http://localhost:8000/api/mock/subsidies/check \
  -H "Content-Type: application/json" \
  -d '{
    "inn": "1234567890",
    "full_name": "Іваненко І.П.",
    "family_size": 4,
    "total_monthly_income": 12000,
    "utilities_cost": 7000
  }'

# Response
{
  "eligible": true,
  "subsidy_amount": 2500,
  "coverage_percentage": 35
}
```

### 6. Land Cadastre

```bash
curl http://localhost:8000/api/mock/land/0123456789:01:234:5678

# Response
{
  "cadastral_number": "0123456789:01:234:5678",
  "area": 0.25,
  "ownership": {"type": "private"}
}
```

---

## ✅ Testing Checklist

- [ ] Backend запущений (`python main.py`)
- [ ] Health check працює (`/health`)
- [ ] ЄДР API повертає дані
- [ ] Tax API повертає дані
- [ ] Vehicle API повертає дані (з fallback для невідомих номерів)
- [ ] Diia Docs API працює
- [ ] Subsidies calculation правильний
- [ ] Land API повертає mock дані

---

## 🔗 Integration з Frontend

```typescript
// lib/api-client.ts
export async function getCompanyData(edrpou: string) {
  const response = await fetch(`http://localhost:8000/api/mock/edr/${edrpou}`);
  if (!response.ok) throw new Error('Company not found');
  return response.json();
}

export async function checkTaxStatus(inn: string) {
  const response = await fetch(`http://localhost:8000/api/mock/tax/${inn}`);
  return response.json();
}
```

---

**Статус:** ✅ Mock Registry API Ready
