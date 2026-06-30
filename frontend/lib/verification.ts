/**
 * Verification Framework — Frontend Rendering Guards
 *
 * Every component must check canRender() before displaying data.
 * If data is missing, invalid, or has no evidence → component hides.
 *
 * Pattern:
 *   const canRender = canRenderMetric(data, condition)
 *   if (!canRender) return null
 *
 * This prevents any fabricated, incomplete, or unverified value from reaching users.
 */

// ── Metric verification conditions ────────────────────────────────

export interface VerificationResult {
  canRender: boolean
  reason?: string
}

/**
 * Check that a value exists, is of the right type, and passes optional validation.
 */
export function canRenderMetric(
  value: unknown,
  options: {
    /** The value must be truthy (not null, undefined, 0, false, empty) */
    required?: boolean
    /** The value must be a valid number */
    isNumber?: boolean
    /** The value must be in range [min, max] */
    min?: number
    max?: number
    /** The value must be a non-empty string */
    isString?: boolean
    /** The value must be a non-empty array */
    isArray?: boolean
    /** The value must be an object with at least these keys */
    hasKeys?: string[]
    /** Custom validation function */
    validate?: (value: unknown) => boolean
    /** Reason to show when rendering is blocked */
    failReason?: string
  } = {},
): VerificationResult {
  if (value == null) {
    return { canRender: false, reason: options.failReason || 'Value is null or undefined' }
  }

  if (options.required && !value) {
    return { canRender: false, reason: options.failReason || 'Required value is empty' }
  }

  if (options.isNumber) {
    if (typeof value !== 'number' || isNaN(value)) {
      return { canRender: false, reason: options.failReason || 'Value is not a valid number' }
    }
    if (options.min !== undefined && (value as number) < options.min) {
      return { canRender: false, reason: `Value ${value} is below minimum ${options.min}` }
    }
    if (options.max !== undefined && (value as number) > options.max) {
      return { canRender: false, reason: `Value ${value} exceeds maximum ${options.max}` }
    }
  }

  if (options.isString) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return { canRender: false, reason: options.failReason || 'Value is not a valid string' }
    }
  }

  if (options.isArray) {
    if (!Array.isArray(value) || value.length === 0) {
      return { canRender: false, reason: options.failReason || 'Value is not a non-empty array' }
    }
  }

  if (options.hasKeys && typeof value === 'object' && value !== null) {
    for (const key of options.hasKeys) {
      if (!(key in (value as Record<string, unknown>))) {
        return { canRender: false, reason: `Missing required key: ${key}` }
      }
    }
  }

  if (options.validate && !options.validate(value)) {
    return { canRender: false, reason: options.failReason || 'Custom validation failed' }
  }

  return { canRender: true }
}

/**
 * Check that an array of checks contains at least some valid data.
 */
export function canRenderChecks(checks: unknown[] | null | undefined): VerificationResult {
  if (!checks || !Array.isArray(checks) || checks.length === 0) {
    return { canRender: false, reason: 'No check data available' }
  }
  // At least one check must have valid structure
  const hasValidCheck = checks.some(
    (c) =>
      c &&
      typeof c === 'object' &&
      'name' in (c as Record<string, unknown>) &&
      typeof (c as Record<string, unknown>).score === 'number',
  )
  if (!hasValidCheck) {
    return { canRender: false, reason: 'No valid checks found in data' }
  }
  return { canRender: true }
}

/**
 * Check that a scan result is complete and valid.
 */
export function canRenderScanResult(
  result: Record<string, unknown> | null | undefined,
): VerificationResult {
  if (!result) {
    return { canRender: false, reason: 'No scan result data' }
  }

  const scoreCheck = canRenderMetric(result.total_score, {
    isNumber: true,
    min: 0,
    max: 100,
  })
  if (!scoreCheck.canRender) {
    return { canRender: false, reason: `Invalid score: ${scoreCheck.reason}` }
  }

  const checksCheck = canRenderChecks(result.checks as unknown[])
  if (!checksCheck.canRender) {
    return { canRender: false, reason: `Invalid checks: ${checksCheck.reason}` }
  }

  return { canRender: true }
}

// ── Per-component rendering guards ────────────────────────────────

export interface Check {
  name: string
  score: number
  max_score: number
  passed: boolean
  partial?: boolean
  finding?: string
  fix?: string
  details?: Record<string, unknown>
}

