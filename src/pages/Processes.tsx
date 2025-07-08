import React, { useState, useEffect } from 'react';
import { GetAllProcessesSummaryResponse } from 'uipath-typescript-sdk';
import { uiPathClient } from '../lib/uipath';
import { ProcessCardData } from '../types/uipath';
import ProcessCard from '../components/ProcessCard';
import ProcessDetails from '../components/ProcessDetails';
import { 
  Loader, 
  AlertCircle, 
  Search, 
  Filter,
  RefreshCw,
  Settings
} from 'lucide-react';

const Processes: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<ProcessCardData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchProcesses = async () => {
    try {
      setError(null);
      const response: GetAllProcessesSummaryResponse = await uiPathClient.maestroProcesses.getSummary();
      
      // Transform the response to match our ProcessCardData interface
      const processData: ProcessCardData[] = response.processes.map(process => ({
        processKey: process.processKey,
        packageId: process.packageId,
        folderKey: process.folderKey,
        folderName: process.folderName,
        packageVersions: process.packageVersions,
        versionCount: process.versionCount,
        pendingCount: process.pendingCount,
        runningCount: process.runningCount,
        completedCount: process.completedCount,
        pausedCount: process.pausedCount,
        cancelledCount: process.cancelledCount,
        faultedCount: process.faultedCount,
        retryingCount: process.retryingCount,
        resumingCount: process.resumingCount,
        pausingCount: process.pausingCount,
        cancelingCount: process.cancelingCount,
      }));

      setProcesses(processData);
    } catch (err) {
      console.error('Error fetching processes:', err);
      setError('Failed to load processes. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProcesses();
  };

  const filteredProcesses = processes.filter(process =>
    process.processKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.folderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Maestro processes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Processes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maestro Processes</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage your UiPath automation processes
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900">{processes.length}</div>
              <div className="text-sm text-gray-600">Total Processes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900">
                {processes.reduce((sum, p) => sum + p.runningCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Running</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900">
                {processes.reduce((sum, p) => sum + p.completedCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900">
                {processes.reduce((sum, p) => sum + p.faultedCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Faulted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search processes by name, package, or folder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Process Grid */}
      {filteredProcesses.length === 0 ? (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No processes found' : 'No processes available'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms or filters.'
              : 'There are no Maestro processes to display at this time.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process) => (
            <ProcessCard
              key={process.processKey}
              process={process}
              onClick={() => setSelectedProcess(process)}
            />
          ))}
        </div>
      )}

      {/* Process Details Modal */}
      {selectedProcess && (
        <ProcessDetails
          process={selectedProcess}
          onClose={() => setSelectedProcess(null)}
        />
      )}
    </div>
  );
};

export default Processes;