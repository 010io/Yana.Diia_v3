# Yana.Diia Critical Path - Demo Autopilot Specification

## Overview

The Demo Autopilot is an automated system for executing the complete Demo Day scenario, recording video, and generating fallback materials. This document provides detailed Playwright automation specifications for all 13 demo steps.

---

## Demo Scenario Reference

**Source:** `config/demo-scenario.ts`  
**Total Duration:** 145 seconds (2:25)  
**Total Steps:** 13  
**Format:** Live demo OR pre-recorded video

---

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './lib/autopilot/__tests__',
  fullyParallel: false, // Sequential execution
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for demo
  workers: 1, // Single worker
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on', // Record video
    screenshot: 'on', // Capture screenshots
    viewport: { width: 1920, height: 1080 },
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## Step-by-Step Automation

### Step 1: Introduction (15s)

**ID:** `intro`  
**Action:** `demo`  
**Description:** Display landing page and introduce platform

**Playwright Actions:**
```typescript
await page.goto('/')
await page.waitForLoadState('networkidle')
await expect(page.locator('h1')).toContainText('Yana.Diia.AI')
await page.screenshot({ path: 'screenshots/01-intro.png' })
await page.waitForTimeout(15000)
```

**Expected State:**
- URL: `/`
- Visible: "Yana.Diia.AI 🇺🇦" heading
- Visible: "Запустити Платформу" button

**Baseline Screenshot:** `baselines/01-intro.png`

**Error Recovery:** If page doesn't load, retry once, then continue

---

### Step 2: Navigate to Lego Constructor (5s)

**ID:** `lego-open`  
**Action:** `navigate`  
**Target:** `/lego`

**Playwright Actions:**
```typescript
await page.click('text=Запустити Платформу')
await page.waitForURL('/dashboard')
await page.click('a[href="/lego"]')
await page.waitForURL('/lego')
await page.waitForLoadState('networkidle')
await page.screenshot({ path: 'screenshots/02-lego-open.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- URL: `/lego`
- Visible: "Lego-Diia Constructor" heading
- Visible: Component library sidebar
- Visible: Phone canvas

**Baseline Screenshot:** `baselines/02-lego-open.png`

---

### Step 3: Drag Components (20s)

**ID:** `lego-drag`  
**Action:** `demo`  
**Description:** Drag 4 components to canvas

**Playwright Actions:**
```typescript
// Component 1: DiiaSignatureButton
await page.locator('[data-component-id="diia-signature-btn"]').dragTo(
  page.locator('[data-canvas]')
)
await page.waitForTimeout(3000)

// Component 2: AmountInput
await page.locator('[data-component-id="input-amount"]').dragTo(
  page.locator('[data-canvas]')
)
await page.waitForTimeout(3000)

// Component 3: BankSelect
await page.locator('[data-component-id="bank-select"]').dragTo(
  page.locator('[data-canvas]')
)
await page.waitForTimeout(3000)

// Component 4: SuccessBanner
await page.locator('[data-component-id="success-banner"]').dragTo(
  page.locator('[data-canvas]')
)
await page.waitForTimeout(3000)

