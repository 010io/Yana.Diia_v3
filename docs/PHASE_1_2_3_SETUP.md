# 🚀 PHASE 1-2-3 SETUP GUIDE

**Повний операційний гайд для Zero-Day → MVP**  
**Дата:** 23.11.2025  
**Час на виконання:** 2-4 години

---

## 📋 Prerequisites

- [ ] Docker Desktop встановлений та запущений
- [ ] Python 3.11+ встановлений
- [ ] Node.js 18+ встановлений
- [ ] Git configured
- [ ] OpenAI API key (для Judge модуля)

---

## 🎯 PHASE 1: Zero-Day Операційна Готовність (0-30 хвилин)

### Step 1.1: Підняти Infrastructure

```bash
cd c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3\backend

# Підняти Weaviate та Ollama
docker compose up -d

# Перевірити статус
docker compose ps
# Expected: weaviate (healthy), ollama (running)
```

### Step 1.2: Встановити Ollama Model

```bash
# Download та pull Llama 3.1
ollama pull llama3.1

# Verify model ready
ollama list
# Expected: llama3.1:latest
```

### Step 1.3: Backend Configuration

```bash
cd backend

# Створити .env з template
cp .env.production.template .env

# ⚠️ ВІДРЕДАГУВАТИ .env - додати OPENAI_API_KEY_JUDGE
# Використати текстовий редактор або:
code .env
```

**КРИТИЧНО змінити в `.env`:**

```bash
OPENAI_API_KEY_JUDGE=sk-proj-ВАШ_РЕАЛЬНИЙ_КЛЮЧ_СЮДИ
```

### Step 1.4: Install Python Dependencies

```bash
# Створити virtual environment
python -m venv venv

# Activate
.\venv\Scripts\activate  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Install Weaviate client
pip install weaviate-client>=4.0.0

# Verify installation
python -c "import weaviate; print('✅ Weaviate client ready')"
```

---

## 🔧 PHASE 2: RAG та Dual-LLM Setup (30-90 хвилин)

### Step 2.1: Initialize Weaviate Schemas

```bash
cd backend

# Run schema initialization
python scripts/init_weaviate_schema.py
```

**Expected Output:**

```
🚀 Initializing Weaviate schemas for Yana.Diia.AI RAG
✅ Connected to Weaviate: True
✅ Created DiiaFlows schema
✅ Created DiiaComponents schema
✅ Created APIMock schema
✅ Seeded 5 critical Diia components
✅ Seeded 5 government API mocks
✅ Weaviate RAG initialization complete!
```

**Verify в браузері:** <http://localhost:8080/v1/meta>

### Step 2.2: Test Generator (Ollama)

```bash
# Test Ollama API
curl http://127.0.0.1:11434/api/generate -d '{
  "model": "llama3.1",
  "prompt": "Generate a 3-step flow for FOP registration",
  "stream": false
}'
```

**Expected:** JSON response з згенерованим текстом

### Step 2.3: Test Judge Module

```bash
# Run Judge test
python -c "
from services.judge_module import diia_judge

mock_flow = {
    'flow_id': 'test-1',
    'service_name_ua': 'Реєстрація ФОП',
    'total_steps': 4,
    'steps': [
        {'step_id': 1, 'component': {'component_name': 'eligibility_banner'}},
        {'step_id': 2, 'component': {'component_name': 'form_step'}},
        {'step_id': 3, 'component': {'component_name': 'form_step'}},
        {'step_id': 4, 'component': {'component_name': 'form_step'}}
    ],
    'required_apis': ['edr', 'tax']
}

result = diia_judge.judge_flow(mock_flow)
print(f'✅ Judge Score: {result[\"total_weighted_score\"]}/100')
print(f'   Passed: {result[\"overall_assessment\"]}')
"
```

**Expected:**

```
✅ Judge Score: 78.5/100
   Passed: PASSED
```

### Step 2.4: Start Backend Server

```bash
cd backend

# Run FastAPI server
python main.py
```

**Expected:**

```
INFO: Started server process
INFO: Uvicorn running on http://127.0.0.1:8000
```

**Test endpoints:**

```bash
# Health check
curl http://127.0.0.1:8000/health

# Mock Registry
curl http://127.0.0.1:8000/api/mock/edr/12345678
```

---

## 🎨 PHASE 3: Frontend Lego-Diia (90-180 хвилин)

### Step 3.1: Frontend Dependencies

