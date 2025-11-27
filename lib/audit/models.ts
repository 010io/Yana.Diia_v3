/**
 * Data Models for Diia.AI Compliance Audit System
 * 
 * Implements serialization/deserialization for audit data models
 * to support persistence and round-trip testing.
 */

import {
  Requirement,
  AcceptanceCriterion,
  RequirementCategory,
  TestResult,
  TestStatus,
  TestEvidence,
  AuditResult,
  ComplianceScore,
  CategoryScore,
  AuditSummary,
  Issue,
  AuditMetadata,
  AuditConfiguration,
} from './types';

// ============================================
// Serialization/Deserialization Functions
// ============================================

/**
 * Serialize a Requirement to JSON string
 */
export function serializeRequirement(req: Requirement): string {
  return JSON.stringify(req);
}

/**
 * Deserialize a Requirement from JSON string
 */
export function deserializeRequirement(json: string): Requirement {
  const parsed = JSON.parse(json);
  return validateRequirement(parsed);
}

/**
 * Validate and normalize a Requirement object
 */
export function validateRequirement(obj: unknown): Requirement {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid requirement: must be an object');
  }
  
  const req = obj as Record<string, unknown>;
  
  if (typeof req.id !== 'string' || !req.id) {
    throw new Error('Invalid requirement: id must be a non-empty string');
  }
  if (typeof req.title !== 'string') {
    throw new Error('Invalid requirement: title must be a string');
  }
  if (typeof req.userStory !== 'string') {
    throw new Error('Invalid requirement: userStory must be a string');
  }
  if (!Array.isArray(req.acceptanceCriteria)) {
    throw new Error('Invalid requirement: acceptanceCriteria must be an array');
  }
  if (!Object.values(RequirementCategory).includes(req.category as RequirementCategory)) {
    throw new Error('Invalid requirement: invalid category');
  }
  
  return {
    id: req.id,
    title: req.title,
    userStory: req.userStory,
    acceptanceCriteria: req.acceptanceCriteria.map(validateAcceptanceCriterion),
    category: req.category as RequirementCategory,
  };
}


/**
 * Validate AcceptanceCriterion
 */
export function validateAcceptanceCriterion(obj: unknown): AcceptanceCriterion {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid criterion: must be an object');
  }
  
  const criterion = obj as Record<string, unknown>;
  
  if (typeof criterion.id !== 'string' || !criterion.id) {
    throw new Error('Invalid criterion: id must be a non-empty string');
  }
  if (typeof criterion.requirementId !== 'string') {
    throw new Error('Invalid criterion: requirementId must be a string');
  }
  if (typeof criterion.description !== 'string') {
    throw new Error('Invalid criterion: description must be a string');
  }
  if (typeof criterion.testable !== 'boolean') {
    throw new Error('Invalid criterion: testable must be a boolean');
  }
  
  return {
    id: criterion.id,
    requirementId: criterion.requirementId,
    description: criterion.description,
    testable: criterion.testable,
    propertyId: criterion.propertyId as string | undefined,
  };
}

/**
 * Serialize TestResult to JSON
 */
export function serializeTestResult(result: TestResult): string {
  return JSON.stringify({
    ...result,
    timestamp: result.timestamp.toISOString(),
  });
}

/**
 * Deserialize TestResult from JSON
 */
export function deserializeTestResult(json: string): TestResult {
  const parsed = JSON.parse(json);
  return validateTestResult(parsed);
}

/**
 * Validate TestResult
 */
export function validateTestResult(obj: unknown): TestResult {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid test result: must be an object');
  }
  
  const result = obj as Record<string, unknown>;
  
  if (typeof result.testId !== 'string') {
    throw new Error('Invalid test result: testId must be a string');
  }
  if (typeof result.propertyId !== 'string') {
    throw new Error('Invalid test result: propertyId must be a string');
  }
  if (typeof result.requirementId !== 'string') {
    throw new Error('Invalid test result: requirementId must be a string');
  }
  if (typeof result.criterionId !== 'string') {
    throw new Error('Invalid test result: criterionId must be a string');
  }
  if (!Object.values(TestStatus).includes(result.status as TestStatus)) {
    throw new Error('Invalid test result: invalid status');
  }
  if (typeof result.executionTime !== 'number') {
    throw new Error('Invalid test result: executionTime must be a number');
  }
  
  return {
    testId: result.testId,
    propertyId: result.propertyId,
    requirementId: result.requirementId,
    criterionId: result.criterionId,
    status: result.status as TestStatus,
    executionTime: result.executionTime,
    iterations: result.iterations as number | undefined,
    errorMessage: result.errorMessage as string | undefined,
    evidence: result.evidence as TestEvidence | undefined,
    timestamp: new Date(result.timestamp as string),
  };
}

/**
 * Serialize AuditResult to JSON
 */
export function serializeAuditResult(audit: AuditResult): string {
  return JSON.stringify({
    ...audit,
    timestamp: audit.timestamp.toISOString(),
    testResults: audit.testResults.map(r => ({
      ...r,
      timestamp: r.timestamp.toISOString(),
    })),
  });
}

/**
 * Deserialize AuditResult from JSON
 */
export function deserializeAuditResult(json: string): AuditResult {
  const parsed = JSON.parse(json);
  return validateAuditResult(parsed);
}

/**
 * Validate AuditResult
 */
