import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Home, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">UiPath Portal</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              to="/processes"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/processes') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Maestro Processes
            </Link>
            <Link
              to="/profile"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/profile') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              User Profile
            </Link>
          </nav>

          {/* User Avatar */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src="https://s.gravatar.com/avatar/1f1e0a678b35ddbd554c937044419d12d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
                alt="User avatar"
              />
              <span className="text-sm font-medium text-gray-700">Swati Tiwari</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;