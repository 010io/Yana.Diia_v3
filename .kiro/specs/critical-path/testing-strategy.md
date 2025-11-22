# Yana.Diia Critical Path - Testing Strategy

## Overview

This document defines the comprehensive testing strategy for the Yana.Diia Critical Path implementation, with emphasis on property-based testing using fast-check.

---

## Testing Philosophy

**Correctness First:** We prioritize formal correctness properties over manual test cases.

**Property-Based Testing:** Use fast-check to verify universal properties across random inputs (100+ iterations per property).

**Complementary Approaches:**
- **Property Tests:** Verify invariants hold for all inputs
- **Unit Tests:** Verify specific examples and edge cases
- **Integration Tests:** Verify components work together
- **E2E Tests:** Verify full user flows (via Demo Autopilot)

---

## Property-Based Testing with fast-check

### Installation

```bash
npm install --save-dev fast-check @types/jest
```

### Configuration

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.property.test.ts'],
  testTimeout: 60000 // 1 minute for property tests
}
```

---

## Property Test Specifications

### Property 1: Mock Response Determinism

**File:** `lib/llm/providers/__tests__/mock.property.test.ts`

**Formal Statement:**  
∀ prompt p, agentId a: mockProvider.call(p, {systemPrompt: a}) returns response from agent a's pool

**Generator Strategy:**
```typescript
const promptGen = fc.string({ minLength: 10, maxLength: 500 })
const agentGen = fc.constantFrom('zelenskyy', 'lesya', 'yaroslav', 'klitschko', 'boris', 'nbu', 'usyk')
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(promptGen, agentGen, async (prompt, agentId) => {
    const mockProvider = new MockProvider()
    const options = { systemPrompt: `Agent: ${agentId}` }
    const response = await mockProvider.call(prompt, options)
    const agentResponses = mockProvider.getResponsesForAgent(agentId)
    return agentResponses.includes(response.text)
  }),
  { numRuns: 100 }
)
```

**Shrinking:** fast-check automatically minimizes failing inputs

**Performance Budget:** < 10 seconds total

---

### Property 2: Agent Order Consistency

**File:** `lib/debate/__tests__/orchestrator.property.test.ts`

**Formal Statement:**  
∀ context c: agentOrchestrator.runDebate(c) returns messages in order [zelenskyy, lesya, yaroslav, klitschko, boris, nbu, usyk]

**Generator Strategy:**
```typescript
const contextGen = fc.record({
  serviceName: fc.string({ minLength: 5, maxLength: 50 }),
  flowSteps: fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
  userStory: fc.string({ minLength: 10, maxLength: 200 })
})
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(contextGen, async (context) => {
    const orchestrator = new AgentOrchestrator()
    const messages = await orchestrator.runDebate(context, () => {}, () => {})
    const agentIds = messages.map(m => m.agentId)
    const expectedOrder = ['zelenskyy', 'lesya', 'yaroslav', 'klitschko', 'boris', 'nbu', 'usyk']
    return JSON.stringify(agentIds) === JSON.stringify(expectedOrder)
  }),
  { numRuns: 50 }
)
```

**Performance Budget:** < 30 seconds total (depends on LLM mode)

---

### Property 3: Timeout Resilience

**File:** `lib/llm/__tests__/provider-selector.property.test.ts`

**Formal Statement:**  
∀ timeout t: If API exceeds t, fallback to mock within t + 2s

**Generator Strategy:**
```typescript
const promptGen = fc.string()
const timeoutGen = fc.integer({ min: 1000, max: 5000 })
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(promptGen, timeoutGen, async (prompt, timeout) => {
    const selector = new ProviderSelector()
    const slowProvider = {
      call: async () => {
        await new Promise(r => setTimeout(r, timeout + 1000))
        throw new Error('Timeout')
      }
    }
    const startTime = Date.now()
    const response = await selector.callWithFallback(prompt, { timeout }, slowProvider)
    const elapsed = Date.now() - startTime
    return response.provider === 'mock' && elapsed < timeout + 2000
  }),
  { numRuns: 20 }
)
```

**Performance Budget:** < 60 seconds total

---

### Property 4: Character Consistency

**File:** `lib/debate/__tests__/character-consistency.property.test.ts`

**Formal Statement:**  
∀ agent a, response r: r contains at least one catchphrase from a.catchphrases

**Generator Strategy:**
```typescript
const agentGen = fc.constantFrom(...AI_AGENTS)
const promptGen = fc.string({ minLength: 10, maxLength: 200 })
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(agentGen, promptGen, async (agent, prompt) => {
    const response = await providerSelector.call(prompt, {
      systemPrompt: agent.systemPrompt
    })
    const validatedText = agentOrchestrator.validateResponse(response.text, agent)
    return agent.catchphrases.some(phrase => 
      validatedText.toLowerCase().includes(phrase.toLowerCase())
    )
  }),
  { numRuns: 100 }
)
```

**Performance Budget:** < 120 seconds total

---

### Property 5: Blockchain Immutability

**File:** `lib/blockchain/__tests__/bridge.property.test.ts`

**Formal Statement:**  
∀ flow f: getFlow(f.id) at t1 and t2 returns identical data

**Generator Strategy:**
```typescript
const flowIdGen = fc.string({ minLength: 10, maxLength: 50 })
const hashGen = fc.hexaString({ minLength: 64, maxLength: 64 })
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(flowIdGen, hashGen, async (flowId, brdHash) => {
    await blockchainBridge.recordFlow(flowId, brdHash, 'ipfs://test', 'Test')
    await new Promise(r => setTimeout(r, 5000)) // Wait for confirmation
    
    const flow1 = await blockchainBridge.getFlow(flowId)
    await new Promise(r => setTimeout(r, 1000))
    const flow2 = await blockchainBridge.getFlow(flowId)
    
    return flow1.flowId === flow2.flowId &&
           flow1.brdHash === flow2.brdHash &&
           flow1.timestamp === flow2.timestamp
  }),
  { numRuns: 5 } // Fewer runs due to blockchain latency
)
```

**Performance Budget:** < 60 seconds total

---

### Property 6: Visual Regression Threshold

**File:** `lib/autopilot/__tests__/visual-regression.property.test.ts`

**Formal Statement:**  
∀ step s: pixelDiff(baseline(s), screenshot(s)) < 5%

**Generator Strategy:**
```typescript
const stepGen = fc.constantFrom(...FINANCE_AI_DEMO)
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(stepGen, async (step) => {
    const vr = new VisualRegression()
    await autopilot.executeStep(step)
    const screenshot = await autopilot.captureScreenshot()
    const baseline = await vr.loadBaseline(step.id)
    const diffPercent = await vr.compare(baseline, screenshot)
    return diffPercent < 5
  }),
  { numRuns: 13 } // One per demo step
)
```

**Performance Budget:** < 180 seconds total

---

### Property 7: Demo Scenario Completeness

**File:** `lib/autopilot/__tests__/playwright-engine.property.test.ts`

**Formal Statement:**  
∀ scenario: autopilot.run(scenario) completes all steps in 120-180s

**Generator Strategy:**
```typescript
const scenarioGen = fc.constant(FINANCE_AI_DEMO)
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(scenarioGen, async (scenario) => {
    const engine = new PlaywrightEngine()
    const startTime = Date.now()
    const results = await engine.run(scenario)
    const duration = (Date.now() - startTime) / 1000
    
    return results.completedSteps === 13 &&
           results.errors.length === 0 &&
           duration >= 120 &&
           duration <= 180
  }),
  { numRuns: 3 } // Expensive test
)
```

**Performance Budget:** < 540 seconds total (9 minutes)

---

### Property 8: Token Cost Accuracy

**File:** `lib/llm/__tests__/token-cost.property.test.ts`

**Formal Statement:**  
∀ call: |reported_tokens - actual_tokens| / actual_tokens < 10%

**Generator Strategy:**
```typescript
const promptGen = fc.string({ minLength: 10, maxLength: 1000 })
```

**Property Assertion:**
```typescript
fc.assert(
  fc.asyncProperty(promptGen, async (prompt) => {
    const response = await providerSelector.call(prompt)
    const actualTokens = await providerSelector.getActualTokenUsage(response.id)
    const diff = Math.abs(response.tokensUsed - actualTokens)
    const diffPercent = (diff / actualTokens) * 100
    return diffPercent <= 10
  }),
  { numRuns: 50 }
)
```

**Performance Budget:** < 90 seconds total

---

## Unit Testing Strategy

### Mock Provider Unit Tests

```typescript
// lib/llm/providers/__tests__/mock.test.ts
describe('MockProvider', () => {
  it('should return response within 2 seconds', async () => {
    const provider = new MockProvider()
    const start = Date.now()
    await provider.call('test prompt')
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(2000)
  })
  
  it('should include catchphrase in response', async () => {
    const provider = new MockProvider()
    const response = await provider.call('test', {
      systemPrompt: 'Agent: zelenskyy'
    })
    const zelenskyyCatchphrases = ['Всім привіт!', 'Коли реліз?', 'Це має бути просто.']
    const hasCatchphrase = zelenskyyCatchphrases.some(p => response.text.includes(p))
    expect(hasCatchphrase).toBe(true)
  })
})
```

### Blockchain Unit Tests

```typescript
// lib/blockchain/__tests__/glagolitic-crypto.test.ts
describe('Glagolitic Cryptography', () => {
  it('should create valid SHA-256 hash', async () => {
    const sig = await createGlagoliticSignature({ text: 'test' })
    expect(sig.hash).toHaveLength(64)
    expect(sig.hash).toMatch(/^[0-9a-f]+$/)
  })
  
  it('should map hex to Glagolitic', () => {
    const glagolitic = toGlagolitic('0123456789abcdef')
    expect(glagolitic).toMatch(/^[Ⰰ-Ⱞ]+$/)
  })
})
```

---

## Integration Testing Strategy

### Debate Flow Integration Test

```typescript
// __tests__/integration/debate-flow.test.ts
describe('Debate Flow Integration', () => {
  it('should complete full debate with mock provider', async () => {
    process.env.LLM_MODE = 'mock'
    
    const context = {
      serviceName: 'Test Service',
      flowSteps: ['Step 1', 'Step 2'],
      userStory: 'Test story'
    }
    
    const messages = await agentOrchestrator.runDebate(context, () => {}, () => {})
    
    expect(messages).toHaveLength(7)
    expect(messages[0].agentId).toBe('zelenskyy')
    expect(messages[6].agentId).toBe('usyk')
  })
})
```

### Blockchain Integration Test

```typescript
// __tests__/integration/blockchain.test.ts
describe('Blockchain Integration', () => {
  it('should record flow on Sepolia testnet', async () => {
    const flowId = `test-${Date.now()}`
    const sig = await createGlagoliticSignature({ text: 'test flow' })
    
    const txHash = await blockchainBridge.recordFlow(
      flowId, sig.hash, 'ipfs://test', 'Test flow'
    )
    
    expect(txHash).toMatch(/^0x[0-9a-f]{64}$/)
    
    // Wait for confirmation
    await new Promise(r => setTimeout(r, 10000))
    
    const flow = await blockchainBridge.getFlow(flowId)
    expect(flow.flowId).toBe(flowId)
    expect(flow.brdHash).toBe(sig.hash)
  }, 30000) // 30s timeout
})
```

---

## Test Execution Plan

### Local Development

```bash
# Run all tests
npm test

