"use client";

import { useState, useEffect } from 'react';
import { get } from '@/lib/api';

const ServerStatus = () => {
  const [status, setStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const data = await get('server-info');
        setStatus({ loading: false, data, error: null });
      } catch (error) {
        setStatus({ loading: false, data: null, error: error.message });
      }
    };

    checkServerStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">Backend Server Status</h3>
      
      {status.loading && (
        <div className="flex items-center space-x-2 text-gray-600">
          <svg className="animate-spin h-5 w-5 text-tacta-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Checking server status...</span>
        </div>
      )}

      {status.error && (
        <div className="text-red-500">
          <div className="font-medium">Connection Error</div>
          <div className="text-sm">{status.error}</div>
          <div className="text-sm mt-2">
            Make sure the backend server is running on port 5051. 
            <div className="mt-1 text-gray-600">
              Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run dev:backend</code> in another terminal.
            </div>
          </div>
        </div>
      )}

      {status.data && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="font-medium text-green-600">
              Connected to {status.data.serverType} server (Port: {status.data.port})
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>Server Time:</div>
            <div>{new Date(status.data.serverTime).toLocaleString()}</div>
            <div>Version:</div>
            <div>{status.data.version}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerStatus; 