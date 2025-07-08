import { ProblemDetails } from './errors';

export interface ProcessInput {
  name: string;
  value: unknown;
}

export interface ProcessVariable extends ProcessInput {
  type: string;
  isInput?: boolean;
  isOutput?: boolean;
}

export interface DebugInstancesCreateRequest {
  processKey: string;
  processVersion?: string;
  inputs?: ProcessInput[];
  jobPriority?: number;
  startInfo?: {
    strategy?: 'All' | 'Specific';
    targetNames?: string[];
    noOfRobots?: number;
  };
}

export interface DebugInstancesCreateOut {
  instanceId: string;
  status: string;
  startTime: string;
  processKey: string;
  processVersion: string;
}

export interface InstanceCancelRequest {
  reason?: string;
  force?: boolean;
}

export interface InstancesStatusResponse {
  instanceId: string;
  status: string;
  startTime: string;
  endTime?: string;
  processKey: string;
  processVersion: string;
}

export interface DebugInstanceContinueRequestIn {
  continueOption: 'Continue' | 'StepOver' | 'StepInto' | 'StepOut';
}

export interface ElementExecution {
  id: string;
  name: string;
  state: 'NotStarted' | 'Running' | 'Completed' | 'Failed' | 'Canceled' | 'Paused';
  startTime: string;
  endTime?: string;
  type: string;
  children?: ElementExecution[];
  error?: {
    message: string;
    details?: string;
  };
}

export interface GetInstanceRunResponse {
  instanceId: string;
  status: string;
  startTime: string;
  endTime?: string;
  processKey: string;
  processVersion: string;
  elements: ElementExecution[];
}

export interface IncidentResponse {
  id: string;
  instanceId: string;
  elementId: string;
  message: string;
  details?: string;
  timestamp: string;
  type: 'Error' | 'Warning' | 'Information';
}

export interface GetVariablesResponse {
  elementId: string;
  variables: ProcessVariable[];
}

export interface PatchVariablesRequest {
  variables: ProcessInput[];
} 