# Run only property tests
npm test -- --testPathPattern=property

# Run only unit tests
npm test -- --testPathPattern=test.ts

# Run with coverage
npm test -- --coverage
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
      - run: npm run test:property
```

### Pre-Demo Day Checklist

- [ ] All 8 property tests pass (100% success rate)
- [ ] All unit tests pass
- [ ] Integration tests pass (mock mode)
- [ ] Blockchain integration test passes (Sepolia)
- [ ] Demo autopilot completes successfully
- [ ] Visual regression tests pass (< 5% diff)
- [ ] Code coverage > 80%

---

## Performance Budgets

| Test Category | Max Time | Runs | Total Budget |
|---------------|----------|------|--------------|
| Property 1 | 0.1s | 100 | 10s |
| Property 2 | 0.6s | 50 | 30s |
| Property 3 | 3s | 20 | 60s |
| Property 4 | 1.2s | 100 | 120s |
| Property 5 | 12s | 5 | 60s |
| Property 6 | 14s | 13 | 180s |
| Property 7 | 180s | 3 | 540s |
| Property 8 | 1.8s | 50 | 90s |
| **Total** | | | **~18 min** |

---

## Failure Handling

### Property Test Failure

1. **Capture failing input:** fast-check provides minimal failing case
2. **Reproduce manually:** Run with specific seed
3. **Debug:** Add console.logs, inspect state
4. **Fix:** Update implementation
5. **Verify:** Re-run property test

### Integration Test Failure

1. **Check logs:** Review console output
2. **Verify environment:** Check API keys, network
3. **Isolate component:** Test in isolation
4. **Fix:** Update integration code
5. **Verify:** Re-run integration test

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025 11:45  
**Status:** Ready for Implementation

