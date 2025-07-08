/**
 * UiPath TypeScript SDK
 * 
 * A TypeScript SDK that enables programmatic interaction with UiPath Cloud Platform services
 * including processes, assets, buckets, context grounding, data services, jobs, and more.
 */

// Export core functionality
export { UiPath } from './uipath';
export type { Config } from './config';

// Process Instance Models
export {
  // Schemas for validation
  SpanSchema,
  SourceEnum,
  StatusEnum,
  InstanceCancelRequestSchema,
  InstancePauseRequestSchema,
  InstanceResumeRequestSchema,
  InstancesStatusResponseSchema,
  GetInstanceResponseSchema,
  GetAllInstancesResponseSchema,
} from './models/processInstance';

// Process Instance Types
export type {
  Source,
  Status,
  Span,
  InstanceCancelRequest,
  InstancePauseRequest,
  InstanceResumeRequest,
  InstancesStatusResponse,
  GetInstanceResponse,
  GetAllInstancesResponse,
  PaginationParams,
  GetInstancesQueryParams
} from './models/processInstance';

// Insights Models and Types
export {
  // Schemas
  TimeSliceUnitEnum,
  CommonParamsSchema,
  ProcessInstanceStatusByDateRequestSchema,
  ProcessInstanceStatusByDateItemSchema,
  ProcessInstanceStatusByDateResponseSchema,
} from './models/insights';

export type {
  // Types
  TimeSliceUnit,
  CommonParams,
  ProcessInstanceStatusByDateRequest,
  ProcessInstanceStatusByDateItem,
  ProcessInstanceStatusByDateResponse
} from './models/insights';

// Export services
export { ActionsService } from './services/actionsService';
export { AssetsService } from './services/assetsService';
export { BucketsService } from './services/bucketsService';
export { ConnectionsService } from './services/connectionsService';
export { ContextGroundingService } from './services/contextGroundingService';
export { DebugInstancesService } from './services/debugInstancesService';
export { EntityService } from './services/entityService';
export { FolderService } from './services/folderService';
export { JobsService } from './services/jobsService';
export { ProcessesService } from './services/processesService';
export { QueuesService } from './services/queuesService';

// Export models
export type {
  DebugInstancesCreateRequest,
  DebugInstancesCreateOut,
  DebugInstanceContinueRequestIn,
  ElementExecution,
  GetInstanceRunResponse,
  IncidentResponse,
  GetVariablesResponse,
  PatchVariablesRequest
} from './models/debugInstance';

export type { RequestSpec } from './models/requestSpec';

// Export constants
export { ENV, HEADERS, DATA_SOURCES, ENDPOINTS } from './utils/constants';

// Export LLM Gateway Service and models
export { UiPathOpenAIService, ChatModels, EmbeddingModels } from './services/llmGatewayService';
export type { UsageInfo, TextEmbedding, ChatCompletion } from './services/llmGatewayService';

// Export sync infrastructure
export * from './sync/SyncManager';
export * from './sync/EntitySyncHandler';
