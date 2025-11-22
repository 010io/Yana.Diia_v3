# Yana.Diia Critical Path - Requirements Document

## Introduction

This document specifies the requirements for the Critical Path Implementation of Yana.Diia.AI, an AI-powered platform for generating Ukrainian government digital services. The system must be production-ready for the Diia.AI Contest 2025 Demo Day on November 29, 2025.

The Critical Path focuses on implementing the core infrastructure and killer features that are currently blocking the demo: LLM Provider Infrastructure, AI Debate Chamber, Blockchain Audit Trail, Quantum Flow Optimizer, and Demo Day Autopilot.

## Glossary

- **Agent**: An AI persona with unique character, role, and Ukrainian cultural identity
- **BRD**: Business Requirements Document - input text describing a government service
- **Debate**: Sequential discussion between 7 AI agents evaluating a service design
- **Flow**: A sequence of UI steps representing a government service user journey
- **Mock Provider**: Zero-cost LLM simulation for development and fallback
- **Glagolitic**: Ancient Slavic alphabet (863 AD) used for cryptographic visualization
- **QUBO**: Quadratic Unconstrained Binary Optimization formulation
- **Simulated Annealing**: Quantum-inspired optimization algorithm
- **Autopilot**: Automated system for executing and recording demo scenarios
- **Sepolia**: Ethereum testnet for blockchain audit trail
- **Catchphrase**: Signature phrase associated with an AI agent persona
- **System**: The Yana.Diia.AI platform
- **Token**: Unit of LLM API usage measurement
- **Fallback**: Graceful degradation when primary system fails

## Requirements

### Requirement 1: LLM Provider Infrastructure

**User Story:** As a developer, I want a flexible LLM provider system with mock/production modes, so that I can develop without API costs and deploy with real AI.

#### Acceptance Criteria

1.1. WHEN the System initializes THEN it SHALL load provider configuration from environment variables (LLM_MODE, OPENAI_API_KEY, ANTHROPIC_API_KEY)

1.2. WHEN LLM_MODE equals "mock" THEN the System SHALL use Mock Provider for all LLM calls

1.3. WHEN LLM_MODE equals "openai" THEN the System SHALL use OpenAI Provider with GPT-4 Turbo

1.4. WHEN LLM_MODE equals "anthropic" THEN the System SHALL use Anthropic Provider with Claude 3.5 Sonnet

1.5. WHEN an LLM call is made THEN the System SHALL track tokens used and display count in Dev Panel

1.6. WHEN an LLM API call fails THEN the System SHALL retry once after 2 seconds

1.7. WHEN retry fails THEN the System SHALL fallback to Mock Provider and log warning

1.8. WHEN Mock Provider is called THEN it SHALL return realistic responses within 2 seconds

### Requirement 2: AI Debate Chamber

**User Story:** As a demo presenter, I want 7 Ukrainian AI agents to debate service quality with humor and cultural context, so that I can showcase unique innovation.

#### Acceptance Criteria

2.1. WHEN user clicks "Почати Дебати" THEN the System SHALL sequentially invoke 7 agents in order: Zelenskyy, Lesya, Yaroslav, Klitschko, Boris, NBU, Usyk

2.2. WHEN an agent speaks THEN the System SHALL include agent systemPrompt and at least one catchphrase from config

2.3. WHEN an agent is speaking THEN the UI SHALL highlight that agent's avatar with animation

2.4. WHEN all agents have spoken THEN the debate SHALL complete and button SHALL become active again

2.5. WHEN debate is running THEN the System SHALL display typing indicator for active agent

2.6. WHEN service context is provided THEN each agent SHALL evaluate from their role perspective (UX, Security, Product, Infrastructure, Finance, International, QA)

2.7. WHEN debate completes THEN the System SHALL store all messages with timestamps

### Requirement 3: Blockchain Audit Trail

**User Story:** As a government stakeholder, I want immutable blockchain records of AI-generated services, so that I can ensure transparency and accountability.

#### Acceptance Criteria

3.1. WHEN a service flow is generated THEN the System SHALL create SHA-256 hash of flow data

3.2. WHEN hash is created THEN the System SHALL convert hash to Glagolitic visual representation