/**
 * canRender guards for every report section.
 * Named exports for easy importing.
 */

export function canRenderScoreHero(score: unknown, url: unknown): VerificationResult {
  const scoreCheck = canRenderMetric(score, { isNumber: true, min: 0, max: 100 })
  if (!scoreCheck.canRender) return scoreCheck
  return canRenderMetric(url, { isString: true })
}

export function canRenderScoreCard(score: unknown, band: unknown): VerificationResult {
  const scoreCheck = canRenderMetric(score, { isNumber: true, min: 0, max: 100 })
  if (!scoreCheck.canRender) return scoreCheck
  return canRenderMetric(band, { isString: true })
}

export function canRenderExecutiveSummary(score: unknown, checks: unknown): VerificationResult {
  const scoreCheck = canRenderMetric(score, { isNumber: true, min: 0, max: 100 })
  if (!scoreCheck.canRender) return scoreCheck
  return canRenderChecks(checks as unknown[])
}

export function canRenderScanConfidence(checks: unknown): VerificationResult {
  return canRenderChecks(checks as unknown[])
}

export function canRenderScoreImprovement(score: unknown, checks: unknown): VerificationResult {
  const scoreCheck = canRenderMetric(score, { isNumber: true, min: 0, max: 100 })
  if (!scoreCheck.canRender) return scoreCheck
  const checksCheck = canRenderChecks(checks as unknown[])
  if (!checksCheck.canRender) return checksCheck
  // Only render if there's something to improve
  const checkList = checks as Check[]
  const hasFailing = checkList.some((c) => !c.passed)
  return {
    canRender: hasFailing,
    reason: hasFailing ? undefined : 'No failing checks to improve',
  }
}

export function canRenderIndustryBenchmarking(score: unknown): VerificationResult {
  return canRenderMetric(score, { isNumber: true, min: 0, max: 100 })
}

export function canRenderRadarChart(checks: unknown): VerificationResult {
  return canRenderChecks(checks as unknown[])
}

export function canRenderAiAgentCompatibility(checks: unknown): VerificationResult {
  return canRenderChecks(checks as unknown[])
}

export function canRenderWhatThisMeans(score: unknown, checks: unknown): VerificationResult {
  const scoreCheck = canRenderMetric(score, { isNumber: true, min: 0, max: 100 })
  if (!scoreCheck.canRender) return scoreCheck
  return canRenderChecks(checks as unknown[])
}

export function canRenderAiVisibilitySummary(checks: unknown): VerificationResult {
  return canRenderChecks(checks as unknown[])
}

export function canRenderAiVisibilityJourney(checks: unknown): VerificationResult {
  return canRenderChecks(checks as unknown[])
}

export function canRenderDoNothingConsequences(checks: unknown): VerificationResult {
  const checksCheck = canRenderChecks(checks as unknown[])
  if (!checksCheck.canRender) return checksCheck
  const checkList = checks as Check[]
  const hasFailing = checkList.some((c) => !c.passed)
  return {
    canRender: hasFailing,
    reason: hasFailing ? undefined : 'No failing checks — nothing to warn about',
  }
}

export function canRenderPriorityFixRoadmap(checks: unknown): VerificationResult {
  const checksCheck = canRenderChecks(checks as unknown[])
  if (!checksCheck.canRender) return checksCheck
  const checkList = checks as Check[]
  const hasFailing = checkList.some((c) => !c.passed)
  return {
    canRender: hasFailing,
    reason: hasFailing ? undefined : 'No fixes needed',
  }
}

export function canRenderCheckCard(check: unknown): VerificationResult {
  return canRenderMetric(check, {
    hasKeys: ['name', 'score', 'max_score', 'passed'],
  })
}

export function canRenderUpgradeCta(score: unknown): VerificationResult {
  return canRenderMetric(score, { isNumber: true, min: 0, max: 85 })
}

/**
 * Evidence check — ensures a failed check has specific evidence before showing fix.
 */
export function hasValidEvidence(check: Check): boolean {
  if (check.passed) return true // No evidence needed for passed checks
  if (!check.finding || check.finding.length < 10) return false
  // Must contain specifics (numbers or concrete findings)
  const hasNumbers = /\d+/.test(check.finding)
  const hasSpecificTerms =
    /found|detected|blocked|allowed|missing|present|valid|invalid/i.test(check.finding)
  return hasNumbers || hasSpecificTerms
}
