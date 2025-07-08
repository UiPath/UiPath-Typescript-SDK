import React from 'react';
import { UserProfile } from '../types/uipath';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar,
  Settings,
  Shield,
  Bell,
  Globe
} from 'lucide-react';

const Profile: React.FC = () => {
  // Mock user data based on the JWT token information
  const userProfile: UserProfile = {
    name: 'Swati Tiwari',
    email: 'swati.t@uipath.com',
    role: 'Automation Developer',
    avatar: 'https://s.gravatar.com/avatar/1f1e0a678b35ddbd554c937044419d12d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <div className="flex items-center space-x-6">
            <img
              className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
              src={userProfile.avatar}
              alt="User avatar"
            />
            <div className="text-white">
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-blue-100 text-lg">{userProfile.email}</p>
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-sm mt-2">
                {userProfile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-medium">{userProfile.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="font-medium">{userProfile.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Role</div>
                    <div className="font-medium">{userProfile.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="font-medium">January 2024</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Account Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-500">Enhanced security for your account</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">Enabled</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-500">Receive updates about your processes</div>
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Enabled</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium">Language & Region</div>
                      <div className="text-sm text-gray-500">English (US)</div>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Processes Accessed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">48</div>
            <div className="text-sm text-gray-600">Sessions This Month</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">Accessed Maestro Processes</div>
              <div className="text-xs text-gray-500">2 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">Viewed process details</div>
              <div className="text-xs text-gray-500">15 minutes ago</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">Updated profile settings</div>
              <div className="text-xs text-gray-500">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;