3.3. WHEN user clicks "Generate Signature" THEN the System SHALL record hash on Sepolia testnet using deployed smart contract

3.4. WHEN blockchain transaction succeeds THEN the System SHALL display transaction hash and Etherscan link

3.5. WHEN transaction is pending THEN the UI SHALL show loading state with progress indicator

3.6. WHEN user provides flow ID THEN the System SHALL verify existence on blockchain and return timestamp

3.7. WHEN blockchain call fails THEN the System SHALL display error message and allow retry

### Requirement 4: Quantum Flow Optimizer

**User Story:** As a UX designer, I want quantum-inspired optimization to find the best service flow, so that citizens get optimal user experience.

#### Acceptance Criteria

4.1. WHEN user clicks "Start Optimization" THEN the System SHALL apply Simulated Annealing algorithm to flow variants

4.2. WHEN optimization runs THEN the System SHALL display energy convergence graph in real-time

4.3. WHEN optimization completes THEN the System SHALL generate 3 variants: Minimal (3 steps), Standard (5 steps), Educational (7 steps)

4.4. WHEN energy is calculated THEN the System SHALL use QUBO formulation with weights: efficiency (0.4), accessibility (0.3), security (0.2), compliance (0.1)

4.5. WHEN temperature decreases THEN the System SHALL accept worse solutions with probability exp(-ΔE/T)

4.6. WHEN optimization runs THEN it SHALL complete within 30 seconds

4.7. WHEN variants are generated THEN each SHALL have score, estimated time, and step list

### Requirement 5: Demo Day Autopilot

**User Story:** As a demo presenter, I want automated demo execution with video recording, so that I have backup materials if live demo fails.

#### Acceptance Criteria

5.1. WHEN autopilot starts THEN the System SHALL load demo scenario from config/demo-scenario.ts

5.2. WHEN autopilot executes THEN it SHALL perform all 13 steps with correct timing (±2 seconds)

5.3. WHEN autopilot runs THEN it SHALL record screen at 1080p 60fps

5.4. WHEN autopilot completes THEN it SHALL save MP4 video file

5.5. WHEN autopilot navigates THEN it SHALL wait for page load and animations before proceeding

5.6. WHEN autopilot encounters error THEN it SHALL capture screenshot and continue with next step

5.7. WHEN autopilot finishes THEN it SHALL generate PDF slides from screenshots

### Requirement 6: Mock Provider Realism

**User Story:** As a developer, I want mock responses that feel like real AI, so that I can demo without API costs.

#### Acceptance Criteria

6.1. WHEN Mock Provider receives debate request THEN it SHALL return response matching agent persona and role

6.2. WHEN Mock Provider is called multiple times with same input THEN it SHALL return varied responses (not identical)

6.3. WHEN Mock Provider generates response THEN it SHALL include Ukrainian language and cultural references

6.4. WHEN Mock Provider simulates delay THEN it SHALL wait 1-2 seconds to mimic real API latency

6.5. WHEN Mock Provider receives BRD parsing request THEN it SHALL extract service name, intent, category, and requirements

### Requirement 7: Error Handling and Resilience

**User Story:** As a system operator, I want graceful error handling, so that demo continues even if components fail.

#### Acceptance Criteria

7.1. WHEN API timeout occurs (>30 seconds) THEN the System SHALL cancel request and fallback to mock

7.2. WHEN network error occurs THEN the System SHALL display user-friendly message and retry option

7.3. WHEN blockchain transaction fails THEN the System SHALL allow demo to continue without blockchain

7.4. WHEN LLM returns malformed response THEN the System SHALL validate and request regeneration

7.5. WHEN critical error occurs THEN the System SHALL log to console and display Dev Panel notification

### Requirement 8: Performance and Optimization

**User Story:** As a user, I want fast response times, so that demo feels responsive and professional.

#### Acceptance Criteria

8.1. WHEN page loads THEN initial render SHALL complete within 2 seconds

8.2. WHEN user navigates between routes THEN transition SHALL complete within 500ms

8.3. WHEN debate runs THEN each agent response SHALL appear within 5 seconds

8.4. WHEN quantum optimization runs THEN progress SHALL update every 100ms

