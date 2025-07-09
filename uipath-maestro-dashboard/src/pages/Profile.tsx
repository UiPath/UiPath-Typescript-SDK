import React from 'react';
import { Layout } from '../components/Layout/Layout';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export const Profile: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="card p-6">
          <div className="flex items-center space-x-6 mb-6">
            <img
              className="h-24 w-24 rounded-full ring-4 ring-gray-100"
              src="https://s.gravatar.com/avatar/1f1e0a678b35ddbd554c937044419d12d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
              alt="User avatar"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Swati Tiwari</h2>
              <p className="text-lg text-gray-600">Administrator</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="badge-success">Active</span>
                <span className="badge-info">Verified</span>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">swati.t@uipath.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Organization</p>
                  <p className="text-sm text-gray-600">popoc</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tenant</p>
                  <p className="text-sm text-gray-600">adetenant</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Role</p>
                  <p className="text-sm text-gray-600">Administrator</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Login</p>
                  <p className="text-sm text-gray-600">Today at 2:30 PM</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">User ID</p>
                  <p className="text-sm text-gray-600 font-mono">0e5b5bc9-9aac-462f-934e-f3a8d857ef2a</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions & Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Orchestrator API</p>
                <p className="text-xs text-green-700">Full Access</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">PIMS</p>
                <p className="text-xs text-green-700">Full Access</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Data Service</p>
                <p className="text-xs text-green-700">Read/Write</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Insights</p>
                <p className="text-xs text-green-700">Full Access</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">AI Fabric</p>
                <p className="text-xs text-green-700">Full Access</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Document Understanding</p>
                <p className="text-xs text-green-700">Full Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-600">Receive notifications about process status</p>
              </div>
              <button className="btn-secondary text-sm">Configure</button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Security Settings</p>
                <p className="text-xs text-gray-600">Manage authentication and security preferences</p>
              </div>
              <button className="btn-secondary text-sm">Manage</button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">API Keys</p>
                <p className="text-xs text-gray-600">Generate and manage API access tokens</p>
              </div>
              <button className="btn-secondary text-sm">View Keys</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};