export function validateAuditResult(obj: unknown): AuditResult {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid audit result: must be an object');
  }
  
  const audit = obj as Record<string, unknown>;
  
  if (typeof audit.auditId !== 'string') {
    throw new Error('Invalid audit result: auditId must be a string');
  }
  if (!Array.isArray(audit.requirements)) {
    throw new Error('Invalid audit result: requirements must be an array');
  }
  if (!Array.isArray(audit.testResults)) {
    throw new Error('Invalid audit result: testResults must be an array');
  }
  
  return {
    auditId: audit.auditId,
    timestamp: new Date(audit.timestamp as string),
    requirements: audit.requirements.map(validateRequirement),
    testResults: audit.testResults.map(validateTestResult),
    complianceScore: validateComplianceScore(audit.complianceScore),
    summary: validateAuditSummary(audit.summary),
    metadata: validateAuditMetadata(audit.metadata),
  };
}


/**
 * Validate ComplianceScore
 */
export function validateComplianceScore(obj: unknown): ComplianceScore {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid compliance score: must be an object');
  }
  
  const score = obj as Record<string, unknown>;
  
  if (typeof score.overall !== 'number' || score.overall < 0 || score.overall > 100) {
    throw new Error('Invalid compliance score: overall must be 0-100');
  }
  if (typeof score.automated !== 'number') {
    throw new Error('Invalid compliance score: automated must be a number');
  }
  if (typeof score.manual !== 'number') {
    throw new Error('Invalid compliance score: manual must be a number');
  }
  
  const byCategory = score.byCategory as Record<string, unknown>;
  const validatedByCategory: Record<RequirementCategory, CategoryScore> = {} as Record<RequirementCategory, CategoryScore>;
  
  for (const [key, value] of Object.entries(byCategory || {})) {
    if (Object.values(RequirementCategory).includes(key as RequirementCategory)) {
      validatedByCategory[key as RequirementCategory] = validateCategoryScore(value);
    }
  }
  
  return {
    overall: score.overall,
    byCategory: validatedByCategory,
    automated: score.automated,
    manual: score.manual,
  };
}

/**
 * Validate CategoryScore
 */
export function validateCategoryScore(obj: unknown): CategoryScore {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid category score: must be an object');
  }
  
  const score = obj as Record<string, unknown>;
  
  return {
    category: score.category as RequirementCategory,
    score: score.score as number,
    totalTests: score.totalTests as number,
    passedTests: score.passedTests as number,
    failedTests: score.failedTests as number,
    skippedTests: score.skippedTests as number,
  };
}

/**
 * Validate AuditSummary
 */
export function validateAuditSummary(obj: unknown): AuditSummary {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid audit summary: must be an object');
  }
  
  const summary = obj as Record<string, unknown>;
  
  return {
    totalRequirements: summary.totalRequirements as number,
    totalCriteria: summary.totalCriteria as number,
    totalTests: summary.totalTests as number,
    passedTests: summary.passedTests as number,
    failedTests: summary.failedTests as number,
    skippedTests: summary.skippedTests as number,
    executionTime: summary.executionTime as number,
    criticalIssues: (summary.criticalIssues as Issue[]) || [],
    recommendations: (summary.recommendations as string[]) || [],
  };
}

/**
 * Validate AuditMetadata
 */
export function validateAuditMetadata(obj: unknown): AuditMetadata {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid audit metadata: must be an object');
  }
  
  const meta = obj as Record<string, unknown>;
  
  return {
    version: meta.version as string,
    environment: meta.environment as string,
    configuration: validateAuditConfiguration(meta.configuration),
    executor: meta.executor as string,
  };
}

/**
 * Validate AuditConfiguration
 */
export function validateAuditConfiguration(obj: unknown): AuditConfiguration {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid audit configuration: must be an object');
  }
  
  const config = obj as Record<string, unknown>;
  
  return {
    includeManualTests: config.includeManualTests as boolean,
    propertyTestIterations: config.propertyTestIterations as number,
    categories: config.categories as RequirementCategory[],
    outputFormat: config.outputFormat as 'json' | 'html' | 'markdown',
    evidenceCollection: config.evidenceCollection as boolean,
  };
}

// ============================================
// Factory Functions
// ============================================

/**
 * Create a new empty AuditResult
 */
export function createAuditResult(auditId: string): AuditResult {
  return {
    auditId,
    timestamp: new Date(),
    requirements: [],
    testResults: [],
    complianceScore: createEmptyComplianceScore(),
    summary: createEmptySummary(),
    metadata: createDefaultMetadata(),
  };
}

/**
 * Create empty ComplianceScore
 */
export function createEmptyComplianceScore(): ComplianceScore {
  const byCategory: Record<RequirementCategory, CategoryScore> = {} as Record<RequirementCategory, CategoryScore>;
  
  for (const category of Object.values(RequirementCategory)) {
    byCategory[category] = {
      category,
      score: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
    };
  }
  
  return {
    overall: 0,
    byCategory,
    automated: 0,
    manual: 0,
  };
}

/**
 * Create empty AuditSummary
 */
export function createEmptySummary(): AuditSummary {
  return {
    totalRequirements: 0,
    totalCriteria: 0,
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    executionTime: 0,
    criticalIssues: [],
    recommendations: [],
  };
}

/**
 * Create default AuditMetadata
 */
export function createDefaultMetadata(): AuditMetadata {
  return {
    version: '1.0.0',
    environment: 'development',
    configuration: {
      includeManualTests: false,
      propertyTestIterations: 100,
      categories: Object.values(RequirementCategory),
      outputFormat: 'json',
      evidenceCollection: true,
    },
    executor: 'system',
  };
}

/**
 * Create a TestResult
 */
export function createTestResult(
  testId: string,
  propertyId: string,
  requirementId: string,
  criterionId: string,
  status: TestStatus,
  executionTime: number
): TestResult {
  return {
    testId,
    propertyId,
    requirementId,
    criterionId,
    status,
    executionTime,
    timestamp: new Date(),
  };
}
