// Re-export types from the SDK for easier use
export type { 
  ProcessSummary, 
  GetAllProcessesSummaryResponse,
  ProcessSettings 
} from 'uipath-typescript-sdk';

// Additional types for our application
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface ProcessCardData {
  processKey: string;
  packageId: string;
  folderKey: string;
  folderName: string;
  packageVersions: string[];
  versionCount: number;
  pendingCount: number;
  runningCount: number;
  completedCount: number;
  pausedCount: number;
  cancelledCount: number;
  faultedCount: number;
  retryingCount: number;
  resumingCount: number;
  pausingCount: number;
  cancelingCount: number;
}