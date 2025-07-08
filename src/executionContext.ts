import { ENV } from './utils/constants';

export interface ExecutionContextConfig {
  [ENV.JOB_KEY]?: string;
  [ENV.JOB_ID]?: string;
  [ENV.ROBOT_KEY]?: string;
  // Add any configuration options here
}

export class ExecutionContext {
  private _instanceKey: string | null;
  private _instanceId: string | null;
  private _robotKey: string | null;
  private config: ExecutionContextConfig;
  private token?: string;

  constructor(config: ExecutionContextConfig = {}) {
    this._instanceKey = config[ENV.JOB_KEY] ?? null;
    this._instanceId = config[ENV.JOB_ID] ?? null;
    this._robotKey = config[ENV.ROBOT_KEY] ?? null;
    this.config = config;
  }

  get instanceId(): string | null {
    return this._instanceId;
  }

  get instanceKey(): string | null {
    return this._instanceKey;
  }

  get robotKey(): string | null {
    return this._robotKey;
  }

  /**
   * Updates the access token used for API requests
   * @param token The new access token
   */
  updateToken(token: string): void {
    this.token = token;
  }

  /**
   * Gets the current access token
   * @returns The current access token or undefined if not set
   */
  getToken(): string | undefined {
    return this.token;
  }
}
