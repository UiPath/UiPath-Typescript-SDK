import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CogIcon, UserIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Processes', href: '/processes', icon: CogIcon },
  { name: 'User Profile', href: '/profile', icon: UserIcon },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-uipath-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UI</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  UiPath Maestro
                </span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'border-uipath-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src="https://s.gravatar.com/avatar/1f1e0a678b35ddbd554c937044419d12d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fst.png"
                alt="User avatar"
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">Swati Tiwari</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};