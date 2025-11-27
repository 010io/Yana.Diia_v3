/**
 * LEGO API Provider System
 * 
 * Abstraction layer for all government and third-party API services.
 * Each provider implements a standard interface for data fetching.
 */

export interface APIProvider {
  name: string;
  baseUrl: string;
  authenticate(): Promise<void>;
  request<T>(endpoint: string, options?: RequestOptions): Promise<APIResponse<T>>;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: {
    timestamp: Date;
    requestId: string;
    cached: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Base API Provider implementation
 */
export abstract class BaseAPIProvider implements APIProvider {
  abstract name: string;
  abstract baseUrl: string;
  
  protected token?: string;
  protected cache: Map<string, any> = new Map();

  async authenticate(): Promise<void> {
    // Override in subclasses if authentication is needed
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const { method = 'GET', params, body, headers = {} } = options;

    // Check cache for GET requests
    const cacheKey = `${method}:${endpoint}:${JSON.stringify(params)}`;
    if (method === 'GET' && this.cache.has(cacheKey)) {
      return {
        success: true,
        data: this.cache.get(cacheKey),
        metadata: {
          timestamp: new Date(),
          requestId: this.generateRequestId(),
          cached: true,
        },
      };
    }

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET requests
      if (method === 'GET') {
        this.cache.set(cacheKey, data);
      }

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date(),
          requestId: this.generateRequestId(),
          cached: false,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      };
    }
  }

  protected buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  protected getAuthHeaders(): Record<string, string> {
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` };
    }
    return {};
  }

  protected generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Diia API Provider
 */
export class DiiaAPIProvider extends BaseAPIProvider {
  name = 'Diia';
  baseUrl = 'https://api.diia.gov.ua';

  async authenticate(): Promise<void> {
    // In production, implement OAuth flow
    // For now, use mock token
    this.token = process.env.DIIA_API_TOKEN || 'mock_diia_token';
  }

  async getDocuments(userId: string) {
    return this.request('/api/v1/documents', {
      params: { userId },
    });
  }

  async signDocument(documentHash: string) {
    return this.request('/api/v1/auth/signature', {
      method: 'POST',
      body: { documentHash },
    });
  }

  async verifyIdentity(token: string) {
    return this.request('/api/v1/verify', {
      params: { token },
    });
  }
}

/**
 * OpenDataBot API Provider
 */
export class OpenDataBotAPIProvider extends BaseAPIProvider {
  name = 'OpenDataBot';
  baseUrl = 'https://opendatabot.ua/api/v3';

  async authenticate(): Promise<void> {
    this.token = process.env.OPENDATABOT_API_TOKEN || 'mock_opendatabot_token';
  }

  async searchCompany(edrpou: string) {
    return this.request('/company', {
      params: { code: edrpou },
    });
  }

  async getCarInfo(licensePlate: string) {
    return this.request('/edrfo', {
      params: { number: licensePlate },
    });
  }

  async getCourtCases(query: string) {
    return this.request('/court', {
      params: { q: query },
    });
  }
}

/**
 * Monobank API Provider
 */
export class MonobankAPIProvider extends BaseAPIProvider {
  name = 'Monobank';
  baseUrl = 'https://api.monobank.ua';

  async authenticate(): Promise<void> {
    this.token = process.env.MONOBANK_API_TOKEN || 'mock_monobank_token';
  }

  async createInvoice(amount: number, description: string) {
    return this.request('/api/merchant/invoice/create', {
      method: 'POST',
      body: { amount, description },
    });
  }

  async getInvoiceStatus(invoiceId: string) {
    return this.request(`/api/merchant/invoice/status`, {
      params: { invoiceId },
    });
  }
}

/**
 * API Provider Registry
 */
export class APIProviderRegistry {
  private providers: Map<string, APIProvider> = new Map();

  register(provider: APIProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  get(name: string): APIProvider | undefined {
    return this.providers.get(name.toLowerCase());
  }

  getAll(): APIProvider[] {
    return Array.from(this.providers.values());
  }

  async authenticateAll(): Promise<void> {
    await Promise.all(
      Array.from(this.providers.values()).map((p) => p.authenticate())
    );
  }
}

// Global registry instance
export const apiRegistry = new APIProviderRegistry();

// Register default providers
apiRegistry.register(new DiiaAPIProvider());
apiRegistry.register(new OpenDataBotAPIProvider());
apiRegistry.register(new MonobankAPIProvider());