```bash
cd c:\igor\Projects\ДІЯ\01_Projects\Yana.Diia_v3

# Install (після виправлення package.json до Next.js 15)
rm -rf node_modules package-lock.json
npm install

# Verify
npm run build
```

### Step 3.2: Create Lego Canvas Component

**File:** `components/lego-diia/canvas.tsx`

```typescript
'use client';

import { useState } from 'react';
import { DiiaFlow, FlowStep } from '@/types/flow';

// Component mapping (розширити з RAG DiiaComponents)
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  eligibility_banner: ({ eligible, title, message }: any) => (
    <div className={`p-4 rounded ${eligible ? 'bg-green-50' : 'bg-red-50'}`}>
      <h3 className="font-bold">{title}</h3>
      <p>{message}</p>
    </div>
  ),
  form_step: ({ fields }: any) => (
    <div className="p-4 bg-white border rounded">
      <form>
        {fields?.map((field: any, i: number) => (
          <div key={i} className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <input type={field.type} className="w-full border p-2 rounded" />
          </div>
        ))}
      </form>
    </div>
  ),
  // ... додати інші компоненти
};

export function LegoCanvas({ flow }: { flow: DiiaFlow }) {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{flow.service_name_ua}</h1>
      
      {flow.steps.map((step) => {
        const Component = COMPONENT_MAP[step.component.component_name];
        
        return (
          <div key={step.step_id} className="border rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-2">
              Крок {step.step_id} з {flow.total_steps}
            </div>
            
            {Component ? (
              <Component {...step.component.props} />
            ) : (
              <div className="text-red-500">
                Unknown component: {step.component.component_name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### Step 3.3: API Client Integration

**File:** `lib/api-client.ts`

```typescript
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function generateFlow(brdText: string) {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brd_text: brdText })
  });
  
  if (!response.ok) throw new Error('Generation failed');
  return response.json();
}

export async function getCompanyData(edrpou: string) {
  const response = await fetch(`${API_BASE}/api/mock/edr/${edrpou}`);
  return response.json();
}
```

### Step 3.4: Test Page

**File:** `app/test/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { LegoCanvas } from '@/components/lego-diia/canvas';
import { generateFlow } from '@/lib/api-client';

export default function TestPage() {
  const [brd, setBrd] = useState('');
  const [flow, setFlow] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateFlow(brd);
      setFlow(result.best_flow);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Yana.Diia.AI - Test</h1>
      
      <textarea
        className="w-full border p-4 rounded mb-4"
        rows={4}
        placeholder="Введіть опис послуги (BRD)..."
        value={brd}
        onChange={(e) => setBrd(e.target.value)}
      />
      
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        {loading ? 'Генерую...' : 'Згенерувати Flow'}
      </button>
      
      {flow && (
        <div className="mt-8">
          <LegoCanvas flow={flow} />
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Verification Checklist

### Infrastructure

- [ ] Docker containers running (`docker compose ps`)
- [ ] Weaviate accessible (<http://localhost:8080/v1/meta>)
- [ ] Ollama model loaded (`ollama list`)

### Backend

- [ ] `.env` configured with OpenAI key
- [ ] Weaviate schemas created (3 collections)
- [ ] Judge module working (score calculation)
- [ ] FastAPI server running (port 8000)
- [ ] Mock Registry APIs responding

### Frontend

- [ ] npm install successful
- [ ] Build working (`npm run build`)
- [ ] LegoCanvas component created
- [ ] API client configured
- [ ] Test page accessible

---

## 🎯 Next Steps (After Phase 3)

1. **Integrate Real RAG:** Connect Judge to Weaviate queries
2. **Add More Components:** Extend COMPONENT_MAP з усіма Diia компонентами
3. **UI Polish:** Diia Design System styling
4. **Testing:** E2E flow generation test
5. **Demo Recording:** 5-minute video

---

## 📞 Troubleshooting

### Weaviate не стартує

```bash
docker compose down
docker compose up -d --force-recreate
```

### Ollama model не download

```bash
# Перевірити підключення
curl http://127.0.0.1:11434/api/tags

# Force re-download
ollama rm llama3.1
ollama pull llama3.1
```

### Judge returns errors

```bash
# Перевірити .env
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('OPENAI_API_KEY_JUDGE'))"

# Має повернути ваш API key (не None)
```

---

**Статус після виконання:** 🟢 MVP Ready for Demo Day  
**Час виконання:** ~2-4 години  
**Наступний крок:** Frontend polish + testing