await page.screenshot({ path: 'screenshots/03-lego-drag.png' })
await page.waitForTimeout(8000)
```

**Expected State:**
- 4 components visible in canvas
- Yana Analyzer shows score (e.g., 92/100)

**Baseline Screenshot:** `baselines/03-lego-drag.png`

---

### Step 4: Yana Analyzer (10s)

**ID:** `yana-analysis`  
**Action:** `wait`  
**Description:** AI analyzes service in real-time

**Playwright Actions:**
```typescript
await expect(page.locator('[data-testid="yana-score"]')).toBeVisible()
await expect(page.locator('[data-testid="yana-score"]')).toContainText(/\d+\/100/)
await page.screenshot({ path: 'screenshots/04-yana-analysis.png' })
await page.waitForTimeout(10000)
```

**Expected State:**
- Yana Analyzer panel visible
- Score displayed (e.g., "92/100")
- Metrics bars visible

**Baseline Screenshot:** `baselines/04-yana-analysis.png`

---

### Step 5: Navigate to AI Debate (5s)

**ID:** `debate-start`  
**Action:** `navigate`  
**Target:** `/debate`

**Playwright Actions:**
```typescript
await page.click('a[href="/debate"]')
await page.waitForURL('/debate')
await page.waitForLoadState('networkidle')
await page.screenshot({ path: 'screenshots/05-debate-start.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- URL: `/debate`
- Visible: "AI Debate Chamber" heading
- Visible: 7 agent avatars
- Visible: "Почати Дебати" button

**Baseline Screenshot:** `baselines/05-debate-start.png`

---

### Step 6: Watch Debate (30s)

**ID:** `debate-watch`  
**Action:** `wait`  
**Description:** 7 agents discuss service

**Playwright Actions:**
```typescript
await page.click('button:has-text("Почати Дебати")')
await page.waitForSelector('[data-testid="debate-message"]', { timeout: 10000 })

// Wait for all 7 agents to speak
for (let i = 0; i < 7; i++) {
  await page.waitForSelector(`[data-agent-id="${AI_AGENTS[i].id}"][data-active="true"]`)
  await page.waitForTimeout(4000)
}

await page.screenshot({ path: 'screenshots/06-debate-watch.png' })
await page.waitForTimeout(2000)
```

**Expected State:**
- 7 messages visible
- Each message has agent avatar and text
- Last message from Usyk

**Baseline Screenshot:** `baselines/06-debate-watch.png`

---

### Step 7: Navigate to Quantum Optimizer (5s)

**ID:** `quantum-optimize`  
**Action:** `navigate`  
**Target:** `/quantum`

**Playwright Actions:**
```typescript
await page.click('a[href="/quantum"]')
await page.waitForURL('/quantum')
await page.waitForLoadState('networkidle')
await page.screenshot({ path: 'screenshots/07-quantum-optimize.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- URL: `/quantum`
- Visible: "Quantum Flow Optimizer" heading
- Visible: "Start Quantum Optimization" button

**Baseline Screenshot:** `baselines/07-quantum-optimize.png`

---

### Step 8: Run Optimization (15s)

**ID:** `quantum-run`  
**Action:** `click`  
**Target:** `button[optimize]`

**Playwright Actions:**
```typescript
await page.click('button:has-text("Start Quantum Optimization")')
await page.waitForSelector('[data-testid="energy-graph"]', { timeout: 5000 })
await page.waitForSelector('[data-testid="optimization-complete"]', { timeout: 30000 })
await page.screenshot({ path: 'screenshots/08-quantum-run.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- Energy convergence graph visible
- Progress bar at 100%
- Stats panel shows improvement

**Baseline Screenshot:** `baselines/08-quantum-run.png`

---

### Step 9: Show Variants (10s)

**ID:** `variants-show`  
**Action:** `wait`  
**Description:** Display 3 optimized variants

**Playwright Actions:**
```typescript
await expect(page.locator('[data-testid="variant-minimal"]')).toBeVisible()
await expect(page.locator('[data-testid="variant-standard"]')).toBeVisible()
await expect(page.locator('[data-testid="variant-educational"]')).toBeVisible()

await expect(page.locator('[data-testid="variant-minimal"]')).toContainText('3 steps')
await expect(page.locator('[data-testid="variant-standard"]')).toContainText('5 steps')
await expect(page.locator('[data-testid="variant-educational"]')).toContainText('7 steps')

await page.screenshot({ path: 'screenshots/09-variants-show.png' })
await page.waitForTimeout(10000)
```

**Expected State:**
- 3 variant cards visible
- Each shows step count and estimated time
- Scores displayed

**Baseline Screenshot:** `baselines/09-variants-show.png`

---

### Step 10: Navigate to Blockchain (5s)

**ID:** `blockchain-record`  
**Action:** `navigate`  
**Target:** `/blockchain`

**Playwright Actions:**
```typescript
await page.click('a[href="/blockchain"]')
await page.waitForURL('/blockchain')
await page.waitForLoadState('networkidle')
await page.screenshot({ path: 'screenshots/10-blockchain-record.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- URL: `/blockchain`
- Visible: "Glagolitic Blockchain Audit" heading
- Visible: Text input area

**Baseline Screenshot:** `baselines/10-blockchain-record.png`

---

### Step 11: Generate Glagolitic Signature (10s)

**ID:** `glagolitic-sign`  
**Action:** `demo`  
**Description:** Create signature and record on blockchain

**Playwright Actions:**
```typescript
await page.click('button:has-text("Load Example")')
await page.waitForTimeout(1000)

await page.click('button:has-text("Generate Glagolitic Signature")')
await page.waitForSelector('[data-testid="glagolitic-display"]', { timeout: 5000 })
await page.waitForSelector('[data-testid="tx-hash"]', { timeout: 15000 })

await page.screenshot({ path: 'screenshots/11-glagolitic-sign.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- Glagolitic text visible
- SHA-256 hash displayed
- TX hash with Etherscan link

**Baseline Screenshot:** `baselines/11-glagolitic-sign.png`

---

### Step 12: Export (5s)

**ID:** `export`  
**Action:** `demo`  
**Description:** Show export options

**Playwright Actions:**
```typescript
await page.click('a[href="/lego"]')
await page.waitForURL('/lego')
await page.click('button:has-text("Export")')
await page.waitForSelector('[data-testid="export-modal"]', { timeout: 3000 })
await page.screenshot({ path: 'screenshots/12-export.png' })
await page.waitForTimeout(5000)
```

**Expected State:**
- Export modal visible
- Options: React, Figma, JSON

**Baseline Screenshot:** `baselines/12-export.png`

---

### Step 13: Conclusion (10s)

**ID:** `conclusion`  
**Action:** `demo`  
**Description:** Return to dashboard and show summary

**Playwright Actions:**
```typescript
await page.click('a[href="/dashboard"]')
await page.waitForURL('/dashboard')
await page.waitForLoadState('networkidle')
await page.screenshot({ path: 'screenshots/13-conclusion.png' })
await page.waitForTimeout(10000)
```

**Expected State:**
- URL: `/dashboard`
- All feature cards visible
- Stats panel shows activity

**Baseline Screenshot:** `baselines/13-conclusion.png`

---

## Visual Regression Testing

### Baseline Generation

```bash
# Generate baseline screenshots (first run)
npm run autopilot -- --generate-baselines
```

### Comparison

```typescript
// lib/autopilot/visual-regression.ts
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

export async function compareScreenshots(
  baselinePath: string,
  screenshotPath: string
): Promise<number> {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath))
  const screenshot = PNG.sync.read(fs.readFileSync(screenshotPath))
  
  const { width, height } = baseline
  const diff = new PNG({ width, height })
  
  const numDiffPixels = pixelmatch(
    baseline.data,
    screenshot.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  )
  
  const diffPercent = (numDiffPixels / (width * height)) * 100
  
  if (diffPercent > 5) {
    // Save diff image
    fs.writeFileSync(`diffs/${path.basename(screenshotPath)}`, PNG.sync.write(diff))
  }
  
  return diffPercent
}
```

---

## Video Recording

### Configuration

```typescript
// playwright.config.ts
use: {
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 },
  },
}
```

### Post-Processing

```bash
# Convert to MP4 with FFmpeg
ffmpeg -i video.webm -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k demo.mp4
```

---

## Error Handling

### Retry Logic

```typescript
async function executeStepWithRetry(step: DemoStep, maxRetries = 1): Promise<void> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await executeStep(step)
      return
    } catch (error) {
      console.error(`Step ${step.id} failed (attempt ${attempt + 1}):`, error)
      await page.screenshot({ path: `errors/${step.id}-attempt-${attempt}.png` })
      
      if (attempt === maxRetries) {
        console.warn(`Skipping step ${step.id} after ${maxRetries + 1} attempts`)
        return
      }
      
      await page.waitForTimeout(2000)
    }
  }
}
```

### Graceful Degradation

- **Step fails:** Capture error screenshot, continue to next step
- **Timeout:** Log warning, continue
- **Network error:** Retry once, then continue
- **Visual regression fails:** Log diff, continue

---

## CLI Interface

```bash
# Run full autopilot
npm run autopilot

# Run with options
npm run autopilot -- --record --visual-regression --output=./demo-output

# Generate baselines only
npm run autopilot -- --generate-baselines

# Run specific steps
npm run autopilot -- --steps=1,2,3
```

### Implementation

```typescript
// scripts/autopilot.ts
import { program } from 'commander'

program
  .option('-r, --record', 'Record video')
  .option('-v, --visual-regression', 'Run visual regression tests')
  .option('-o, --output <path>', 'Output directory', './demo-output')
  .option('-b, --generate-baselines', 'Generate baseline screenshots')
  .option('-s, --steps <numbers>', 'Run specific steps (comma-separated)')
  .parse()

const options = program.opts()

// Execute autopilot with options
await runAutopilot(options)
```

---

## Success Criteria

- [ ] All 13 steps execute without errors
- [ ] Total duration: 120-180 seconds
- [ ] Video recorded at 1080p @ 60fps
- [ ] All screenshots captured
- [ ] Visual regression: < 5% diff for all steps
- [ ] Blockchain TX confirmed on Sepolia
- [ ] PDF slides generated

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025 12:00  
**Status:** Ready for Implementation

