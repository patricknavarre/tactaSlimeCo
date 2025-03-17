"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiagnosticsPage() {
  const [loading, setLoading] = useState(true);
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [apiTests, setApiTests] = useState({
    products: { status: 'pending', data: null, error: null },
    settings: { status: 'pending', data: null, error: null }
  });

  // Run diagnostics tests
  useEffect(() => {
    async function runDiagnostics() {
      try {
        setLoading(true);
        
        // Test the diagnostics API
        console.log('Testing diagnostics API...');
        const diagResponse = await fetch('/api/diagnostics');
        const diagData = await diagResponse.json();
        setDiagnosticResults(diagData);

        // Test the products API
        console.log('Testing products API...');
        try {
          const productsResponse = await fetch('/api/products');
          const productsData = await productsResponse.json();
          setApiTests(prev => ({
            ...prev,
            products: { 
              status: 'success', 
              data: productsData,
              statusCode: productsResponse.status,
              statusText: productsResponse.statusText
            }
          }));
        } catch (error) {
          setApiTests(prev => ({
            ...prev,
            products: { 
              status: 'error', 
              error: error.message 
            }
          }));
        }

        // Test the settings API
        console.log('Testing settings API...');
        try {
          const settingsResponse = await fetch('/api/settings');
          const settingsData = await settingsResponse.json();
          setApiTests(prev => ({
            ...prev,
            settings: { 
              status: 'success', 
              data: settingsData,
              statusCode: settingsResponse.status,
              statusText: settingsResponse.statusText
            }
          }));
        } catch (error) {
          setApiTests(prev => ({
            ...prev,
            settings: { 
              status: 'error', 
              error: error.message 
            }
          }));
        }
      } catch (error) {
        console.error('Diagnostics error:', error);
      } finally {
        setLoading(false);
      }
    }

    runDiagnostics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Running Diagnostics...</h1>
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-5 w-5 border-t-2 border-tacta-pink rounded-full"></div>
          <p>Testing connections and APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tacta Slime Diagnostics</h1>
        <Link href="/" className="px-4 py-2 bg-tacta-pink text-white rounded hover:bg-pink-700 transition">
          Back to Home
        </Link>
      </div>

      {/* System Environment */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
        {diagnosticResults?.environment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(diagnosticResults.environment).map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <span className="font-medium">{key}: </span>
                <span className={value === false || value === 'Invalid format' ? "text-red-600" : ""}>{String(value)}</span>
              </div>
            ))}
            <div className="border-b pb-2">
              <span className="font-medium">Test Time: </span>
              <span>{diagnosticResults.timestamp}</span>
            </div>
          </div>
        ) : (
          <div className="text-red-600">Failed to retrieve environment information</div>
        )}
      </div>

      {/* MongoDB Connection Test */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">MongoDB Connection Test</h2>
        {diagnosticResults?.connectionTest ? (
          <div>
            <div className={`text-lg mb-4 ${diagnosticResults.connectionTest.success ? "text-green-600" : "text-red-600"}`}>
              {diagnosticResults.connectionTest.success ? 
                "✅ Connection Successful" : 
                `❌ Connection Failed: ${diagnosticResults.connectionTest.error}`
              }
            </div>

            {diagnosticResults.connectionTest.success ? (
              <div>
                <div className="mb-2">
                  <span className="font-medium">Available Collections: </span>
                  {diagnosticResults.connectionTest.collections.length > 0 ? 
                    diagnosticResults.connectionTest.collections.join(', ') : 
                    "No collections found"
                  }
                </div>
              </div>
            ) : (
              <div>
                {diagnosticResults.connectionTest.errorName && (
                  <div className="mb-2">
                    <span className="font-medium">Error Type: </span>
                    <span className="text-red-600">{diagnosticResults.connectionTest.errorName}</span>
                  </div>
                )}
                {diagnosticResults.connectionTest.errorCode && (
                  <div className="mb-2">
                    <span className="font-medium">Error Code: </span>
                    <span className="text-red-600">{diagnosticResults.connectionTest.errorCode}</span>
                  </div>
                )}
                {diagnosticResults.connectionTest.stack && (
                  <div className="mb-2">
                    <span className="font-medium">Stack Trace: </span>
                    <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto rounded">{diagnosticResults.connectionTest.stack}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-red-600">Failed to run connection test</div>
        )}
      </div>

      {/* API Tests */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Endpoint Tests</h2>
        
        {/* Products API Test */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Products API</h3>
          <div className={`p-4 rounded ${
            apiTests.products.status === 'success' ? "bg-green-50" : 
            apiTests.products.status === 'error' ? "bg-red-50" : "bg-gray-50"
          }`}>
            {apiTests.products.status === 'pending' && (
              <p>Testing products API...</p>
            )}
            {apiTests.products.status === 'success' && (
              <div>
                <p className="text-green-600 mb-2">✅ API Responded Successfully (Status: {apiTests.products.statusCode} {apiTests.products.statusText})</p>
                <div className="mb-2">
                  <span className="font-medium">Response Type: </span>
                  <span>{Array.isArray(apiTests.products.data) ? 'Array' : typeof apiTests.products.data}</span>
                </div>
                {Array.isArray(apiTests.products.data) && (
                  <div className="mb-2">
                    <span className="font-medium">Products Count: </span>
                    <span>{apiTests.products.data.length}</span>
                    {apiTests.products.data.length > 0 && (
                      <div className="mt-2">
                        <details>
                          <summary className="cursor-pointer text-blue-600">View first product sample</summary>
                          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto rounded">
                            {JSON.stringify(apiTests.products.data[0], null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                )}
                {!Array.isArray(apiTests.products.data) && (
                  <div className="mt-2">
                    <details>
                      <summary className="cursor-pointer text-blue-600">View response data</summary>
                      <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto rounded">
                        {JSON.stringify(apiTests.products.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            )}
            {apiTests.products.status === 'error' && (
              <div>
                <p className="text-red-600 mb-2">❌ API Request Failed: {apiTests.products.error}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Settings API Test */}
        <div>
          <h3 className="text-lg font-medium mb-2">Settings API</h3>
          <div className={`p-4 rounded ${
            apiTests.settings.status === 'success' ? "bg-green-50" : 
            apiTests.settings.status === 'error' ? "bg-red-50" : "bg-gray-50"
          }`}>
            {apiTests.settings.status === 'pending' && (
              <p>Testing settings API...</p>
            )}
            {apiTests.settings.status === 'success' && (
              <div>
                <p className="text-green-600 mb-2">✅ API Responded Successfully (Status: {apiTests.settings.statusCode} {apiTests.settings.statusText})</p>
                <div className="mt-2">
                  <details>
                    <summary className="cursor-pointer text-blue-600">View settings data</summary>
                    <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto rounded">
                      {JSON.stringify(apiTests.settings.data, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
            {apiTests.settings.status === 'error' && (
              <div>
                <p className="text-red-600 mb-2">❌ API Request Failed: {apiTests.settings.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Recommendations</h2>
        
        {diagnosticResults?.connectionTest?.success ? (
          <div className="text-green-600 mb-4">
            <p>✅ MongoDB connection is working correctly!</p>
          </div>
        ) : (
          <div>
            <h3 className="font-medium text-red-600 mb-2">MongoDB Connection Issues:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verify that your <code className="bg-gray-100 px-1">MONGODB_URI</code> environment variable is correctly set in Vercel.</li>
              <li>Check that your MongoDB Atlas IP access list includes <code className="bg-gray-100 px-1">0.0.0.0/0</code> (allows access from anywhere).</li>
              <li>Ensure your database username and password in the connection string are correct and URL-encoded.</li>
              <li>Check if your MongoDB cluster is running and accessible.</li>
              <li>Try creating a new database user with a simple password (no special characters).</li>
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-medium mb-2">General API Issues:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>The API is configured to return fallback data when database connection fails, so you should still see some products.</li>
            <li>404 errors for pages like /bestsellers, /new, /faq, etc. are expected if these pages don't exist yet.</li>
            <li>If you've modified the environment variables, make sure to redeploy the application in Vercel.</li>
          </ul>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-tacta-pink text-white rounded-lg hover:bg-pink-700 transition shadow-sm"
          >
            Run Tests Again
          </button>
        </div>
      </div>
    </div>
  );
} 