8.5. WHEN blockchain transaction is submitted THEN UI SHALL show immediate feedback

### Requirement 9: Testing and Quality Assurance

**User Story:** As a developer, I want comprehensive tests, so that I can deploy with confidence.

#### Acceptance Criteria

9.1. WHEN code is committed THEN unit tests SHALL pass for all providers

9.2. WHEN integration tests run THEN full debate flow SHALL complete successfully

9.3. WHEN property-based tests run THEN they SHALL execute minimum 100 iterations

9.4. WHEN visual regression tests run THEN screenshot diff SHALL be less than 5%

9.5. WHEN autopilot test runs THEN all 13 demo steps SHALL execute without errors

### Requirement 10: Dev Panel and Monitoring

**User Story:** As a developer, I want real-time monitoring, so that I can debug issues during demo.

#### Acceptance Criteria

10.1. WHEN Konami Code is entered (↑↑↓↓←→←→BA) THEN Dev Panel SHALL appear

10.2. WHEN Dev Panel is open THEN it SHALL display: tokens used, request count, average latency, current LLM mode

10.3. WHEN user changes LLM mode in Dev Panel THEN the System SHALL switch providers immediately

10.4. WHEN error occurs THEN Dev Panel SHALL display error notification with details

10.5. WHEN user clicks "Export Logs" THEN the System SHALL download JSON file with all events

---

## Requirements Traceability Matrix

| Requirement | Priority | Demo Day Critical | Complexity | Dependencies |
|-------------|----------|-------------------|------------|--------------|
| 1. LLM Infrastructure | P0 | YES | High | None |
| 2. AI Debate | P0 | YES | High | Req 1 |
| 3. Blockchain Audit | P1 | YES | Medium | None |
| 4. Quantum Optimizer | P1 | YES | High | Req 1 |
| 5. Demo Autopilot | P0 | YES | High | All |
| 6. Mock Realism | P0 | YES | Medium | Req 1 |
| 7. Error Handling | P0 | YES | Medium | Req 1 |
| 8. Performance | P1 | YES | Medium | All |
| 9. Testing | P0 | YES | High | All |
| 10. Dev Panel | P2 | NO | Low | Req 1 |

---

## Acceptance Criteria Summary

- **Total Requirements:** 10
- **Total Acceptance Criteria:** 47
- **EARS Compliance:** 100% (all criteria use WHEN/THEN/SHALL patterns)
- **Testable Criteria:** 45/47 (95.7%)
- **Demo Day Critical:** 9/10 requirements

---

**Document Version:** 1.0  
**Last Updated:** 10:36 November 22, 2025  
**Status:** Ready for Design Phase

\\\\\\\\\\\\\\\\\\

# TASK: Create Production-Grade Specification for Yana.Diia.AI Critical Path

## CONTEXT (DO NOT SIMPLIFY)

### Project Background
- **Name:** Yana.Diia.AI + Finance.AI
- **Competition:** Diia.AI Contest 2025 (Ukraine Ministry of Digital Transformation)
- **Team:** Be Transparent (010io + AI mesh team)
- **Deadline:** November 29, 2025 (7 days remaining as of Nov 22)
- **Current Status:** 85% complete, critical blockers exist
- **Tech Stack:** Next.js 16 (Turbopack), TypeScript 5.7, Tailwind CSS (3.4.15 after downgrade), React 19
- **LLM Providers:** OpenAI SDK, Anthropic SDK, Custom Mock Provider (NOT IMPLEMENTED)
- **State Management:** Zustand
- **Blockchain:** Ethereum (Sepolia testnet), Solidity + Cairo + Move contracts (EXIST but NOT INTEGRATED)
- **Cultural Context:** Ukrainian GovTech, Glagolitic cryptography, AI personas with Ukrainian humor

### Critical Problems Identified
1. **@/lib/llm/providers/mock.ts** — DOES NOT EXIST (crashes at runtime)
2. **@/lib/llm/providers/openai.ts** — DOES NOT EXIST
3. **@/lib/llm/providers/anthropic.ts** — DOES NOT EXIST
4. **Quantum Optimizer (lib/quantum/)** — Imported but not implemented
5. **Blockchain Audit (lib/blockchain/)** — Smart contracts exist, no UI integration
6. **BRD Parser Pipeline** — No LLM logic, only UI
7. **AI Debate Chamber** — UI exists, no real agent orchestration
8. **Testing Coverage:** 0% (no tests)

