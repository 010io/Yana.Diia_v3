/**
 * Diia.AI Compliance Audit System
 * 
 * Main entry point for the audit infrastructure.
 * Exports all core types, classes, and utilities.
 */

// Core types
export * from './types';

// Orchestrator
export { AuditOrchestrator } from './orchestrator';

// Requirement loader
export { parseRequirements, loadRequirementsFromFile } from './requirement-loader';

// Data models and serialization
export {
  serializeRequirement,
  deserializeRequirement,
  validateRequirement,
  validateAcceptanceCriterion,
  serializeTestResult,
  deserializeTestResult,
  validateTestResult,
  serializeAuditResult,
  deserializeAuditResult,
  validateAuditResult,
  validateComplianceScore,
  validateCategoryScore,
  validateAuditSummary,
  validateAuditMetadata,
  validateAuditConfiguration,
  createAuditResult,
  createEmptyComplianceScore,
  createEmptySummary,
  createDefaultMetadata,
  createTestResult,
} from './models';
