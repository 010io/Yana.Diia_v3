/**
 * LEGO Flow Engine
 * 
 * Executes flows by orchestrating API calls between components
 * and managing data flow between steps.
 */

import { apiRegistry, APIResponse } from './api-provider';
import { componentRegistry } from './component-registry';

export interface FlowDefinition {
  id: string;
  name: string;
  description?: string;
  steps: FlowStep[];
  connections: FlowConnection[];
  metadata?: FlowMetadata;
}

export interface FlowStep {
  id: string;
  componentId: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  apiBinding?: APIBinding;
}

export interface APIBinding {
  provider: string;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string>;
  body?: Record<string, any>;
  responseMapping?: Record<string, string>;
}

export interface FlowConnection {
  id: string;
  from: string; // step id
  to: string; // step id
  dataMapping?: Record<string, string>; // from field -> to field
}

export interface FlowMetadata {
  author?: string;
  version?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FlowExecutionContext {
  flowId: string;
  stepResults: Map<string, any>;
  currentStep?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  error?: Error;
}

export interface FlowExecutionResult {
  success: boolean;
  flowId: string;
  results: Record<string, any>;
  executionTime: number;
  error?: Error;
}

/**
 * Flow Engine - Executes LEGO flows
 */
export class FlowEngine {
  private context: FlowExecutionContext;

  constructor(private flow: FlowDefinition) {
    this.context = {
      flowId: flow.id,
      stepResults: new Map(),
      status: 'idle',
    };
  }

  /**
   * Execute the entire flow
   */
  async execute(): Promise<FlowExecutionResult> {
    const startTime = Date.now();
    this.context.status = 'running';

    try {
      // Build execution order based on connections
      const executionOrder = this.buildExecutionOrder();

      // Execute steps in order
      for (const stepId of executionOrder) {
        const step = this.flow.steps.find((s) => s.id === stepId);
        if (!step) continue;

        this.context.currentStep = stepId;
        const result = await this.executeStep(step);
        this.context.stepResults.set(stepId, result);
      }

      this.context.status = 'completed';

      return {
        success: true,
        flowId: this.flow.id,
        results: Object.fromEntries(this.context.stepResults),
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      this.context.status = 'error';
      this.context.error = error as Error;

      return {
        success: false,
        flowId: this.flow.id,
        results: Object.fromEntries(this.context.stepResults),
        executionTime: Date.now() - startTime,
        error: error as Error,
      };
    }
  }

  /**
   * Execute a single step
   */
  private async executeStep(step: FlowStep): Promise<any> {
    const component = componentRegistry.get(step.componentId);
    if (!component) {
      throw new Error(`Component not found: ${step.componentId}`);
    }

    // If step has API binding, execute API call
    if (step.apiBinding) {
      return await this.executeAPICall(step);
    }

    // Otherwise, just return the config (for UI components)
    return this.resolveVariables(step.config);
  }

  /**
   * Execute API call for a step
   */
  private async executeAPICall(step: FlowStep): Promise<any> {
    const { apiBinding } = step;
    if (!apiBinding) return null;

    const provider = apiRegistry.get(apiBinding.provider);
    if (!provider) {
      throw new Error(`API provider not found: ${apiBinding.provider}`);
    }

    // Resolve variables in params and body
    const params = this.resolveVariables(apiBinding.params || {});
    const body = this.resolveVariables(apiBinding.body || {});

    // Make API request
    const response = await provider.request(apiBinding.endpoint, {
      method: apiBinding.method || 'GET',
      params,
      body,
    });

    if (!response.success) {
      throw new Error(
        `API call failed: ${response.error?.message || 'Unknown error'}`
      );
    }

    // Apply response mapping if defined
    if (apiBinding.responseMapping) {
      return this.applyResponseMapping(response.data, apiBinding.responseMapping);
    }

    return response.data;
  }

  /**
   * Resolve variables in format {{stepId.field}}
   */
  private resolveVariables(obj: any): any {
    if (typeof obj === 'string') {
      return this.resolveString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.resolveVariables(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const resolved: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = this.resolveVariables(value);
      }
      return resolved;
    }

    return obj;
  }

  /**
   * Resolve variables in a string
   */
  private resolveString(str: string): any {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    let match;
    let result = str;

    while ((match = variableRegex.exec(str)) !== null) {
      const variable = match[1].trim();
      const value = this.getVariableValue(variable);
      result = result.replace(match[0], String(value));
    }

    // If the entire string was a variable, return the actual value
    if (str.match(/^\{\{[^}]+\}\}$/)) {
      return this.getVariableValue(str.slice(2, -2).trim());
    }

    return result;
  }

  /**
   * Get value of a variable (stepId.field)
   */
  private getVariableValue(variable: string): any {
    const [stepId, ...fieldPath] = variable.split('.');
    const stepResult = this.context.stepResults.get(stepId);

    if (!stepResult) {
      console.warn(`Step result not found: ${stepId}`);
      return undefined;
    }

    // Navigate through nested fields
    let value = stepResult;
    for (const field of fieldPath) {
      value = value?.[field];
    }

    return value;
  }

  /**
   * Apply response mapping to transform API response
   */
  private applyResponseMapping(
    data: any,
    mapping: Record<string, string>
  ): any {
    const mapped: any = {};

    for (const [targetField, sourceField] of Object.entries(mapping)) {
      const value = this.getNestedValue(data, sourceField);
      this.setNestedValue(mapped, targetField, value);
    }

    return mapped;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested value in object using dot notation
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Build execution order based on connections
   */
  private buildExecutionOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (stepId: string) => {
      if (visited.has(stepId)) return;
      if (visiting.has(stepId)) {
        throw new Error(`Circular dependency detected at step: ${stepId}`);
      }

      visiting.add(stepId);

      // Find all steps that this step depends on
      const dependencies = this.flow.connections
        .filter((conn) => conn.to === stepId)
        .map((conn) => conn.from);

      // Visit dependencies first
      for (const depId of dependencies) {
        visit(depId);
      }

      visiting.delete(stepId);
      visited.add(stepId);
      order.push(stepId);
    };

    // Visit all steps
    for (const step of this.flow.steps) {
      visit(step.id);
    }

    return order;
  }

  /**
   * Get current execution context
   */
  getContext(): FlowExecutionContext {
    return { ...this.context };
  }

  /**
   * Get result of a specific step
   */
  getStepResult(stepId: string): any {
    return this.context.stepResults.get(stepId);
  }
}

/**
 * Flow Builder - Helper for creating flows programmatically
 */
export class FlowBuilder {
  private flow: FlowDefinition;

  constructor(name: string, description?: string) {
    this.flow = {
      id: `flow_${Date.now()}`,
      name,
      description,
      steps: [],
      connections: [],
    };
  }

  addStep(
    componentId: string,
    config: Record<string, any>,
    position?: { x: number; y: number },
    apiBinding?: APIBinding
  ): string {
    const stepId = `step_${this.flow.steps.length + 1}`;
    this.flow.steps.push({
      id: stepId,
      componentId,
      position: position || { x: 0, y: 0 },
      config,
      apiBinding,
    });
    return stepId;
  }

  connect(
    from: string,
    to: string,
    dataMapping?: Record<string, string>
  ): void {
    this.flow.connections.push({
      id: `conn_${this.flow.connections.length + 1}`,
      from,
      to,
      dataMapping,
    });
  }

  setMetadata(metadata: FlowMetadata): void {
    this.flow.metadata = metadata;
  }

  build(): FlowDefinition {
    return this.flow;
  }
}