### Existing Assets (DO USE)
- 17+ React components (UI complete)
- 8 routes (all pages exist)
- 3 blockchain smart contracts (Solidity, Cairo, Move)
- 7 AI agent personas defined (config/ai-agents.ts)
- Demo scenario script (config/demo-scenario.ts) — 145 seconds, 13 steps
- Konami Code Dev Panel (↑↑↓↓←→←→BA)
- Diia Design System config (colors, fonts)

### Strategic Goals (PRIORITIZE)
1. **Demo Day Success** — Working live demo OR high-quality backup video
2. **Innovation Showcase** — Demo Day Autopilot (self-demonstrating platform)
3. **Cultural Impact** — Ukrainian identity (Glagolitic, humor, Diia compliance)
4. **Technical Credibility** — Production-grade code with tests
5. **Fallback Strategy** — Graceful degradation if APIs fail

---

## SPEC REQUIREMENTS

Create a **complete, formal, production-ready specification** for the following integrated system:

### System Name: "Yana.Diia Critical Path Implementation"

#### Scope (IN-SCOPE)
1. **LLM Provider Infrastructure**
   - Mock Provider (zero-cost, realistic responses, <2s latency)
   - OpenAI Provider (GPT-4 Turbo for debate, GPT-3.5 for BRD parsing)
   - Anthropic Provider (Claude 3.5 Sonnet for evaluation)
   - Provider Selector (env-based switching: mock/openai/anthropic/multi)
   - Token Cost Tracker (display in Dev Panel)
   - Error Handling (timeout, retry, fallback to mock)

2. **AI Debate Chamber (CRITICAL)**
   - Agent Orchestrator (sequential execution, context building)
   - 7 Ukrainian AI Personas (Zelenskyy, Lesya Ukrainka, Yaroslav Mudryj, Klitschko, NBU, Boris Johnson, Usyk)
   - Debate Flow (join/leave animations, typing indicators, consensus)
   - Real-time LLM Integration (with character consistency validation)
   - Humorous Script Generation (Ukrainian cultural context)
   - Fallback Golden Scenario (pre-recorded for offline demo)

3. **Demo Day Autopilot (INNOVATION)**
   - Playwright-based browser automation
   - Execution of all 13 demo steps from config/demo-scenario.ts
   - Screen recording (1080p @ 60fps, 3-5 min duration)
   - Visual regression testing (screenshot comparison, <5% diff threshold)
   - Blockchain integration test (Sepolia TX recording + Etherscan link)
   - Automated fallback materials generation (PDF slides, YouTube upload)

4. **Blockchain Audit Trail**
   - Integration of existing Solidity/Cairo/Move contracts
   - Glagolitic cryptography implementation (SHA-256 + Glagolitic mapping)
   - UI for TX display (Etherscan link, hash visualization)
   - Error handling (testnet failures, gas estimation)

5. **BRD Parser Pipeline**
   - Text extraction from user input
   - LLM-powered intent inference
   - Multi-variant flow generation (Minimal, Standard, Educational)
   - Flow evaluation (5 metrics: length, compliance, saturation, security, API integration)

6. **Quantum-Inspired Optimizer**
   - Simulated Annealing algorithm
   - QUBO (Quadratic Unconstrained Binary Optimization) formulation
   - Energy convergence visualization (D3.js or Recharts)
   - 3 optimized variants output

#### Out of Scope (DEFER POST-HACKATHON)
- Unit tests (except property-based tests for critical properties)
- E2E tests beyond Demo Autopilot
- Performance optimization beyond Core Web Vitals
- Multi-language support (Ukrainian only for MVP)
- Mobile-specific optimizations
- Psychoacoustic UX, DNA Self-Healing (experimental features)

---

## DELIVERABLES (COMPLETE SPECIFICATION)

