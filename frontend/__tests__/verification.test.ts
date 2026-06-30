/**
 * Tests for frontend rendering guards (verification.ts).
 *
 * Verifies that every canRender* function:
 *   - Returns { canRender: true } for valid data
 *   - Returns { canRender: false } for null/undefined/invalid data
 *   - Never throws
 */

import {
  canRenderMetric,
  canRenderChecks,
  canRenderScanResult,
  canRenderScoreHero,
  canRenderScoreCard,
  canRenderExecutiveSummary,
  canRenderScanConfidence,
  canRenderScoreImprovement,
  canRenderIndustryBenchmarking,
  canRenderRadarChart,
  canRenderAiAgentCompatibility,
  canRenderWhatThisMeans,
  canRenderAiVisibilitySummary,
  canRenderAiVisibilityJourney,
  canRenderDoNothingConsequences,
  canRenderPriorityFixRoadmap,
  canRenderCheckCard,
  canRenderUpgradeCta,
  hasValidEvidence,
  type Check,
} from '../lib/verification'

// ── Sample valid data ─────────────────────────────────────────────

const VALID_CHECK: Check = {
  name: 'JSON-LD Structured Data',
  score: 15,
  max_score: 20,
  passed: true,
  partial: false,
  finding: 'Valid schema found with all required fields.',
  fix: 'No action needed.',
}

const FAILED_CHECK: Check = {
  name: 'MCP Endpoint',
  score: 0,
  max_score: 20,
  passed: false,
  partial: false,
  finding: 'No MCP endpoint found at /.well-known/mcp. 0 endpoints detected.',
  fix: 'Add a proper MCP endpoint at /.well-known/mcp.',
}

const VALID_CHECKS: Check[] = [VALID_CHECK, FAILED_CHECK]

const VALID_RESULT = {
  total_score: 45,
  band: 'Mostly Invisible',
  band_message: 'Test message',
  checks: VALID_CHECKS,
  scan_time_ms: 12000,
  url: 'https://example.com',
}

// ════════════════════════════════════════════════════════════════════
// canRenderMetric
// ════════════════════════════════════════════════════════════════════

describe('canRenderMetric', () => {
  it('returns true for valid number', () => {
    expect(canRenderMetric(50, { isNumber: true, min: 0, max: 100 })).toEqual({ canRender: true })
  })

  it('returns false for null/undefined', () => {
    expect(canRenderMetric(null, { required: true }).canRender).toBe(false)
    expect(canRenderMetric(undefined, { required: true }).canRender).toBe(false)
  })

  it('returns false for NaN', () => {
    expect(canRenderMetric(NaN, { isNumber: true }).canRender).toBe(false)
  })

  it('returns false for number outside range', () => {
    expect(canRenderMetric(150, { isNumber: true, min: 0, max: 100 }).canRender).toBe(false)
    expect(canRenderMetric(-5, { isNumber: true, min: 0, max: 100 }).canRender).toBe(false)
  })

  it('returns true for valid string', () => {
    expect(canRenderMetric('hello', { isString: true })).toEqual({ canRender: true })
  })

  it('returns false for empty string', () => {
    expect(canRenderMetric('', { isString: true }).canRender).toBe(false)
    expect(canRenderMetric('  ', { isString: true }).canRender).toBe(false)
  })

  it('returns false for non-string when string expected', () => {
    expect(canRenderMetric(123, { isString: true }).canRender).toBe(false)
  })

  it('returns true for non-empty array', () => {
    expect(canRenderMetric([1, 2, 3], { isArray: true })).toEqual({ canRender: true })
  })

  it('returns false for empty array', () => {
    expect(canRenderMetric([], { isArray: true }).canRender).toBe(false)
  })

  it('returns true when object has required keys', () => {
    expect(canRenderMetric({ name: 'test', score: 5 }, { hasKeys: ['name', 'score'] })).toEqual({
      canRender: true,
    })
  })

  it('returns false when object missing required keys', () => {
    expect(canRenderMetric({ name: 'test' }, { hasKeys: ['name', 'score'] }).canRender).toBe(false)
  })

  it('returns false on custom validation failure', () => {
    expect(canRenderMetric('x', { validate: (v) => false }).canRender).toBe(false)
  })

  it('never throws for edge case inputs', () => {
    expect(() => canRenderMetric(undefined as unknown, {})).not.toThrow()
    expect(() => canRenderMetric(null as unknown, {})).not.toThrow()
    expect(() => canRenderMetric('' as unknown, { isNumber: true })).not.toThrow()
    expect(() => canRenderMetric({} as unknown, { isString: true })).not.toThrow()
  })
})

