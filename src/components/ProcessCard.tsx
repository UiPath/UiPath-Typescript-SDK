import React from 'react';
import { ProcessCardData } from '../types/uipath';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  Package,
  Folder
} from 'lucide-react';

interface ProcessCardProps {
  process: ProcessCardData;
  onClick: () => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ process, onClick }) => {
  const totalInstances = process.pendingCount + process.runningCount + 
    process.completedCount + process.pausedCount + process.cancelledCount + 
    process.faultedCount + process.retryingCount + process.resumingCount + 
    process.pausingCount + process.cancelingCount;

  const getStatusColor = (count: number, total: number) => {
    if (count === 0) return 'text-gray-400';
    const percentage = (count / total) * 100;
    if (percentage > 50) return 'text-red-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {process.processKey}
          </h3>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-1" />
              {process.packageId}
            </div>
            <div className="flex items-center">
              <Folder className="w-4 h-4 mr-1" />
              {process.folderName}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Versions</div>
          <div className="text-lg font-semibold text-gray-900">{process.versionCount}</div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Play className={`w-4 h-4 ${getStatusColor(process.runningCount, totalInstances)}`} />
          </div>
          <div className="text-sm font-medium text-gray-900">{process.runningCount}</div>
          <div className="text-xs text-gray-500">Running</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className={`w-4 h-4 ${getStatusColor(process.completedCount, totalInstances)}`} />
          </div>
          <div className="text-sm font-medium text-gray-900">{process.completedCount}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className={`w-4 h-4 ${getStatusColor(process.pendingCount, totalInstances)}`} />
          </div>
          <div className="text-sm font-medium text-gray-900">{process.pendingCount}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <XCircle className={`w-4 h-4 ${getStatusColor(process.faultedCount, totalInstances)}`} />
          </div>
          <div className="text-sm font-medium text-gray-900">{process.faultedCount}</div>
          <div className="text-xs text-gray-500">Faulted</div>
        </div>
      </div>

      {/* Additional Status Row */}
      <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
        <div className="text-center">
          <Pause className="w-3 h-3 mx-auto mb-1" />
          <div>{process.pausedCount} Paused</div>
        </div>
        <div className="text-center">
          <XCircle className="w-3 h-3 mx-auto mb-1" />
          <div>{process.cancelledCount} Cancelled</div>
        </div>
        <div className="text-center">
          <RotateCcw className="w-3 h-3 mx-auto mb-1" />
          <div>{process.retryingCount} Retrying</div>
        </div>
        <div className="text-center">
          <Clock className="w-3 h-3 mx-auto mb-1" />
          <div>{process.resumingCount} Resuming</div>
        </div>
      </div>

      {/* Package Versions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">Latest Versions:</div>
        <div className="flex flex-wrap gap-1">
          {process.packageVersions.slice(0, 3).map((version, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
            >
              {version}
            </span>
          ))}
          {process.packageVersions.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{process.packageVersions.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessCard;