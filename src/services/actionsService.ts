import { Config } from '../config';
import { ExecutionContext } from '../executionContext';
import { BaseService } from './baseService';
import { Action, ActionSchema } from '../models/action';
import { v4 as uuidv4 } from 'uuid';
import { RequestSpec } from '../models/requestSpec';
import { FolderContext } from '../folderContext';
import { headerFolder } from '../utils/headers';
import { ENV, HEADERS } from '../utils/constants';

interface FolderOptions {
  appFolderKey?: string;
  appFolderPath?: string;
}

/**
 * Service for managing UiPath Actions.
 * 
 * Actions are task-based automation components that can be integrated into
 * applications and processes. They represent discrete units of work that can
 * be triggered and monitored through the UiPath API.
 * 
 * @see {@link https://docs.uipath.com/automation-cloud/docs/actions|Actions Documentation}
 */
export class ActionsService extends BaseService {
  private readonly folderContext: FolderContext;

  constructor(config: Config, executionContext: ExecutionContext) {
    super(config, executionContext);
    this.folderContext = new FolderContext(config, executionContext);
  }

  /**
   * Creates a new action
   */
  async create(action: Action): Promise<Action> {
    const response = await this.post<Action>('/actions', action);
    return response.data;
  }

  /**
   * Updates an existing action
   */
  async update(id: string, action: Action): Promise<Action> {
    const response = await this.put<Action>(`/actions/${id}`, action);
    return response.data;
  }

  /**
   * Retrieves an action by ID
   */
  async retrieve(id: string): Promise<Action> {
    const response = await this.get<Action>(`/actions/${id}`);
    return response.data;
  }

  /**
   * Deletes an action by ID
   */
  async deleteAction(id: string): Promise<void> {
    await this.delete<void>(`/actions/${id}`);
  }

  /**
   * Lists all actions
   */
  async list(): Promise<Action[]> {
    const response = await this.get<Action[]>('/actions');
    return response.data;
  }

  /**
   * Creates a new action from a schema
   */
  async createFromSchema(
    appName: string,
    appFolderPath: string,
    actionName: string,
    actionSchema: any
  ): Promise<Action> {
    const spec = this.getCreateFromSchemaSpec(
      appName,
      appFolderPath,
      actionName,
      actionSchema
    );

    const response = await this.requestWithSpec<Action>(spec);
    return response.data;
  }

  /**
   * Retrieves the schema for an action app
   */
  async retrieveAppSchema(appName: string, appFolderPath: string): Promise<any> {
    const spec = this.retrieveAppKeySpec(appName);
    const response = await this.request<{
      deployed: {
        actionSchema: any;
        systemName: string;
        deploymentFolder: {
          fullyQualifiedName: string;
          key: string;
        };
      }[];
    }>(spec.method!, spec.url!, {
      headers: spec.headers,
      params: spec.params
    });

    const deployedApp = this.extractDeployedApp(response.data.deployed, appFolderPath);
    return deployedApp.actionSchema;
  }

  private getCreateFromSchemaSpec(
    appName: string,
    appFolderPath: string,
    actionName: string,
    actionSchema: any
  ): RequestSpec {
    const tenantId = process.env[ENV.TENANT_ID];
    if (!tenantId) {
      throw new Error(`${ENV.TENANT_ID} env var is not set`);
    }

    return {
      method: 'POST',
      url: '/apps_/default/api/v1/default/deployed-action-apps-schemas/actions',
      data: {
        name: actionName,
        schema: actionSchema
      },
      headers: { [HEADERS.TENANT_ID]: tenantId }
    };
  }

  private retrieveAppKeySpec(appName: string): RequestSpec {
    const tenantId = process.env[ENV.TENANT_ID];
    if (!tenantId) {
      throw new Error(`${ENV.TENANT_ID} env var is not set`);
    }

    return {
      method: 'GET',
      url: '/apps_/default/api/v1/default/deployed-action-apps-schemas',
      params: { search: appName },
      headers: { [HEADERS.TENANT_ID]: tenantId }
    };
  }

  private extractDeployedApp(
    deployed: {
      actionSchema: any;
      systemName: string;
      deploymentFolder: {
        fullyQualifiedName: string;
        key: string;
      };
    }[],
    appFolderPath: string
  ) {
    const deployedApp = deployed.find(
      app => app.deploymentFolder.fullyQualifiedName === appFolderPath
    );

    if (!deployedApp) {
      throw new Error(
        `No deployed app found in folder ${appFolderPath}`
      );
    }

    return deployedApp;
  }
} 