// ════════════════════════════════════════════════════════════════════
// canRenderChecks
// ════════════════════════════════════════════════════════════════════

describe('canRenderChecks', () => {
  it('returns true for valid checks array', () => {
    expect(canRenderChecks(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for null/undefined', () => {
    expect(canRenderChecks(null).canRender).toBe(false)
    expect(canRenderChecks(undefined).canRender).toBe(false)
  })

  it('returns false for empty array', () => {
    expect(canRenderChecks([]).canRender).toBe(false)
  })

  it('returns false for array with no valid check objects', () => {
    expect(canRenderChecks([{}, { invalid: true }]).canRender).toBe(false)
  })

  it('returns true if at least one check has valid structure', () => {
    const mixed = [{}, VALID_CHECK]
    expect(canRenderChecks(mixed)).toEqual({ canRender: true })
  })
})

// ════════════════════════════════════════════════════════════════════
// canRenderScanResult
// ════════════════════════════════════════════════════════════════════

describe('canRenderScanResult', () => {
  it('returns true for valid result', () => {
    expect(canRenderScanResult(VALID_RESULT)).toEqual({ canRender: true })
  })

  it('returns false for null', () => {
    expect(canRenderScanResult(null).canRender).toBe(false)
  })

  it('returns false for missing score', () => {
    expect(canRenderScanResult({ checks: VALID_CHECKS }).canRender).toBe(false)
  })

  it('returns false for missing checks', () => {
    expect(canRenderScanResult({ total_score: 50 }).canRender).toBe(false)
  })

  it('returns false for out-of-range score', () => {
    expect(canRenderScanResult({ total_score: 150, checks: VALID_CHECKS }).canRender).toBe(false)
  })
})

// ════════════════════════════════════════════════════════════════════
// Component-specific canRender guards
// ════════════════════════════════════════════════════════════════════

describe('canRenderScoreHero', () => {
  it('returns true for valid score and url', () => {
    expect(canRenderScoreHero(75, 'https://example.com')).toEqual({ canRender: true })
  })

  it('returns false for invalid score', () => {
    expect(canRenderScoreHero(null, 'https://example.com').canRender).toBe(false)
    expect(canRenderScoreHero(-5, 'https://example.com').canRender).toBe(false)
  })
})

describe('canRenderScoreCard', () => {
  it('returns true for valid score and band', () => {
    expect(canRenderScoreCard(75, 'Partially Visible')).toEqual({ canRender: true })
  })

  it('returns false for missing band', () => {
    expect(canRenderScoreCard(75, null).canRender).toBe(false)
  })
})

describe('canRenderExecutiveSummary', () => {
  it('returns true for valid score and checks', () => {
    expect(canRenderExecutiveSummary(50, VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for missing checks', () => {
    expect(canRenderExecutiveSummary(50, null).canRender).toBe(false)
  })
})

describe('canRenderScanConfidence', () => {
  it('returns true for valid checks', () => {
    expect(canRenderScanConfidence(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for null checks', () => {
    expect(canRenderScanConfidence(null).canRender).toBe(false)
  })
})

describe('canRenderScoreImprovement', () => {
  it('returns true when there are failing checks', () => {
    expect(canRenderScoreImprovement(25, VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false when all checks pass', () => {
    const allPassing: Check[] = [
      { ...VALID_CHECK, passed: true },
      { ...FAILED_CHECK, passed: true, score: 20 },
    ]
    expect(canRenderScoreImprovement(100, allPassing).canRender).toBe(false)
  })

  it('returns false for null checks', () => {
    expect(canRenderScoreImprovement(50, null).canRender).toBe(false)
  })
})

describe('canRenderIndustryBenchmarking', () => {
  it('returns true for valid score', () => {
    expect(canRenderIndustryBenchmarking(50)).toEqual({ canRender: true })
  })

  it('returns false for null score', () => {
    expect(canRenderIndustryBenchmarking(null).canRender).toBe(false)
  })
})

describe('canRenderRadarChart', () => {
  it('returns true for valid checks', () => {
    expect(canRenderRadarChart(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for null checks', () => {
    expect(canRenderRadarChart(null).canRender).toBe(false)
  })
})

describe('canRenderAiAgentCompatibility', () => {
  it('returns true for valid checks', () => {
    expect(canRenderAiAgentCompatibility(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for null', () => {
    expect(canRenderAiAgentCompatibility(null).canRender).toBe(false)
  })
})

describe('canRenderWhatThisMeans', () => {
  it('returns true for valid score and checks', () => {
    expect(canRenderWhatThisMeans(50, VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for invalid score', () => {
    expect(canRenderWhatThisMeans(null, VALID_CHECKS).canRender).toBe(false)
  })
})

describe('canRenderAiVisibilitySummary', () => {
  it('returns true for valid checks', () => {
    expect(canRenderAiVisibilitySummary(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for null', () => {
    expect(canRenderAiVisibilitySummary(null).canRender).toBe(false)
  })
})

describe('canRenderAiVisibilityJourney', () => {
  it('returns true for valid checks', () => {
    expect(canRenderAiVisibilityJourney(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false for null', () => {
    expect(canRenderAiVisibilityJourney(null).canRender).toBe(false)
  })
})

describe('canRenderDoNothingConsequences', () => {
  it('returns true when there are failing checks', () => {
    expect(canRenderDoNothingConsequences(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false when all checks pass', () => {
    const allPassing: Check[] = [
      { ...VALID_CHECK, passed: true },
      { ...FAILED_CHECK, passed: true, score: 20 },
    ]
    expect(canRenderDoNothingConsequences(allPassing).canRender).toBe(false)
  })

  it('returns false for null', () => {
    expect(canRenderDoNothingConsequences(null).canRender).toBe(false)
  })
})

describe('canRenderPriorityFixRoadmap', () => {
  it('returns true when there are failing checks', () => {
    expect(canRenderPriorityFixRoadmap(VALID_CHECKS)).toEqual({ canRender: true })
  })

  it('returns false when all checks pass', () => {
    const allPassing: Check[] = [
      { ...VALID_CHECK, passed: true },
      { ...FAILED_CHECK, passed: true, score: 20 },
    ]
    expect(canRenderPriorityFixRoadmap(allPassing).canRender).toBe(false)
  })
})

describe('canRenderCheckCard', () => {
  it('returns true for valid check object', () => {
    expect(canRenderCheckCard(VALID_CHECK)).toEqual({ canRender: true })
  })

  it('returns false for missing required keys', () => {
    expect(canRenderCheckCard({}).canRender).toBe(false)
    expect(canRenderCheckCard({ name: 'test' }).canRender).toBe(false)
  })
})

describe('canRenderUpgradeCta', () => {
  it('returns true for low scores', () => {
    expect(canRenderUpgradeCta(40)).toEqual({ canRender: true })
    expect(canRenderUpgradeCta(0)).toEqual({ canRender: true })
  })

  it('returns false for scores >= 85', () => {
    expect(canRenderUpgradeCta(85).canRender).toBe(false)
    expect(canRenderUpgradeCta(95).canRender).toBe(false)
  })

  it('returns false for null', () => {
    expect(canRenderUpgradeCta(null).canRender).toBe(false)
  })
})

// ════════════════════════════════════════════════════════════════════
// hasValidEvidence
// ════════════════════════════════════════════════════════════════════

describe('hasValidEvidence', () => {
  it('returns true for passed checks (no evidence needed)', () => {
    expect(hasValidEvidence(VALID_CHECK)).toBe(true)
  })

  it('returns false for failed check with no finding', () => {
    const noFinding: Check = { ...FAILED_CHECK, finding: '' }
    expect(hasValidEvidence(noFinding)).toBe(false)
  })

  it('returns false for failed check with short finding', () => {
    const shortFinding: Check = { ...FAILED_CHECK, finding: 'Error' }
    expect(hasValidEvidence(shortFinding)).toBe(false)
  })

  it('returns true for failed check with numbers in finding', () => {
    expect(hasValidEvidence(FAILED_CHECK)).toBe(true)
  })

  it('returns true for failed check with specific terms', () => {
    const specific: Check = {
      ...FAILED_CHECK,
      finding: 'MCP endpoint was not found at any of the checked paths.',
    }
    expect(hasValidEvidence(specific)).toBe(true)
  })

  it('returns false for failed check with generic finding', () => {
    const generic: Check = {
      ...FAILED_CHECK,
      finding: 'An error occurred during the check.',
    }
    expect(hasValidEvidence(generic)).toBe(false)
  })
})
