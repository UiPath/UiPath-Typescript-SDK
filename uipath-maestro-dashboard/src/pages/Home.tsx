import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { StatCard } from '../components/UI/StatCard';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { ErrorMessage } from '../components/UI/ErrorMessage';
import { uiPathClient } from '../lib/uipath';
import { 
  CogIcon, 
  PlayIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

interface ProcessStats {
  totalProcesses: number;
  totalInstances: number;
  runningCount: number;
  completedCount: number;
  faultedCount: number;
  pausedCount: number;
}

export const Home: React.FC = () => {
  const [stats, setStats] = useState<ProcessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const processesResponse = await uiPathClient.maestroProcesses.getSummary();
      
      const totalProcesses = processesResponse.processes?.length || 0;
      
      // Calculate totals from all processes
      const totals = processesResponse.processes?.reduce((acc, process) => ({
        totalInstances: acc.totalInstances + (
          process.runningCount + 
          process.completedCount + 
          process.faultedCount + 
          process.pausedCount + 
          process.pendingCount + 
          process.cancelledCount + 
          process.retryingCount + 
          process.resumingCount + 
          process.pausingCount + 
          process.cancelingCount
        ),
        runningCount: acc.runningCount + process.runningCount,
        completedCount: acc.completedCount + process.completedCount,
        faultedCount: acc.faultedCount + process.faultedCount,
        pausedCount: acc.pausedCount + process.pausedCount,
      }), {
        totalInstances: 0,
        runningCount: 0,
        completedCount: 0,
        faultedCount: 0,
        pausedCount: 0,
      }) || {
        totalInstances: 0,
        runningCount: 0,
        completedCount: 0,
        faultedCount: 0,
        pausedCount: 0,
      };

      setStats({
        totalProcesses,
        ...totals
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        <ErrorMessage message={error} onRetry={fetchStats} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your UiPath Maestro processes and instances
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Processes"
            value={stats?.totalProcesses || 0}
            icon={CogIcon}
            color="blue"
            subtitle="Active process definitions"
          />
          
          <StatCard
            title="Total Instances"
            value={stats?.totalInstances || 0}
            icon={PlayIcon}
            color="gray"
            subtitle="All process instances"
          />
          
          <StatCard
            title="Running"
            value={stats?.runningCount || 0}
            icon={PlayIcon}
            color="yellow"
            subtitle="Currently executing"
          />
          
          <StatCard
            title="Completed"
            value={stats?.completedCount || 0}
            icon={CheckCircleIcon}
            color="green"
            subtitle="Successfully finished"
          />
          
          <StatCard
            title="Faulted"
            value={stats?.faultedCount || 0}
            icon={ExclamationCircleIcon}
            color="red"
            subtitle="Failed executions"
          />
          
          <StatCard
            title="Paused"
            value={stats?.pausedCount || 0}
            icon={PauseIcon}
            color="blue"
            subtitle="Temporarily suspended"
          />
        </div>

        {/* Welcome Section */}
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <img
              className="h-16 w-16 rounded-full"
              src="https://s.gravatar.com/avatar/1f1e0a678b35ddbd554c937044419d12d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
              alt="User avatar"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Welcome back, Swati!</h2>
              <p className="text-gray-600">Administrator • popoc Organization</p>
              <p className="text-sm text-gray-500 mt-1">
                You have {stats?.runningCount || 0} processes currently running
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">
              <PlayIcon className="w-4 h-4 mr-2" />
              View All Processes
            </button>
            <button className="btn-secondary">
              <ClockIcon className="w-4 h-4 mr-2" />
              Recent Activity
            </button>
            <button className="btn-secondary">
              <CogIcon className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};