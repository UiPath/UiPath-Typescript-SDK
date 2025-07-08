import { Config, ConfigSchema } from './config';
import { ExecutionContext } from './executionContext';
import { ActionsService } from './services/actionsService';
import { AssetsService } from './services/assetsService';
import { BucketsService } from './services/bucketsService';
import { CaseService } from './services/caseService';
import { ConnectionsService } from './services/connectionsService';
import { ContextGroundingService } from './services/contextGroundingService';
import { DebugInstancesService } from './services/debugInstancesService';
import { EntityService } from './services/entityService';
import { FolderService } from './services/folderService';
import { JobsService } from './services/jobsService';
import { UiPathOpenAIService } from './services/llmGatewayService';
import { MaestroProcessesService } from './services/maestroProcessesService';
import { ProcessInstancesService } from './services/processInstancesService';
import { ProcessesService } from './services/processesService';
import { QueuesService } from './services/queuesService';
import { InsightsService } from './services/insightsService';
import { z } from 'zod';
import { AuthService } from './services/authService';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export class UiPath {
  private readonly config: Config;
  private readonly executionContext: ExecutionContext;
  private _authService?: AuthService;
  private _initialized: boolean = false;
  private _storage: Map<string, string> = new Map();

  public readonly actions: ActionsService;
  public readonly assets: AssetsService;
  public readonly buckets: BucketsService;
  public readonly cases: CaseService;
  public readonly connections: ConnectionsService;
  public readonly contextGrounding: ContextGroundingService;
  public readonly debugInstances: DebugInstancesService;
  public readonly entity: EntityService;
  public readonly folders: FolderService;
  public readonly jobs: JobsService;
  public readonly llmGateway: UiPathOpenAIService;
  public readonly maestroProcesses: MaestroProcessesService;
  public readonly processInstances: ProcessInstancesService;
  public readonly processes: ProcessesService;
  public readonly queues: QueuesService;
  public readonly insights: InsightsService;

  constructor(config: Config) {
    try {
      this.config = ConfigSchema.parse(config);
      if (!config.secret && (!config.clientId || !config.redirectUri)) {
        throw new Error('Either secret or both clientId and redirectUri must be provided');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (error.message.includes('secret')) {
          throw new Error('Secret is required and must not be empty');
        } else if (error.message.includes('orgName')) {
          throw new Error('Organization name is required and must not be empty');
        } else if (error.message.includes('tenantName')) {
          throw new Error('Tenant name is required and must not be empty');
        }
      }
      throw error;
    }

    this.executionContext = new ExecutionContext();

    // Initialize services
    const folderService = new FolderService(this.config, this.executionContext);
    const bucketsService = new BucketsService(this.config, this.executionContext);

    this.actions = new ActionsService(this.config, this.executionContext);
    this.assets = new AssetsService(this.config, this.executionContext);
    this.buckets = bucketsService;
    this.cases = new CaseService(this.config, this.executionContext);
    this.connections = new ConnectionsService(this.config, this.executionContext);
    this.contextGrounding = new ContextGroundingService(this.config, this.executionContext, folderService, bucketsService);
    this.debugInstances = new DebugInstancesService(this.config, this.executionContext);
    this.entity = new EntityService(this.config, this.executionContext);
    this.folders = folderService;
    this.jobs = new JobsService(this.config, this.executionContext);
    this.llmGateway = new UiPathOpenAIService(this.config, this.executionContext);
    this.maestroProcesses = new MaestroProcessesService(this.config, this.executionContext);
    this.processInstances = new ProcessInstancesService(this.config, this.executionContext);
    this.processes = new ProcessesService(this.config, this.executionContext);
    this.queues = new QueuesService(this.config, this.executionContext);
    this.insights = new InsightsService(this.config, this.executionContext);
  }

  /**
   * Initializes the SDK and handles authentication
   * This must be called before making any API calls
   */
  async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }

    // If we already have a secret/token, we're good to go
    if (this.config.secret) {
      this._initialized = true;
      return;
    }

    // If we have clientId and redirectUri, handle OAuth flow
    if (this.config.clientId && this.config.redirectUri) {
      this._authService = new AuthService(this.config, this.executionContext);
      await this._handleOAuthFlow();
    } else {
      throw new Error('Either secret or both clientId and redirectUri must be provided');
    }

    this._initialized = true;
  }

  private _setStorageItem(key: string, value: string): void {
    try {
      if (isBrowser) {
        window.sessionStorage.setItem(key, value);
        // Also try localStorage as backup
        try {
          window.localStorage.setItem(key + '_backup', value);
        } catch (e) {
          console.warn('Failed to set localStorage backup:', e);
        }
      } else {
        this._storage.set(key, value);
      }
    } catch (e) {
      console.error('Failed to set storage:', e);
      throw new Error('Failed to store OAuth state. Please ensure cookies and storage are enabled.');
    }
  }

  private _getStorageItem(key: string): string | null {
    try {
      if (isBrowser) {
        // Try sessionStorage first
        const value = window.sessionStorage.getItem(key);
        if (value) return value;

        // Try localStorage backup
        const backupValue = window.localStorage.getItem(key + '_backup');
        if (backupValue) {
          // Restore to sessionStorage if possible
          try {
            window.sessionStorage.setItem(key, backupValue);
          } catch (e) {
            console.warn('Failed to restore to sessionStorage:', e);
          }
          return backupValue;
        }
        return null;
      }
      return this._storage.get(key) || null;
    } catch (e) {
      console.error('Failed to get storage:', e);
      return null;
    }
  }

  private _removeStorageItem(key: string): void {
    try {
      if (isBrowser) {
        window.sessionStorage.removeItem(key);
        window.localStorage.removeItem(key + '_backup');
      } else {
        this._storage.delete(key);
      }
    } catch (e) {
      console.error('Failed to remove storage:', e);
    }
  }

  private async _handleOAuthFlow(): Promise<void> {
    if (!this._authService || !this.config.clientId || !this.config.redirectUri) {
      throw new Error('OAuth flow is not configured properly');
    }

    // In browser environment, check if we're in the callback first
    if (isBrowser) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const returnedState = urlParams.get('state');

      if (code && returnedState) {
        // We're in the callback
        const savedState = this._getStorageItem('uipath_state');
        const savedCodeVerifier = this._getStorageItem('uipath_code_verifier');

        console.log('OAuth Debug:', {
          returnedState,
          savedState,
          hasCodeVerifier: !!savedCodeVerifier,
          storage: {
            session: Object.keys(window.sessionStorage),
            local: Object.keys(window.localStorage)
          }
        });

        if (!savedState || !savedCodeVerifier) {
          // If we lost our state/verifier, we need to start over
          console.warn('OAuth state or verifier lost, restarting flow');
          this._removeStorageItem('uipath_state');
          this._removeStorageItem('uipath_code_verifier');
          window.location.href = window.location.pathname;
          throw new Error('Restarting OAuth flow due to lost state');
        }

        // Verify state
        if (savedState !== returnedState) {
          console.error('State mismatch:', { savedState, returnedState });
          // Clear storage and restart
          this._removeStorageItem('uipath_state');
          this._removeStorageItem('uipath_code_verifier');
          window.location.href = window.location.pathname;
          throw new Error('Invalid state parameter, restarting flow');
        }

        // Exchange code for token
        const token = await this._authService.getAccessToken({
          clientId: this.config.clientId,
          redirectUri: this.config.redirectUri,
          code,
          codeVerifier: savedCodeVerifier
        });
        console.log('Token:', token);
        // Clean up storage
        this._removeStorageItem('uipath_code_verifier');
        this._removeStorageItem('uipath_state');

        // Update config and context with the new token
        this.config.secret = token.access_token;
        console.log('Config:', this.config);
        this.executionContext.updateToken(token.access_token);
        console.log('ExecutionContext:', this.executionContext);
        console.log('token later:', this.executionContext.getToken());

        // Remove code and state from URL without refreshing the page
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
        return;
      }
    }

    // Not in callback or not in browser, start new flow
    const codeVerifier = this._authService.generateCodeVerifier();
    const codeChallenge = await this._authService.generateCodeChallenge(codeVerifier);
    const state = this._authService.generateCodeVerifier().slice(0, 16);

    // Store PKCE parameters before anything else
    this._setStorageItem('uipath_code_verifier', codeVerifier);
    this._setStorageItem('uipath_state', state);

    // Verify storage worked
    const storedState = this._getStorageItem('uipath_state');
    const storedVerifier = this._getStorageItem('uipath_code_verifier');
    
    if (!storedState || !storedVerifier || storedState !== state) {
      throw new Error('Failed to store OAuth state. Please ensure cookies and storage are enabled.');
    }

    // Get the authorization URL
    const authUrl = this._authService.getAuthorizationUrl({
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      codeChallenge,
      state
    });

    if (!isBrowser) {
      // In Node.js, we can't handle the redirect flow automatically
      throw new Error(`Please complete the OAuth flow by:
1. Visit this URL in a browser: ${authUrl}
2. After authorization, you'll be redirected to your redirect URI with a code parameter
3. Use that code to get an access token
4. Initialize the SDK with the access token`);
    }

    // Store current URL to return to after auth
    this._setStorageItem('uipath_return_url', window.location.href);
    
    // Redirect to auth URL
    window.location.href = authUrl;
    throw new Error('Redirecting to authentication...');
  }
}
