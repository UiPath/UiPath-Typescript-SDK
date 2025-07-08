import { Config } from '../config';
import { ExecutionContext } from '../executionContext';
import { BaseService } from './baseService';
import {
  DebugInstancesCreateRequest,
  DebugInstancesCreateOut,
  InstanceCancelRequest,
  InstancesStatusResponse,
  DebugInstanceContinueRequestIn,
  GetInstanceRunResponse,
  IncidentResponse,
  GetVariablesResponse,
  PatchVariablesRequest,
  ElementExecution
} from '../models/debugInstance';

export class DebugInstancesService extends BaseService {
  private static readonly BASE_PATH = '/v1/debug-instances';

  constructor(config: Config, executionContext: ExecutionContext) {
    super(config, executionContext);
    this.apiClient.setDefaultHeaders({
      'x-uipath-internal-accountid': config.accountId || '',
      'x-uipath-internal-tenantid': config.tenantId || '',
      'x-uipath-folderkey': config.folderKey || ''
    });
  }

  /**
   * Creates a new debug instance
   */
  async createDebugInstances(request: DebugInstancesCreateRequest): Promise<DebugInstancesCreateOut> {
    const response = await this.post<DebugInstancesCreateOut>(DebugInstancesService.BASE_PATH, request);
    return response.data;
  }

  /**
   * Cancels a debug instance
   */
  async cancelDebugInstance(instanceId: string, request: InstanceCancelRequest): Promise<InstancesStatusResponse> {
    const response = await this.post<InstancesStatusResponse>(`${DebugInstancesService.BASE_PATH}/${instanceId}/cancel`, request);
    return response.data;
  }

  /**
   * Continues a debug instance
   */
  async continueDebugInstance(instanceId: string, request: DebugInstanceContinueRequestIn): Promise<void> {
    await this.post<void>(`${DebugInstancesService.BASE_PATH}/${instanceId}/continue`, request);
  }

  /**
   * Gets element executions for a debug instance
   */
  async getDebugInstanceElementExecutions(instanceId: string): Promise<GetInstanceRunResponse> {
    const response = await this.get<GetInstanceRunResponse>(`${DebugInstancesService.BASE_PATH}/${instanceId}/element-executions`);
    return response.data;
  }

  /**
   * Gets incidents for a debug instance
   */
  async getIncidentsByInstanceId(instanceId: string): Promise<IncidentResponse[]> {
    const response = await this.get<IncidentResponse[]>(`${DebugInstancesService.BASE_PATH}/${instanceId}/incidents`);
    return response.data;
  }

  /**
   * Gets variables for a debug instance
   */
  async getDebugVariables(instanceId: string, parentElementId?: string): Promise<GetVariablesResponse> {
    const url = `${DebugInstancesService.BASE_PATH}/${instanceId}/variables`;
    const params = parentElementId ? { parentElementId } : undefined;
    const response = await this.get<GetVariablesResponse>(url, { params });
    return response.data;
  }

  /**
   * Updates variables for a debug instance
   */
  async updateDebugVariables(instanceId: string, request: PatchVariablesRequest, parentElementId?: string): Promise<void> {
    const url = `${DebugInstancesService.BASE_PATH}/${instanceId}/variables`;
    const params = parentElementId ? { parentElementId } : undefined;
    await this.patch<void>(url, request, { params });
  }

  /**
   * Helper method to find an element in the execution tree
   */
  static findElement(elements: ElementExecution[], predicate: (element: ElementExecution) => boolean): ElementExecution | undefined {
    for (const element of elements) {
      if (predicate(element)) {
        return element;
      }
      if (element.children) {
        const found = this.findElement(element.children, predicate);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  /**
   * Helper method to wait for a specific state
   */
  async waitForState(
    instanceId: string,
    targetStates: string[],
    timeoutMs: number = 30000,
    pollIntervalMs: number = 1000
  ): Promise<GetInstanceRunResponse> {
    const startTime = Date.now();
    while (true) {
      const status = await this.getDebugInstanceElementExecutions(instanceId);
      if (targetStates.includes(status.status)) {
        return status;
      }
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Timeout waiting for states: ${targetStates.join(', ')}`);
      }
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }
  }
} 