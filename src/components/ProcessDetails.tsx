import React, { useState, useEffect } from 'react';
import { ProcessCardData } from '../types/uipath';
import { ProcessSettings } from 'uipath-typescript-sdk';
import { uiPathClient } from '../lib/uipath';
import { 
  X, 
  Package, 
  Folder, 
  Calendar, 
  Settings,
  Code,
  AlertCircle,
  Loader
} from 'lucide-react';

interface ProcessDetailsProps {
  process: ProcessCardData;
  onClose: () => void;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({ process, onClose }) => {
  const [settings, setSettings] = useState<ProcessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcessSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const processSettings = await uiPathClient.maestroProcesses.getSettings(process.processKey);
        setSettings(processSettings);
      } catch (err) {
        console.error('Error fetching process settings:', err);
        setError('Failed to load process settings');
      } finally {
        setLoading(false);
      }
    };

    fetchProcessSettings();
  }, [process.processKey]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{process.processKey}</h2>
            <p className="text-gray-600 mt-1">Process Details & Settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Package ID</div>
                  <div className="font-medium">{process.packageId}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Folder className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Folder</div>
                  <div className="font-medium">{process.folderName}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Folder Key</div>
                  <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {process.folderKey}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Package Versions ({process.versionCount})</div>
                <div className="flex flex-wrap gap-2">
                  {process.packageVersions.map((version, index) => (
                    <span 
                      key={index}
                      className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {version}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Process Status Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instance Status Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{process.runningCount}</div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{process.completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{process.pendingCount}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{process.faultedCount}</div>
                <div className="text-sm text-gray-600">Faulted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{process.pausedCount}</div>
                <div className="text-sm text-gray-600">Paused</div>
              </div>
            </div>
          </div>

          {/* Process Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Process Settings</h3>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading process settings...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {settings && (
              <div className="space-y-6">
                {/* Variable Tags */}
                {settings.variableTags && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Variable Tags</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Last Update</div>
                          <div className="text-sm font-medium">
                            {new Date(settings.variableTags.lastUpdateTimeUtc).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {settings.variableTags.sourcePackageVersion && (
                        <div className="flex items-center space-x-3">
                          <Package className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm text-gray-500">Source Package Version</div>
                            <div className="text-sm font-medium">
                              {settings.variableTags.sourcePackageVersion}
                            </div>
                          </div>
                        </div>
                      )}

                      {settings.variableTags.elements && (
                        <div>
                          <div className="text-sm text-gray-500 mb-2">Elements with Variable Tags</div>
                          <div className="text-sm bg-gray-100 p-3 rounded font-mono">
                            {Object.keys(settings.variableTags.elements).length} elements configured
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Raw Settings Data */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Raw Settings Data</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(settings, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDetails;