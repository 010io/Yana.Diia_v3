# Yana.Diia Critical Path - Specification

## Overview

This specification defines the production-grade implementation of critical features for Yana.Diia.AI Demo Day (November 29, 2025).

## Documents

1. **[requirements.md](./requirements.md)** - Formal requirements using EARS syntax
   - 10 requirements with 47 acceptance criteria
   - EARS compliance: 100%
   - Testable criteria: 95.7%

2. **[design.md](./design.md)** - System architecture and correctness properties
   - Component design with TypeScript interfaces
   - 8 formal correctness properties
   - Security architecture
   - Integration points with existing code

3. **[tasks.md](./tasks.md)** - Implementation task breakdown
   - 27 main tasks + 7 property tests = 34 total
   - Critical path: 18 P0 tasks
   - Estimated time: 4-5 days

4. **[testing-strategy.md](./testing-strategy.md)** - Comprehensive testing plan
   - Property-based testing with fast-check
   - 8 properties with generators and assertions
   - Unit and integration test specifications
   - Performance budgets

5. **[demo-autopilot-spec.md](./demo-autopilot-spec.md)** - Playwright automation
   - 13 demo steps with detailed Playwright actions
   - Visual regression testing
   - Video recording configuration
   - Error handling and retry logic

## Quick Start

### Review Specification

```bash
# Read requirements
cat .kiro/specs/critical-path/requirements.md

# Read design
cat .kiro/specs/critical-path/design.md

# Read tasks
cat .kiro/specs/critical-path/tasks.md
```

### Begin Implementation

1. Open `tasks.md` in your editor
2. Click "Start task" next to task 1.1
3. Follow the implementation plan
4. Run property tests after each major component
5. Complete checkpoints before moving to next section

### Run Tests

```bash
# Install dependencies
npm install --save-dev fast-check @playwright/test pixelmatch

# Run property tests
npm test -- --testPathPattern=property

# Run autopilot
npm run autopilot
```

## Key Features

### 1. LLM Provider Infrastructure
- Mock, OpenAI, Anthropic providers
- Automatic fallback and retry
- Token tracking

### 2. AI Debate Chamber
- 7 Ukrainian AI personas
- Sequential agent orchestration
- Character consistency validation

### 3. Blockchain Audit Trail
- Glagolitic cryptography
- Sepolia testnet integration
- Immutable flow records

### 4. Quantum Flow Optimizer
- Simulated annealing algorithm
- QUBO energy formulation
- 3 optimized variants

### 5. Demo Day Autopilot
- Playwright browser automation
- 13-step demo execution
- Video recording (1080p @ 60fps)
- Visual regression testing

## Correctness Properties

1. **Mock Response Determinism** - Responses match agent pools
2. **Agent Order Consistency** - Debate follows fixed sequence
3. **Timeout Resilience** - Fallback within timeout + 2s
4. **Character Consistency** - Responses contain catchphrases
5. **Blockchain Immutability** - Data unchanged on retrieval
6. **Visual Regression Threshold** - Screenshot diff < 5%
7. **Demo Scenario Completeness** - All 13 steps in 120-180s
8. **Token Cost Accuracy** - Reported tokens within ±10%

## Success Criteria

- ✅ All 47 acceptance criteria met
- ✅ All 8 properties verified (100+ test runs each)
- ✅ Demo autopilot completes successfully
- ✅ Backup video recorded
- ✅ Visual regression tests pass
- ✅ Ready for Demo Day

## Timeline

**Day 1-2:** LLM Infrastructure + AI Debate  
**Day 3:** Blockchain + Quantum Optimizer  
**Day 4:** Demo Autopilot  
**Day 5:** Testing + Demo Prep  

## Support

For questions or clarifications:
- Review design.md for architecture details
- Check testing-strategy.md for test examples
- See demo-autopilot-spec.md for Playwright actions

---

**Status:** ✅ Specification Complete  
**Version:** 1.0  
**Last Updated:** November 22, 2025  
**Ready for Implementation:** YES

**Слава Україні!** 🇺🇦🚀

