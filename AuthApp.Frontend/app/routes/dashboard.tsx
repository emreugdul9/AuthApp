import type { Route } from "./+types/dashboard";
import { Link, useNavigate, redirect } from "react-router";
import { useEffect, useState } from "react";
import { authApi } from "../services/authService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - AuthApp" },
    { name: "description", content: "User dashboard" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState<string>('');
  const [protectedLoading, setProtectedLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [autoRefreshMetrics, setAutoRefreshMetrics] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isClientAuth = authApi.isAuthenticated();
        
        if (!isClientAuth) {
          navigate('/', { replace: true });
          return;
        }

        try {
          const isBackendAuth = await authApi.isAuthenticatedSecure();
          
          if (!isBackendAuth) {
            navigate('/', { replace: true });
            return;
          }
        } catch (error) {
        }

        const userData = authApi.getCurrentUserData();
        
        if (userData) {
          setUser(userData);
        } else {
          const tokenUser = authApi.getUserFromToken();
          
          if (tokenUser) {
            const userInfo = {
              email: tokenUser.email || tokenUser.sub,
            };
            setUser(userInfo);
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(userInfo));
            }
          } else {
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Dashboard: Auth check error:', error);
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchProtectedData = async () => {
    setProtectedLoading(true);
    setProtectedData('');
    
    try {
      const result = await authApi.getProtectedData();
      
      if (result.success) {
        setProtectedData(result.message || 'Protected data received successfully');
      } else {
        setProtectedData(`Error: ${result.error || 'Failed to fetch protected data'}`);
      }
    } catch (error) {
      setProtectedData(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setProtectedLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/', { replace: true });
  };

  const debugLocalStorage = () => {
    console.log('=== localStorage Debug ===');
    console.log('Auth Token:', localStorage.getItem('authToken'));
    console.log('User Info:', localStorage.getItem('user'));
    
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        console.log('Token Expires:', new Date(payload.exp * 1000));
        console.log('Is Token Valid:', payload.exp > Date.now() / 1000);
      } catch (error) {
        console.log('Token Parse Error:', error);
      }
    }
    console.log('=== End Debug ===');
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/metrics');
      if (response.ok) {
        const metricsData = await response.json();
        setMetrics(metricsData);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const toggleMetrics = async () => {
    if (!showMetrics) {
      await fetchMetrics();
    }
    setShowMetrics(!showMetrics);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">AuthApp</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Hoş geldiniz, {user?.email}!
              </span>
              <button 
                onClick={toggleMetrics}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showMetrics ? 'Metrics Gizle' : 'Metrics Göster'}
              </button>
              <button 
                onClick={debugLocalStorage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                Debug
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                Çıkış yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Toplam Kullanıcı
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          1,247
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Aktif Oturumlar
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          187
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Ortalama Oturum Süresi
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          2.5 saat
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showMetrics && metrics && (
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    📊 System Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500 rounded-full">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Total Requests</p>
                          <p className="text-xl font-bold text-gray-900">{metrics.totalRequests}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-500 rounded-full">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Endpoints</p>
                          <p className="text-xl font-bold text-gray-900">{Object.keys(metrics.endpointCounts).length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-500 rounded-full">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Last Update</p>
                          <p className="text-sm font-bold text-gray-900">
                            {new Date(metrics.timestamp).toLocaleTimeString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Endpoints</h4>
                    <div className="space-y-2">
                      {Object.entries(metrics.endpointCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([endpoint, count], index) => (
                          <div key={endpoint} className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-600 flex-1 truncate">
                              {endpoint}
                            </span>
                            <span className="text-xs font-bold text-gray-900 ml-2">
                              {count}
                            </span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  index === 0 ? 'bg-blue-500' : 
                                  index === 1 ? 'bg-green-500' : 
                                  index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                                }`}
                                style={{ 
                                  width: `${Math.max((count / metrics.totalRequests) * 100, 10)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={fetchMetrics}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        ↻ Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  🛡️ Protected Endpoint Test
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Bu buton backend'deki protected route'a istek atar ve JWT token'ını doğrular.
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={fetchProtectedData}
                    disabled={protectedLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      protectedLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {protectedLoading ? 'Loading...' : 'Test Protected Route'}
                  </button>
                </div>
                {protectedData && (
                  <div className={`p-4 rounded-md ${
                    protectedData.includes('Error:') 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className={`text-sm font-medium ${
                      protectedData.includes('Error:') ? 'text-red-800' : 'text-green-800'
                    }`}>
                      Response: {protectedData}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
