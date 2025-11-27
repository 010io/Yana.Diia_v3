/**
 * LEGO-Diia API Architecture - Core Types
 * 
 * Defines the structure for LEGO components that represent
 * government API services as building blocks.
 */

import { z } from 'zod';

/**
 * API Provider types
 */
export type APIProvider = 'diia' | 'openDataBot' | 'monobank' | 'portmone' | 'liqpay' | 'custom';

/**
 * Component categories
 */
export type ComponentCategory = 'auth' | 'data' | 'payment' | 'notification' | 'layout' | 'form';

/**
 * HTTP methods
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Data source for components
 */
export type DataSource = 'mock' | 'live' | 'cached';

/**
 * API Binding configuration
 */
export interface APIBinding {
  provider: APIProvider;
  endpoint: string;
  method: HTTPMethod;
  params: Record<string, string>;
  headers?: Record<string, string>;
  responseMapping: Record<string, string>;
  errorHandling?: ErrorHandling;
}

/**
 * Error handling configuration
 */
export interface ErrorHandling {
  retries: number;
  timeout: number;
  fallback?: any;
  onError?: (error: Error) => void;
}

/**
 * LEGO Component definition
 */
export interface LegoComponent {
  id: string;
  name: string;
  type?: string; // Component type for rendering
  category: ComponentCategory;
  apiEndpoint?: string;
  apiProvider: APIProvider;
  dataSchema: z.ZodSchema;
  metadata: ComponentMetadata;
  defaultConfig?: Record<string, any>;
  props?: Record<string, any>; // Component properties
}

/**
 * Component metadata
 */
export interface ComponentMetadata {
  icon: string;
  description: string;
  documentation: string;
  tags: string[];
  version: string;
  author?: string;
}

/**
 * Flow definition
 */
export interface FlowDefinition {
  id: string;
  name: string;
  description?: string;
  steps: FlowStep[];
  connections: Connection[];
  metadata: FlowMetadata;
  version: string;
}

/**
 * Flow step
 */
export interface FlowStep {
  id: string;
  componentId: string;
  position: Position;
  config: Record<string, any>;
  apiBinding?: APIBinding;
  dataSource: DataSource;
  status?: StepStatus;
}

/**
 * Step execution status
 */
export type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

/**
 * Position on canvas
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Connection between steps
 */
export interface Connection {
  id: string;
  from: string; // step id
  to: string;   // step id
  condition?: string; // optional condition for conditional flows
  dataMapping?: Record<string, string>; // map data from source to target
}

/**
 * Flow metadata
 */
export interface FlowMetadata {
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  category: string;
  estimatedDuration?: number; // in seconds
  complexity?: 'simple' | 'medium' | 'complex';
}

/**
 * Flow execution context
 */
export interface FlowExecutionContext {
  flowId: string;
  currentStep: string;
  data: Record<string, any>; // accumulated data from previous steps
  errors: FlowError[];
  startTime: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
}

/**
 * Flow execution error
 */
export interface FlowError {
  stepId: string;
  error: Error;
  timestamp: Date;
  recovered: boolean;
}

/**
 * API Response wrapper
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata: ResponseMetadata;
}

/**
 * API Error
 */
export interface APIError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  timestamp: Date;
  duration: number; // in milliseconds
  provider: APIProvider;
  cached: boolean;
}

/**
 * Export format types
 */
export type ExportFormat = 'jsx' | 'typescript' | 'json' | 'figma' | 'openapi';

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  includeComments: boolean;
  includeTypes: boolean;
  minify: boolean;
  target?: 'nextjs' | 'react' | 'vue' | 'angular';
}

/**
 * Export result
 */
export interface ExportResult {
  format: ExportFormat;
  content: string;
  filename: string;
  metadata: {
    flowId: string;
    exportedAt: Date;
    options: ExportOptions;
  };
}
