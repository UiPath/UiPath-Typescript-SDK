import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  User, 
  BarChart3, 
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to UiPath Portal
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Manage and monitor your automation processes with ease. 
            Get insights into your Maestro processes and track their performance.
          </p>
          <Link
            to="/processes"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Maestro Processes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <img
            className="h-16 w-16 rounded-full"
            src="https://s.gravatar.com/avatar/1f1e0a678b35ddbd554c937044419d12d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
            alt="User avatar"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Swati Tiwari</h2>
            <p className="text-gray-600">swati.t@uipath.com</p>
            <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full mt-2">
              Automation Developer
            </span>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/processes"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Maestro Processes</h3>
          </div>
          <p className="text-gray-600 mb-4">
            View and manage your automation processes. Monitor status, versions, and performance metrics.
          </p>
          <div className="flex items-center text-blue-600 font-medium">
            Explore Processes
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get insights into your automation performance with detailed analytics and reports.
          </p>
          <div className="flex items-center text-gray-400 font-medium">
            Coming Soon
          </div>
        </div>

        <Link
          to="/profile"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Manage your account settings, preferences, and view your activity history.
          </p>
          <div className="flex items-center text-purple-600 font-medium">
            View Profile
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">
              Built with modern technologies for optimal performance and reliability.
            </p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">
              Enterprise-grade security with proper authentication and authorization.
            </p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connected</h3>
            <p className="text-gray-600">
              Seamlessly integrated with UiPath Cloud Platform services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;