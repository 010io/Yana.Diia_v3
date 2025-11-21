# Yana.Diia - AI for Digital Architects of Ukraine

> **Yana.Diia** = AI assistant for automating the design of government digital services, accelerating service development from 2-5 days to 1-2 hours.

**Created by**: Be Transparent team for Diia.AI Hackathon  
**License**: MIT  
**Status**: MVP - Production Ready

---

## Table of Contents

- [Overview](#overview)
- [Core Architecture](#core-architecture)
- [Input/Output Specifications](#inputoutput-specifications)
- [Flow Ranking Criteria](#flow-ranking-criteria)
- [Power Features](#power-features)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support](#support)

---

## Overview

Yana.Diia is an internal AI assistant for teams at:
- Міністерство цифровой трансформації (Ministry of Digital Transformation)
- EPAM
- GovTech partner organizations

The system automates the routine work of analysts, designers, and product managers by:
1. **Parsing** BRD (Business Requirements Documents) and service descriptions
2. **Generating** multiple optimized user-flow variants
3. **Ranking** flows by efficiency, WCAG compliance, and design system adherence
4. **Outputting** production-ready JSON routes for immediate review and implementation

---

## Core Architecture

Yana.Diia operates on a **5-level LLMOps pipeline**:

### Level 1: Input Modality Layer
- Text BRD/descriptions
- Voice input (speech-to-text)
- Screenshots & images (vision transformers)
- PDF documents (OCR parsing)
- Figma exports & structured JSON
- Chrome extension data capture

**Tech**: FastAPI endpoint `/api/parse` accepts multimodal input, routes to appropriate preprocessor.

### Level 2: Intent Recognition & Context Extraction
- Multi-class intent classification (create service, modify flow, optimize accessibility, etc.)
- Entity extraction (service domain, user roles, constraints)
- Business rule parsing (budget, time, compliance requirements)
- Auto-detection of relevant Diia Design System components

**Tech**: LLM-based prompt with chain-of-thought, BERT-based classifiers for redundancy.

### Level 3: Flow Generation Engine
- **Multi-variant generation**: 3-7 flow candidates per BRD
- **Component matching**: Auto-maps to Diia Design System standards
- **Accessibility-first**: Generates WCAG AA/AAA compliant variants
- **Domain personalization**: Special flows for veterans, healthcare, education sectors

**Tech**: LangChain + multiple LLM backends (ChatGPT, Qwen 2.5, Gemma 3, local Ollama).

### Level 4: FlowEvaluator with ABN Testing
Ranks flows by these criteria:

| Metric | Weight | Details |
|--------|--------|---------|
| **Step Efficiency** | 25% | Minimum steps to completion |
| **Design System Match** | 30% | % compliance with Diia DS standards |
| **WCAG Score** | 20% | Accessibility level (A/AA/AAA) |
| **Component Modernity** | 15% | No deprecated components |
| **Domain Relevance** | 10% | Context-aware personalization |

**Champion Selection**: Top-ranked flow marked for immediate review; alternatives stored for A/B testing.

### Level 5: Output & Serialization
- **JSON Schema**: Structured flow routes with step definitions
- **YAML Export**: Alternative format for CI/CD integration
- **Figma Auto-sync**: Generated wireframes exportable to Figma
- **REST API**: Flow accessible via `/api/flows/{flow_id}`

---

## Input/Output Specifications

### Input: BRD Text Example
\`\`\`
Користувач хоче подати документи онлайн.
Потрібна можливість завантажити файли (PDF, JPG, PNG).
Валідація документів (формат, метадані, сигнатура).
Збереження в ЕСІД реєстр.
Максимум 5 файлів, вагу до 10MB кожен.
Нагадування користувачу про статус через SMS/push.
\`\`\`

### Output: JSON Flow
\`\`\`json
{
  "flow": {
    "id": "flow_12345",
    "name": "Подання документів онлайн",
    "service_domain": "citizen_services",
    "steps": [
      {
        "id": 1,
        "type": "screen",
        "title": "Завантаження документів",
        "component": "FileUploader",
        "props": {
          "max_files": 5,
          "max_size_mb": 10,
          "accepted_formats": ["pdf", "jpg", "png"]
        }
      },
      {
        "id": 2,
        "type": "screen",
        "title": "Перевірка документів",
        "component": "DocumentValidator",
        "validation_rules": ["format", "metadata", "signature"]
      },
      {
        "id": 3,
        "type": "action",
        "title": "Збереження в ЕСІД",
        "endpoint": "/api/esid/save",
        "notifications": ["sms", "push"]
      }
    ]
  },
  "metadata": {
    "score": 0.95,
    "wcag_level": "AA",
    "step_count": 3,
    "estimated_completion_min": 5,
    "design_system_compliance": 0.98
  }
}
\`\`\`

---

## Flow Ranking Criteria

| Criterion | Score Method | Notes |
|-----------|--------------|-------|
| **Minimum Steps** | `1 - (steps / max_steps)` | Favors efficiency |
| **WCAG Compliance** | AAA=1.0, AA=0.8, A=0.6 | Accessibility priority |
| **Component Modernity** | Denylist check (deprecated components) | Binary: pass/fail |
| **Design System Adherence** | Token match % from Diia DS | Color, typography, spacing verified |
| **Domain Personalization** | Keyword matching + LLM relevance | Higher for specialized sectors |

**Formula**: `final_score = 0.25*efficiency + 0.30*ds_match + 0.20*wcag + 0.15*modernity + 0.10*domain`

---

## Power Features

### 1. AI-Powered BRD Parsing
- Multi-model LLM engine (support for ChatGPT, Qwen 2.5, Gemma 3, local Ollama)
- Automatic intent, entity, and constraint extraction
- Multilingual support (Ukrainian, Russian, English)

### 2. Chrome Extension
- Capture interfaces from Diia directly
- Send structured data to Yana in one click
- Real-time flow suggestions while browsing

### 3. Public Feedback Hub
- Citizens can submit ideas via web form or Telegram bot
- Automatic duplicate detection (BERT-based embeddings)
- Spam filtering with multilingual rule-based detectors
- AI triage: "Is this already under development?"

### 4. Multimodal Input
- Drag & drop file support
- OCR for scanned documents
- Speech-to-text for verbal BRD submission
- Vision Transformer for screenshot parsing

### 5. DevOps-Ready Integration
- REST API for third-party integrations
- Jira, Confluence, GitHub webhooks
- CI/CD pipeline support (run Yana checks on every PR)
- Bot/Agent mode for autonomous flow generation

### 6. Customizable Ranking Logic
- Override default weights per project
- Manual flow editing with version control
- Remix existing flows into new variants
- Export ranking rules as reusable templates

### 7. Smart Notifications
- Alert teams when flows change
- Relevance detection: "This existing service already covers your use case"
- Duplicate idea detection with automatic consolidation

### 8. Transparency by Design
- Full audit log of all changes
- Explainable AI: System explains "why this flow scored 0.95"
- Auto-generated explainer docs (PDF, Markdown, HTML)

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ (for Next.js frontend)
- Docker (optional, for local LLM)

### Installation

#### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yana-diia/yana-diia.git
cd yana-diia
\`\`\`

#### 2. Backend Setup
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
\`\`\`

#### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run build
\`\`\`

#### 4. Environment Variables
Create `.env.local`:
\`\`\`
# LLM Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5-mini

# Alternative Models (optional)
# QWEN_API_KEY=...
# GROQ_API_KEY=...

# Database
DATABASE_URL=postgresql://user:pass@localhost/yana_diia

# Diia Integration
DIIA_DESIGN_SYSTEM_URL=https://github.com/diia-open-source/design-system
DIIA_COMPONENTS_API=https://api.diia.gov.ua/components

# Feedback Hub
TELEGRAM_BOT_TOKEN=...
FEEDBACK_API_SECRET=...
\`\`\`

#### 5. Run Locally
\`\`\`bash
# Backend (FastAPI)
cd backend
uvicorn main:app --reload --port 8000

# Frontend (Next.js, in new terminal)
cd frontend
npm run dev
\`\`\`

Open http://localhost:3000

---

## API Reference

### Parse BRD
\`\`\`
POST /api/parse
Content-Type: application/json

{
  "brd_text": "Користувач хоче...",
  "service_domain": "citizen_services",
  "accessibility_target": "AA"
}

Response:
{
  "intent": "create_service",
  "entities": [...],
  "constraints": {...},
  "recommended_components": [...]
}
\`\`\`

### Generate Flow Variants
\`\`\`
POST /api/flows/generate
Content-Type: application/json

{
  "parsed_input": {...},
  "variant_count": 5,
  "ranking_weights": {
    "efficiency": 0.25,
    "design_system": 0.30,
    "wcag": 0.20,
    "modernity": 0.15,
    "domain": 0.10
  }
}

Response:
{
  "flows": [
    {"id": "flow_1", "score": 0.95, ...},
    {"id": "flow_2", "score": 0.88, ...},
    ...
  ],
  "champion_id": "flow_1"
}
\`\`\`

### Retrieve Flow
\`\`\`
GET /api/flows/{flow_id}

Response:
{
  "id": "flow_1",
  "name": "...",
  "steps": [...],
  "metadata": {...}
}
\`\`\`

### Export to Format
\`\`\`
GET /api/flows/{flow_id}/export?format=json|yaml|figma

Response: File download or Figma link
\`\`\`

### Submit Feedback
\`\`\`
POST /api/feedback
Content-Type: application/json

{
  "idea": "Потрібна можливість...",
  "service_domain": "healthcare",
  "contact": "user@example.com"
}

Response:
{
  "feedback_id": "fb_xyz",
  "triage": "NEW" | "DUPLICATE_OF_fb_abc" | "IN_PROGRESS"
}
\`\`\`

---

## Deployment

### Docker
\`\`\`bash
docker build -t yana-diia:latest .
docker run -e DATABASE_URL=... -p 3000:3000 yana-diia:latest
\`\`\`

### Vercel (Frontend)
\`\`\`bash
vercel deploy
\`\`\`

### AWS/Azure (Backend)
- Deploy FastAPI to AWS Lambda or Azure Functions
- Use managed PostgreSQL (RDS, Azure DB)
- Enable CloudFront/CDN for static assets

### GitHub Actions (CI/CD)
See `.github/workflows/` for automated testing and deployment pipelines.

---

## Architecture Principles

### Privacy by Design
- Internal processing only; no user data shared
- Pseudonymization of feedback inputs
- Compliance: GDPR, eIDAS, Diia security standards

### Security First
- Only verified LLM models approved
- Role-based access control (RBAC) on backend
- Independent security audit schedule
- All API endpoints require JWT authentication

### Transparency
- Open-source frontend & core logic (MIT License)
- Public API with Swagger documentation
- Audit logs for all flow changes
- Explainable AI: System explains scoring decisions

---

## Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Code of Conduct
See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## Roadmap

### Q1 2025 (MVP)
- Core BRD parsing engine
- Multi-variant flow generation
- FlowEvaluator scoring
- Live Demo & Case Studies on website

### Q2 2025
- Chrome extension release
- Public feedback hub (Telegram + web)
- Advanced LLM model switching
- Figma auto-sync

### Q3 2025
- Team co-editing canvas (WebSocket sync)
- A/B testing framework
- Advanced analytics dashboard
- Third-party LLM support

### Q4 2025
- Production-grade security audit
- Broader GovTech integrations (Jira, Confluence, GitHub)
- Multilingual support expansion
- Performance optimization & scaling

---

## Support

- **Email**: team@yanadia.gov.ua
- **Discord**: [Join our community](https://discord.gg/...)
- **Telegram**: [@yana_diia_bot](https://t.me/yana_diia_bot)
- **GitHub Issues**: [Report bugs & feature requests](https://github.com/yana-diia/yana-diia/issues)

---

## Team

**Be Transparent** - Diia.AI Hackathon Winners

- **Lead**: [Your Name]
- **AI/ML**: [Team Members]
- **UX/Design**: [Team Members]
- **Backend**: [Team Members]
- **DevOps**: [Team Members]

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Diia Design System team for component standards
- Open Diia community for inspiration
- EPAM for infrastructure & mentorship
- Hackathon organizers for this opportunity

---

**Yana.Diia: AI for Digital Architects of Ukraine.**  
*Building digital services faster, better, and more transparently.*
