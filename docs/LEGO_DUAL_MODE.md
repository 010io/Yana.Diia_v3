# 🧱 LEGO-Diia Dual Mode System

![LEGO-Diia Concept](../assets/images/lego-diia-concept.jpg)

> **Київ 2077 × Diia.AI HUB** — візуалізація концепції модульної збірки державних сервісів

## 🎯 Огляд

LEGO-Diia — це революційна система візуального конструювання державних цифрових послуг України. Система працює у двох режимах, що дозволяє швидко прототипувати на хакатонах та розгортати production-ready рішення.

## 🔄 Два режими роботи

### 🚀 Hackathon Mode (Швидкий прототип)

**Призначення:** Швидка демонстрація концепції за години, не дні.

**Що генерує:**
- HTML/CSS mockups для презентації
- Figma-ready експорт для дизайнерів
- Інтерактивні прототипи без backend

**Переваги:**
- ⚡ Генерація за секунди
- 🎨 Візуально ідентичний production
- 📱 Responsive design з коробки
- 🔗 Shareable посилання для демо

```typescript
// Приклад використання
const result = await dualModeBuilder.build(flow, {
  mode: 'hackathon',
  exportFormat: 'figma' // або 'html'
});
```

### 🏭 Production Mode (Повний стек)

**Призначення:** Готовий до deployment код для реальних державних сервісів.

**Що генерує:**
- Next.js/React компоненти
- TypeScript з повною типізацією
- API routes для backend
- Docker конфігурації
- Інтеграція з державними реєстрами

**Переваги:**
- 🔐 Security-first архітектура
- 📊 Інтеграція з NAIS, YouControl, Data.gov.ua
- 🔄 CI/CD ready
- 📝 Автоматична документація

```typescript
// Приклад використання
const result = await dualModeBuilder.build(flow, {
  mode: 'production',
  includeApi: true,
  includeDocker: true
});
```

## 🏗️ Архітектура

```
┌─────────────────────────────────────────────────────────────┐
│                    LEGO-Diia Constructor                     │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Component  │    │    Flow     │    │   Export    │     │
│  │   Library   │───▶│   Canvas    │───▶│   Engine    │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
│                                               │             │
│                          ┌────────────────────┴───────┐    │
│                          │                            │    │
│                    ┌─────▼─────┐              ┌──────▼────┐│
│                    │ Hackathon │              │ Production ││
│                    │   Mode    │              │    Mode    ││
│                    └─────┬─────┘              └──────┬─────┘│
│                          │                          │      │
│                    ┌─────▼─────┐              ┌─────▼─────┐│
│                    │  Figma/   │              │  Next.js  ││
│                    │   HTML    │              │  Docker   ││
│                    └───────────┘              │   APIs    ││
│                                               └───────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 📦 Компоненти Diia Design System

Всі компоненти відповідають офіційному Diia Design System:

| Компонент | Опис | Hackathon | Production |
|-----------|------|:---------:|:----------:|
| `DiiaHeader` | Шапка з логотипом | ✅ | ✅ |
| `DiiaButton` | Кнопки дій | ✅ | ✅ |
| `DiiaInput` | Поля введення | ✅ | ✅ |
| `DiiaCard` | Картки інформації | ✅ | ✅ |
| `DiiaSignature` | Підпис Дія.Підпис | 🎨 Mock | ✅ Real |
| `DiiaRegistry` | Дані з реєстрів | 🎨 Mock | ✅ API |
| `DiiaSuccess` | Екран успіху | ✅ | ✅ |
| `DiiaError` | Обробка помилок | ✅ | ✅ |

## 🔌 Інтеграція з державними API

Production mode автоматично інтегрується з:

- **NAIS** — Національна автоматизована інформаційна система
- **YouControl** — Перевірка контрагентів
- **Data.gov.ua** — Відкриті дані України
- **Diia.Signature** — Електронний підпис

```typescript
// Автоматична інтеграція з реєстрами
const apiProvider = new GovernmentAPIProvider();
const companyData = await apiProvider.fetchCompanyByEDRPOU('12345678');
```

## 🎮 Як використовувати

### 1. Відкрийте конструктор
```
https://yana-diia.vercel.app/lego
```

### 2. Перетягніть компоненти на canvas

### 3. Налаштуйте властивості

### 4. Оберіть режим експорту:
- **Hackathon** → для демо та презентацій
- **Production** → для реального deployment

### 5. Завантажте результат

## 🔐 Blockchain Audit Trail

Кожна дія в конструкторі автоматично логується в blockchain для прозорості:

```typescript
// Автоматичний аудит
await blockchainAudit.log({
  action: 'FLOW_CREATED',
  flowId: 'passport-renewal-001',
  timestamp: Date.now(),
  hash: glagoliticEncode(flowData)
});
```

## 📊 Метрики якості

Кожен згенерований flow оцінюється за:

- **Flow Length Score** (0-25) — мінімальність кроків
- **Component Compliance** (0-30) — відповідність Design System
- **WCAG Score** (0-20) — доступність
- **Screen Saturation** (0-15) — когнітивне навантаження
- **API Usage** (0-10) — автоматизація через реєстри

## 🚀 Roadmap

- [x] Базовий конструктор
- [x] Hackathon mode експорт
- [x] Production mode генерація
- [x] Інтеграція з державними API
- [x] Blockchain аудит
- [ ] AI-генерація flows з промптів
- [ ] Multi-user collaboration
- [ ] Version control для flows

## 📚 Додаткові ресурси

- [Diia Design System](https://design.diia.gov.ua/)
- [API документація](./UKRAINE-API-REGISTRY.md)
- [Технічна архітектура](./TECHNICAL_ARCHITECTURE.md)

---

*Розроблено для хакатону Diia.AI 2025* 🇺🇦
