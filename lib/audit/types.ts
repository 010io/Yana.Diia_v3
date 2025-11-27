/**
 * Core types and interfaces for Diia.AI Compliance Audit System
 * 
 * This module defines the foundational data structures used throughout
 * the audit system for tracking requirements, test results, and compliance scores.
 */

/**
 * Represents a single requirement from the requirements.md specification
 */
export interface Requirement {
  id: string;
  title: string;
  userStory: string;
  acceptanceCriteria: AcceptanceCriterion[];
  category: RequirementCategory;
}

/**
 * Categories of requirements based on Diia.AI 2025 specification
 */
export enum RequirementCategory {
  NLP = 'NLP',
  DesignSystem = 'Design System',
  VisualConstructor = 'Visual Constructor',
  AIFlowGeneration = 'AI Flow Generation',
  JudgeModule = 'Judge Module',
  Export = 'Export',
  Collaboration = 'Interactive Collaboration',
  RegistryAPI = 'Registry API Integration',
  Accessibility = 'Accessibility',
  Performance = 'Performance',
  AIDebate = 'AI Debate',
  VersionControl = 'Version Control',
}

/**
 * Single acceptance criterion within a requirement
 */
export interface AcceptanceCriterion {
  id: string;
  requirementId: string;
  description: string;
  testable: boolean;
  propertyId?: string; // Links to correctness property if testable
}

/**
 * Result of executing a single test
 */
export interface TestResult {
  testId: string;
  propertyId: string;
  requirementId: string;
  criterionId: string;
  status: TestStatus;
  executionTime: number; // milliseconds
  iterations?: number; // for property-based tests
  errorMessage?: string;
  evidence?: TestEvidence;
  timestamp: Date;
}

/**
 * Status of a test execution
 */
export enum TestStatus {
  Passed = 'passed',
  Failed = 'failed',
  Skipped = 'skipped',
  Error = 'error',
  NotRun = 'not_run',
}

/**
 * Evidence collected during test execution
 */
export interface TestEvidence {
  screenshots?: string[];
  logs?: string[];
  metrics?: Record<string, number>;
  artifacts?: string[];
}

/**
 * Aggregated results for an entire audit run
 */
export interface AuditResult {
  auditId: string;
  timestamp: Date;
  requirements: Requirement[];
  testResults: TestResult[];
  complianceScore: ComplianceScore;
  summary: AuditSummary;
  metadata: AuditMetadata;
}

/**
 * Compliance score breakdown
 */
export interface ComplianceScore {
  overall: number; // 0-100
  byCategory: Record<RequirementCategory, CategoryScore>;
  automated: number; // percentage of automated tests
  manual: number; // percentage of manual verification
}

/**
 * Score for a specific requirement category
 */
export interface CategoryScore {
  category: RequirementCategory;
  score: number; // 0-100
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
}

/**
 * High-level summary of audit results
 */
export interface AuditSummary {
  totalRequirements: number;
  totalCriteria: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  executionTime: number; // milliseconds
  criticalIssues: Issue[];
  recommendations: string[];
}

/**
 * Critical issue identified during audit
 */
export interface Issue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  requirementId: string;
  criterionId: string;
  description: string;
  recommendation: string;
}

/**
 * Metadata about the audit execution
 */
export interface AuditMetadata {
  version: string;
  environment: string;
  configuration: AuditConfiguration;
  executor: string;
}

/**
 * Configuration for audit execution
 */
export interface AuditConfiguration {
  includeManualTests: boolean;
  propertyTestIterations: number;
  categories: RequirementCategory[];
  outputFormat: 'json' | 'html' | 'markdown';
  evidenceCollection: boolean;
}
