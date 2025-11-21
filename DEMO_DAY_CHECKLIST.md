# Yana.Diia.AI - Demo Day Checklist

**Demo Date**: 29 листопада 2025  
**Time Limit**: 3-5 хвилин  
**Format**: Live demo + Presentation

---

## ✅ Pre-Demo Checklist (За 24 години)

### Code & Build
- [ ] Run `npm install` в чистій папці (перевірка dependencies)
- [ ] Run `npm run dev` - переконатися, що немає errors
- [ ] Перевірити всі routes: /, /dashboard, /lego, /debate, /pipeline, /evaluation, /quantum, /blockchain
- [ ] Konami Code (↑↑↓↓←→←→BA) активує Dev Panel
- [ ] Mock Mode показує "0 tokens used"
- [ ] Всі анімації працюють (Framer Motion)

### Content
- [ ] README.md оновлено з інструкціями
- [ ] Walkthrough.md готовий
- [ ] GitHub repo створено (public)
- [ ] .env.example заповнено з поясненнями

### Backup Plans
- [ ] Записати fallback відео (3 хв)
- [ ] Скріншоти кожного екрану
- [ ] PDF презентація (якщо інтернет впаде)
- [ ] Offline версія на ноутбуці

---

## 🎬 Demo Day Script (145s)

### 1. Opening (15s)
> "Доброго дня! Я представлю Yana.Diia.AI - платформу, яка **автоматично генерує** державні цифрові послуги за 2 хвилини. Подивимось, як створити Finance.AI - сервіс для виплат ВПО."

**Action**: Показати Landing Page → Navigate to Dashboard

---

### 2. Lego Constructor (30s)
> "Це Lego-Diia Constructor. Замість писати код з нуля, ми **переіспользуємо** офіційні компоненти Дії."

**Actions**:
1. Відкрити `/lego`
2. Drag 4 компоненти: DiiaSignatureButton, AmountInput, BankSelect, SuccessBanner
3. Показати Yana Analyzer (Score: 92/100)

**Key Message**: "Reuse over Reinvent - основа Lego-Diia"

---

### 3. AI Debate Chamber (30s)
> "Наш AI Debate Chamber - це 7 експертів з українським гумором. Дивіться."

**Actions**:
1. Navigate to `/debate`
2. Click "Почати Дебати"
3. Показати 2-3 репліки (Леся, Кличко: "А де сервер?", Усик: "I am very feel")

**Key Message**: "AI розуміє український контекст і культуру"

---

### 4. Quantum Optimization (25s)
> "Quantum Optimizer використовує симуляцію квантового відпалювання для пошуку найкращого UX."

**Actions**:
1. Navigate to `/quantum`
2. Click "Start Optimization"
3. Показати анімацію зниження енергії
4. Показати 3 варіанти: Minimal (3 кроки), Standard (5), Educational (7)

**Key Message**: "Автоматична оптимізація = кращий UX для громадян"

---

### 5. Glagolitic Crypto (20s)
> "Для blockchain audit ми використовуємо Glagolitic - давнє українське письмо."

**Actions**:
1. Navigate to `/blockchain`
2. Load Example
3. Generate Signature
4. Показати Glagolitic візуалізацію + Sepolia TX hash

**Key Message**: "Унікальна українська ідентичність в технології"

---

### 6. Wrap-Up (25s)
> "За 2 хвилини ми створили Finance.AI - від ідеї до коду. Yana.Diia.AI - це майбутнє державних послуг. Дякую!"

**Actions**:
1. Повернутися на Dashboard
2. Показати статистику: 10 компонентів, 7 AI агентів, 0 токенів (Mock Mode)

---

## 🎙️ Talking Points

### Problem
- Створення нової держпослуги зараз займає **місяці**
- Кожна команда пише код з нуля → дублювання
- Немає стандартів → погана сумісність

### Solution
- **Lego-Diia**: Збірка з готових Diia компонентів
- **AI Pipeline**: Автоматична генерація та оптимізація
- **Quantum-Inspired**: Швидший пошук оптимального UX
- **Cultural Identity**: Glagolitic, Ukrainian humor в AI

### Impact
- ⏱️ **Швидше**: Від місяців до хвилин
- 💰 **Дешевше**: Reuse замість reinvent
- 🎯 **Якісніше**: AI перевіряє compliance автоматично
- 🇺🇦 **Українське**: Культурна ідентичність у всьому

---

## 🛠️ Troubleshooting

### Якщо Dev Server не стартує
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Якщо AI Debate не запускається
- Перевірити Mock Provider ініціалізацію
- Відкрити Console → Має бути "🧪 Using MOCK mode"

### Якщо анімації laggy
- Закрити інші tabs
- Перезавантажити браузер
- Fallback: показати відео

---

## 📹 Fallback Video Script

**Duration**: 3 хвилини  
**Resolution**: 1080p  
**Format**: MP4

### Scenes:
1. Landing + Dashboard (10s)
2. Lego Constructor demo (30s)
3. AI Debate full scenario (30s)
4. Quantum Optimization (20s)
5. Glagolitic Crypto (15s)
6. Final summary (15s)

**Tool**: OBS Studio або QuickTime Screen Recording

---

## 📊 Q&A Prep

### Expected Questions

**Q: Чи це справжній AI чи mock?**
A: Зараз Mock Mode для демо, але архітектура готова для OpenAI/Claude. Production switcher є в Dev Panel.

**Q: Як Quantum допомагає?**
A: Simulated Annealing знаходить глобальний оптимум швидше за brute force. Це спрощена версія для UX optimization.

**Q: Glagolitic - це справжня криптографія?**
A: Візуально - так (Glagolitic alphabet), технічно - SHA-256. Це proof-of-concept для культурної ідентичності.

**Q: Скільки часу на розробку?**
A: 10 днів від ідеї до MVP (за планом). Реально - 6-7 днів чистої розробки.

**Q: Open source?**
A: Так, MIT license. GitHub публікується після Demo Day.

---

## ✨ Bonus Points

### Якщо є час (Extra 30s)
- Показати Pipeline Debugger (BRD → Flow conversion)
- Показати Evaluation Lab (Compliance Report)
- Показати Dev Panel (Konami Code reveal)

### Visual Polish
- Dark mode виглядає краще для demo
- Zoom browser до 110% для читабельності
- Full screen mode (F11)

---

## 🎯 Success Criteria

### Must Have
- [ ] Demo працює від початку до кінця
- [ ] Жодних console errors
- [ ] Всі transitions плавні
- [ ] Час < 3 хвилини

### Nice to Have
- [ ] Audience laughs на Кличко "де сервер?"
- [ ] Questions про Glagolitic
- [ ] Інтерес до GitHub repo

---

## 🏆 Final Checks

**30 min before demo:**
- [ ] Restart laptop
- [ ] Close all apps (крім browser + IDE)
- [ ] Test internet connection
- [ ] Open demo в incognito window
- [ ] Test Konami Code one more time
- [ ] Deep breath 🧘

**Go time!** 🚀

---

**Prepared by**: Antigravity + 010io  
**Last Updated**: 2025-11-20  
**Version**: 1.0 - Ready for Demo Day

**Слава Україні!** 🇺🇦