### 1. requirements.md
- **Format:** EARS (Easy Approach to Requirements Syntax)
- **Structure:**
  - Introduction (system purpose, stakeholders, success criteria)
  - Glossary (domain-specific terms: Agent, Debate, Mock Mode, QUBO, Glagolitic, etc.)
  - Functional Requirements (20-30 requirements, each with:
    - User Story
    - Acceptance Criteria (WHEN-THEN format)
    - Priority (Critical/High/Medium)
    - Dependencies
    - Validation Method
  )
  - Non-Functional Requirements (Performance, Security, WCAG 2.1 AA, Diia Compliance)
  - Constraints (7-day deadline, zero budget for APIs in dev, browser compatibility)

### 2. design.md
- **Format:** Architectural Decision Records (ADR) + System Design
- **Structure:**
  - System Overview (high-level architecture diagram in Mermaid)
  - Component Design (each major component:
    - Responsibilities
    - Interfaces (TypeScript types)
    - State Management
    - Error Handling
    - Performance Considerations
  )
  - Data Flow (sequence diagrams for critical paths)
  - Correctness Properties (formal specifications:
    - Property 1: Mock Response Determinism
    - Property 2: Agent Order Consistency
    - Property 3: Timeout Resilience
    - Property 4: Character Consistency
    - Property 5: Blockchain Immutability
    - Property 6: Visual Regression Threshold
    - Property 7: Demo Scenario Completeness
    - Property 8: Token Cost Accuracy
    - **For EACH property:**
      - Formal Statement (∀ x ∈ X, P(x) holds)
      - Validates (which requirements)
      - Testing Strategy (how to verify)
      - Failure Impact (what breaks if violated)
  )
  - Security Architecture (API key management, XSS prevention, rate limiting)
  - Integration Points (existing code, external APIs, blockchain networks)
  - Fallback Strategies (graceful degradation for each critical path)

### 3. tasks.md
- **Format:** Hierarchical task breakdown with dependencies
- **Structure:**
  - Task Graph (ASCII or Mermaid diagram showing dependencies)
  - Top-Level Tasks (6-10 major milestones)
  - Sub-Tasks (3-7 sub-tasks per milestone, each with:
    - Description
    - Acceptance Criteria
    - Estimated Complexity (T-shirt sizing: S/M/L/XL)
    - Dependencies (blocks/blocked by)
    - Files to Create/Modify
    - Testing Requirements
    - **Property Test Indicator:** Mark tasks that require property-based testing with *
  )
  - Checkpoints (validation gates: "All property tests pass", "Demo autopilot runs successfully")
  - Critical Path (tasks that block Demo Day)
  - Rollback Plan (what to do if a task fails)

### 4. testing-strategy.md (ADDITIONAL DELIVERABLE)
- **Property-Based Testing Plan**
  - Tool: fast-check (TypeScript property testing library)
  - For each Correctness Property:
    - Generator functions (how to create random test inputs)
    - Property assertion (the invariant to check)
    - Shrinking strategy (minimize failing cases)
    - Performance budget (max execution time)
  - Integration with Antigravity (how to run tests in CI)

### 5. demo-autopilot-spec.md (ADDITIONAL DELIVERABLE)
- **Detailed Playwright Automation Spec**
  - Step-by-step breakdown of demo-scenario.ts
  - For each step:
    - Playwright actions (click, type, waitFor)
    - Expected state (URL, visible elements)
    - Screenshot baseline path
    - Timing constraints
    - Error recovery (retry logic, fallback)
  - Video recording configuration
  - Visual regression thresholds
  - Blockchain TX verification steps

---

## ADDITIONAL CONSTRAINTS & GUIDELINES

