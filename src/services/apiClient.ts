import { Config } from '../config';
import { ExecutionContext } from '../executionContext';
import { RequestSpec } from '../models/requestSpec';
import { logger } from '../utils/logger';
import { ENV, HEADERS } from '../utils/constants';
import { headerUserAgent } from '../utils/userAgent';

export interface ApiClientConfig {
  [ENV.TENANT_ID]?: string;
  [ENV.ORGANIZATION_ID]?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private readonly config: Config;
  private readonly executionContext: ExecutionContext;
  private readonly clientConfig: ApiClientConfig;
  private defaultHeaders: Record<string, string> = {};

  constructor(config: Config, executionContext: ExecutionContext, clientConfig: ApiClientConfig = {}) {
    this.config = config;
    this.executionContext = executionContext;
    this.clientConfig = clientConfig;
  }

  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  private getDefaultHeaders(): Record<string, string> {
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${this.executionContext.getToken() || this.config.secret}`,
      'Content-Type': 'application/json',
      ...this.defaultHeaders
    };

    // Add tenant ID if available
    const tenantId = this.clientConfig[ENV.TENANT_ID];
    if (tenantId) {
      headers[HEADERS.TENANT_ID] = tenantId;
    }

    // Add organization ID if available
    const orgId = this.clientConfig[ENV.ORGANIZATION_ID];
    if (orgId) {
      headers[HEADERS.ORGANIZATION_UNIT_ID] = orgId;
    }

    // Add custom headers if available
    if (this.clientConfig.headers) {
      headers = { ...headers, ...this.clientConfig.headers };
    }

    return headers;
  }

  private async request<T>(method: string, path: string, options: RequestSpec = {}): Promise<T> {
    // Ensure path starts with a forward slash
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Construct URL with org and tenant names
    const url = new URL(
      `${this.config.orgName}/${this.config.tenantName}/${normalizedPath}`,
      this.config.baseUrl
    ).toString();

    const headers = {
      ...this.getDefaultHeaders(),
      ...options.headers
    };

    // Convert params to URLSearchParams
    const searchParams = new URLSearchParams();
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
    }
    const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

    const response = await fetch(fullUrl, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`HTTP ${response.status}: ${error.message}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    // Check if we're expecting XML
    const acceptHeader = headers['Accept'] || headers['accept'];
    if (acceptHeader === 'application/xml') {
      const text = await response.text();
      return text as T;
    }

    return response.json();
  }

  async get<T>(path: string, options: RequestSpec = {}): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T>(path: string, data?: unknown, options: RequestSpec = {}): Promise<T> {
    return this.request<T>('POST', path, { ...options, body: data });
  }

  async put<T>(path: string, data?: unknown, options: RequestSpec = {}): Promise<T> {
    return this.request<T>('PUT', path, { ...options, body: data });
  }

  async patch<T>(path: string, data?: unknown, options: RequestSpec = {}): Promise<T> {
    return this.request<T>('PATCH', path, { ...options, body: data });
  }

  async delete<T>(path: string, options: RequestSpec = {}): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }
}
