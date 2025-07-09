import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { ErrorMessage } from '../components/UI/ErrorMessage';
import { uiPathClient } from '../lib/uipath';
import { cn, getStatusBadgeClass } from '../lib/utils';
import { 
  CogIcon, 
  FolderIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PauseIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Import the actual types from the SDK
type ProcessSummary = {
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
};

type GetAllProcessesSummaryResponse = {
  processes: ProcessSummary[];
};

export const Processes: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: GetAllProcessesSummaryResponse = await uiPathClient.maestroProcesses.getSummary();
      setProcesses(response.processes || []);
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch processes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const getProcessStatusSummary = (process: ProcessSummary) => {
    const total = process.runningCount + process.completedCount + process.faultedCount + 
                 process.pausedCount + process.pendingCount + process.cancelledCount + 
                 process.retryingCount + process.resumingCount + process.pausingCount + 
                 process.cancelingCount;
    
    if (process.runningCount > 0) return { status: 'Running', color: 'yellow' };
    if (process.faultedCount > 0) return { status: 'Has Faults', color: 'red' };
    if (process.pausedCount > 0) return { status: 'Paused', color: 'blue' };
    if (process.completedCount > 0) return { status: 'Completed', color: 'green' };
    if (total === 0) return { status: 'No Instances', color: 'gray' };
    return { status: 'Idle', color: 'gray' };
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error} onRetry={fetchProcesses} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maestro Processes</h1>
            <p className="mt-2 text-gray-600">
              Manage and monitor your UiPath Maestro process definitions
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {processes.length} process{processes.length !== 1 ? 'es' : ''} found
          </div>
        </div>

        {/* Processes Grid */}
        {processes.length === 0 ? (
          <div className="card p-12 text-center">
            <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No processes found</h3>
            <p className="text-gray-600">
              There are no Maestro processes available in your tenant.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processes.map((process) => {
              const statusInfo = getProcessStatusSummary(process);
              const totalInstances = process.runningCount + process.completedCount + 
                                   process.faultedCount + process.pausedCount + 
                                   process.pendingCount + process.cancelledCount + 
                                   process.retryingCount + process.resumingCount + 
                                   process.pausingCount + process.cancelingCount;

              return (
                <div key={process.processKey} className="card p-6 hover:shadow-md transition-shadow">
                  {/* Process Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-uipath-50 rounded-lg">
                        <CogIcon className="w-6 h-6 text-uipath-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {process.packageId}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <FolderIcon className="w-4 h-4" />
                          <span>{process.folderName}</span>
                        </div>
                      </div>
                    </div>
                    <span className={cn('badge', `badge-${statusInfo.color}`)}>
                      {statusInfo.status}
                    </span>
                  </div>

                  {/* Process Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Process Key:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {process.processKey}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Versions:</span>
                      <span className="font-medium">{process.versionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Instances:</span>
                      <span className="font-medium">{totalInstances}</span>
                    </div>
                  </div>

                  {/* Instance Counts */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <PlayIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Running:</span>
                      <span className="font-medium">{process.runningCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Completed:</span>
                      <span className="font-medium">{process.completedCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">Faulted:</span>
                      <span className="font-medium">{process.faultedCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PauseIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Paused:</span>
                      <span className="font-medium">{process.pausedCount}</span>
                    </div>
                  </div>

                  {/* Additional Counts (if any) */}
                  {(process.pendingCount > 0 || process.cancelledCount > 0 || 
                    process.retryingCount > 0 || process.resumingCount > 0 || 
                    process.pausingCount > 0 || process.cancelingCount > 0) && (
                    <div className="border-t pt-3 mt-3">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {process.pendingCount > 0 && (
                          <div className="text-gray-600">
                            Pending: <span className="font-medium">{process.pendingCount}</span>
                          </div>
                        )}
                        {process.cancelledCount > 0 && (
                          <div className="text-gray-600">
                            Cancelled: <span className="font-medium">{process.cancelledCount}</span>
                          </div>
                        )}
                        {process.retryingCount > 0 && (
                          <div className="text-gray-600">
                            Retrying: <span className="font-medium">{process.retryingCount}</span>
                          </div>
                        )}
                        {process.resumingCount > 0 && (
                          <div className="text-gray-600">
                            Resuming: <span className="font-medium">{process.resumingCount}</span>
                          </div>
                        )}
                        {process.pausingCount > 0 && (
                          <div className="text-gray-600">
                            Pausing: <span className="font-medium">{process.pausingCount}</span>
                          </div>
                        )}
                        {process.cancelingCount > 0 && (
                          <div className="text-gray-600">
                            Canceling: <span className="font-medium">{process.cancelingCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 mt-4 pt-4 border-t">
                    <button className="btn-primary text-xs px-3 py-1">
                      View Instances
                    </button>
                    <button className="btn-secondary text-xs px-3 py-1">
                      Settings
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};