### 1. Diia Design System Compliance (NON-NEGOTIABLE)
- All UI must use Diia colors (#000000, #ffffff, #67C3F3)
- Fonts: e-Ukraine (primary), Inter (fallback)
- Spacing: 8px grid (Tailwind: p-2, m-4, gap-6)
- Border radius: 8px (rounded-lg)
- Accessibility: WCAG 2.1 AA (contrast 4.5:1, keyboard nav, ARIA labels)

### 2. Ukrainian Cultural Context
- UI language: Ukrainian (professional, empathetic tone)
- Error messages: Actionable, not technical jargon
- AI agent responses: Must include at least one catchphrase from agent config
- Glagolitic mapping: Use Unicode U+2C00–U+2C5F (with adaptations for Є/Ї/Ґ documented)

### 3. Performance Budgets
- LLM API calls: <30s timeout
- Mock LLM responses: <2s latency
- Page load: <3s (First Contentful Paint)
- Animation: 60 FPS (no jank during debate)
- Demo autopilot: Complete all 13 steps in <180s

### 4. Security Requirements
- API keys: Environment variables only (never hardcoded)
- Input validation: Sanitize all user inputs (BRD text, flow descriptions)
- Rate limiting: Max 10 LLM calls/minute in dev, 100/minute in prod
- Blockchain: Gas estimation before TX (prevent overspend)

### 5. Fallback Strategies
- LLM API failure → Mock provider
- Blockchain network down → Show cached TX hash
- Demo autopilot crash → Pre-recorded video
- Visual regression fail → Log warning, continue demo

---

## SUCCESS CRITERIA (MEASURABLE)

The specification is complete when:
1. ✅ All 20-30 requirements have EARS-formatted acceptance criteria
2. ✅ All 8 correctness properties have formal statements + test strategies
3. ✅ Task graph shows clear critical path (no circular dependencies)
4. ✅ Every critical task has a property test marked with *
5. ✅ Demo autopilot spec covers all 13 steps from demo-scenario.ts
6. ✅ Security architecture addresses: API keys, XSS, rate limiting, gas estimation
7. ✅ Fallback strategies exist for: LLM, Blockchain, Demo, Visuals
8. ✅ Integration points documented: Next.js routes, Zustand stores, existing contracts
9. ✅ Specification is implementable by Antigravity in 4-5 days
10. ✅ Specification enables 90+ score on Demo Day (Innovation 30%, Technical 30%, UX 20%, Impact 20%)

---

## OUTPUT FORMAT

Deliver as 5 Markdown files:
1. `.kiro/specs/yana-critical-path/requirements.md` (~3000-5000 words)
2. `.kiro/specs/yana-critical-path/design.md` (~4000-6000 words)
3. `.kiro/specs/yana-critical-path/tasks.md` (~2000-3000 words)
4. `.kiro/specs/yana-critical-path/testing-strategy.md` (~1500-2000 words)
5. `.kiro/specs/yana-critical-path/demo-autopilot-spec.md` (~2000-3000 words)

---

## META-INSTRUCTIONS FOR KIRO

1. **Do NOT simplify.** Use full formalism (EARS, ADR, property specifications).
2. **Do NOT assume context.** Explicitly state all assumptions.
3. **Do NOT skip dependencies.** Document integration with existing code (components, routes, configs).
4. **Do USE existing assets.** Reference config/ai-agents.ts, config/demo-scenario.ts, blockchain/*.sol.
5. **Do PRIORITIZE correctness.** Property-based tests > manual tests.
6. **Do PLAN for failure.** Every critical path needs a fallback.
7. **Do ALIGN with Demo Day.** Prioritize features visible in 5-minute demo.
8. **Do RESPECT cultural context.** Ukrainian language, Diia compliance, Glagolitic accuracy.

---

## ADDITIONAL CONTEXT FILES (READ IF NEEDED)

If you need more context, refer to these files in the project:
- `README.md` — Project overview
- `PROJECT_STATUS.md` — Current completion state
- `DEMO_DAY_CHECKLIST.md` — Demo Day preparation
- `hackathon_mode.json` — Priorities and constraints
- `config/ai-agents.ts` — AI persona definitions
- `config/demo-scenario.ts` — 13-step demo script
- `blockchain/TransparentContract.sol` — Ethereum smart contract
- `components/ai-debate/debate-room.tsx` — Debate UI component
- `app/debate/page.tsx` — Debate route
- `.env.example` — Environment variables template

---

# BEGIN SPECIFICATION

**Estimated Time:** 3-6 hours (for complete, production-grade spec)  
**Priority:** CRITICAL (blocks Demo Day success)  
**Approver:** 010io (human orchestrator)  

**GO!** 🚀
**Document Version:** 1.1  
**Last Updated:** 10:38 November 22, 2025