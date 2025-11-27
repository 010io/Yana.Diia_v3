/**
 * Audit Orchestrator - Main coordination class for compliance audit execution
 * 
 * Responsibilities:
 * - Load and parse requirements
 * - Coordinate test suite execution
 * - Aggregate results
 * - Generate compliance reports
 */

import {
  AuditConfiguration,
  AuditResult,
  AuditSummary,
  ComplianceScore,
  Requirement,
  TestResult,
  TestStatus,
  RequirementCategory,
  CategoryScore,
  AuditMetadata,
} from './types';

export class AuditOrchestrator {
  private config: AuditConfiguration;
  private requirements: Requirement[] = [];
  private testResults: TestResult[] = [];
  private startTime: number = 0;

  constructor(config: Partial<AuditConfiguration> = {}) {
    this.config = {
      includeManualTests: config.includeManualTests ?? false,
      propertyTestIterations: config.propertyTestIterations ?? 100,
      categories: config.categories ?? Object.values(RequirementCategory),
      outputFormat: config.outputFormat ?? 'json',
      evidenceCollection: config.evidenceCollection ?? true,
    };
  }

  /**
   * Load requirements from specification
   */
  async loadRequirements(requirements: Requirement[]): Promise<void> {
    this.requirements = requirements.filter((req) =>
      this.config.categories.includes(req.category)
    );
  }

  /**
   * Execute all configured tests
   */
  async executeAudit(): Promise<AuditResult> {
    this.startTime = Date.now();
    this.testResults = [];

    // Test execution will be implemented in subsequent tasks
    // For now, this is the orchestration framework

    const executionTime = Date.now() - this.startTime;

    return {
      auditId: this.generateAuditId(),
      timestamp: new Date(),
      requirements: this.requirements,
      testResults: this.testResults,
      complianceScore: this.calculateComplianceScore(),
      summary: this.generateSummary(executionTime),
      metadata: this.generateMetadata(),
    };
  }

  /**
   * Add a test result to the audit
   */
  addTestResult(result: TestResult): void {
    this.testResults.push(result);
  }

  /**
   * Calculate overall compliance score
   */
  private calculateComplianceScore(): ComplianceScore {
    const byCategory: Record<RequirementCategory, CategoryScore> = {} as any;

    // Calculate scores by category
    for (const category of this.config.categories) {
      const categoryTests = this.testResults.filter((result) => {
        const req = this.requirements.find((r) => r.id === result.requirementId);
        return req?.category === category;
      });

      const passed = categoryTests.filter((t) => t.status === TestStatus.Passed).length;
      const failed = categoryTests.filter((t) => t.status === TestStatus.Failed).length;
      const skipped = categoryTests.filter((t) => t.status === TestStatus.Skipped).length;
      const total = categoryTests.length;

      byCategory[category] = {
        category,
        score: total > 0 ? (passed / total) * 100 : 0,
        totalTests: total,
        passedTests: passed,
        failedTests: failed,
        skippedTests: skipped,
      };
    }

    // Calculate overall score
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter((t) => t.status === TestStatus.Passed).length;
    const overall = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    // Calculate automation percentage
    const automatedTests = this.testResults.filter((t) => t.iterations !== undefined).length;
    const automated = totalTests > 0 ? (automatedTests / totalTests) * 100 : 0;
    const manual = 100 - automated;

    return {
      overall,
      byCategory,
      automated,
      manual,
    };
  }

  /**
   * Generate audit summary
   */
  private generateSummary(executionTime: number): AuditSummary {
    const totalCriteria = this.requirements.reduce(
      (sum, req) => sum + req.acceptanceCriteria.length,
      0
    );

    const passed = this.testResults.filter((t) => t.status === TestStatus.Passed).length;
    const failed = this.testResults.filter((t) => t.status === TestStatus.Failed).length;
    const skipped = this.testResults.filter((t) => t.status === TestStatus.Skipped).length;

    // Identify critical issues (failed tests)
    const criticalIssues = this.testResults
      .filter((t) => t.status === TestStatus.Failed)
      .map((t) => {
        const req = this.requirements.find((r) => r.id === t.requirementId);
        const criterion = req?.acceptanceCriteria.find((c) => c.id === t.criterionId);

        return {
          severity: 'high' as const,
          requirementId: t.requirementId,
          criterionId: t.criterionId,
          description: criterion?.description || 'Unknown criterion',
          recommendation: t.errorMessage || 'Review test failure details',
        };
      });

    return {
      totalRequirements: this.requirements.length,
      totalCriteria,
      totalTests: this.testResults.length,
      passedTests: passed,
      failedTests: failed,
      skippedTests: skipped,
      executionTime,
      criticalIssues,
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Generate recommendations based on audit results
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const score = this.calculateComplianceScore();

    if (score.overall < 80) {
      recommendations.push('Overall compliance score is below 80%. Review failed tests and address critical issues.');
    }

    // Check each category
    for (const [category, categoryScore] of Object.entries(score.byCategory)) {
      if (categoryScore.score < 70) {
        recommendations.push(`${category} compliance is low (${categoryScore.score.toFixed(1)}%). Focus on improving this area.`);
      }
    }

    if (score.automated < 80) {
      recommendations.push('Increase test automation coverage to reduce manual verification burden.');
    }

    return recommendations;
  }

  /**
   * Generate audit metadata
   */
  private generateMetadata(): AuditMetadata {
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      configuration: this.config,
      executor: 'Diia.AI Compliance Audit System',
    };
  }

  /**
   * Generate unique audit ID
   */
  private generateAuditId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current configuration
   */
  getConfiguration(): AuditConfiguration {
    return { ...this.config };
  }

  /**
   * Get loaded requirements
   */
  getRequirements(): Requirement[] {
    return [...this.requirements];
  }

  /**
   * Get test results
   */
  getTestResults(): TestResult[] {
    return [...this.testResults];
  }
}
