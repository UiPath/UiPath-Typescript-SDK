import { BaseService } from './baseService';
import { Config } from '../config';
import { ExecutionContext } from '../executionContext';
import { 
  ProcessInstanceStatusByDateRequest,
  ProcessInstanceStatusByDateResponse,
  TimeSliceUnit
} from '../models/insights';

export class InsightsService extends BaseService {
  constructor(config: Config, executionContext: ExecutionContext) {
    super(config, executionContext);
  }

  /**
   * Get process instance status counts grouped by date
   * @param startTime Start time in milliseconds since epoch
   * @param endTime End time in milliseconds since epoch
   * @param timeSliceUnit Time unit for grouping (DAY, HOUR, MINUTE)
   * @param timezoneOffset Timezone offset in minutes
   * @param tenantId Tenant ID
   * @returns Promise<ProcessInstanceStatusByDateResponse>
   */
  async getProcessInstanceStatusByDate(
    startTime: number,
    endTime: number,
    timeSliceUnit: TimeSliceUnit = 'DAY',
    timezoneOffset: number = new Date().getTimezoneOffset(),
    tenantId?: string
  ): Promise<ProcessInstanceStatusByDateResponse> {
    const request: ProcessInstanceStatusByDateRequest = {
      commonParams: {
        startTime,
        endTime
      },
      timeSliceUnit,
      timezoneOffset,
      tenantId: tenantId || this.config.tenantId || ''
    };

    const response = await this.post<ProcessInstanceStatusByDateResponse>(
      'insightsrtm_/agenticInstanceStatus/uipathlabs/Playground/bd829329-42ff-40aa-96dc-95a78168275a/InstanceStatusByDate',
      request
    );
    return response.data;
  }
} 