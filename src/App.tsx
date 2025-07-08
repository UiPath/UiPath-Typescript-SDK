import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Processes from './pages/Processes';
import Profile from './pages/Profile';
import { initializeUiPath } from './lib/uipath';
import { Loader, AlertCircle } from 'lucide-react';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const success = await initializeUiPath();
        if (success) {
          setIsInitialized(true);
        } else {
          setInitError('Failed to initialize UiPath SDK');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError('Failed to initialize UiPath SDK');
      }
    };

    init();
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Initialization Error</h1>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Initializing UiPath Portal</h1>
          <p className="text-gray-600">Setting up your automation workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/processes" element={<Processes />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;