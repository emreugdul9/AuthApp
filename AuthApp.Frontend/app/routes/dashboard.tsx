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

// Loader fonksiyonu - şimdilik devre dışı
export async function loader({}: Route.LoaderArgs) {
  // Authentication kontrolünü component'te yapıyoruz
  // Loader'da redirect yapmıyoruz çünkü React Router 7 SSR ile conflict oluyor
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState<string>('');
  const [protectedLoading, setProtectedLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Dashboard: Starting auth check');
        
        // İlk olarak client-side kontrol
        const isClientAuth = authApi.isAuthenticated();
        console.log('Dashboard: Client-side authentication =', isClientAuth);
        
        if (!isClientAuth) {
          console.log('Dashboard: Client-side authentication failed');
          navigate('/', { replace: true });
          return;
        }

        // Backend token doğrulaması
        try {
          console.log('Dashboard: Validating token with backend...');
          const isBackendAuth = await authApi.isAuthenticatedSecure();
          console.log('Dashboard: Backend authentication =', isBackendAuth);
          
          if (!isBackendAuth) {
            console.log('Dashboard: Backend authentication failed, token invalid');
            navigate('/', { replace: true });
            return;
          }
        } catch (error) {
          console.log('Dashboard: Backend validation error:', error);
          // Backend validation hatası - geliştirme aşamasında devam et
          console.log('Dashboard: Continuing with client-side auth due to backend error');
        }

        // Kullanıcı bilgilerini al
        const userData = authApi.getCurrentUserData();
        console.log('Dashboard: User data from localStorage:', userData);
        
        if (userData) {
          setUser(userData);
        } else {
          // localStorage'da user bilgisi yoksa, JWT token'dan çıkar
          const tokenUser = authApi.getUserFromToken();
          console.log('Dashboard: User data from token:', tokenUser);
          
          if (tokenUser) {
            const userInfo = {
              email: tokenUser.email || tokenUser.sub,
            };
            setUser(userInfo);
            console.log('Dashboard: Setting user info and saving to localStorage:', userInfo);
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(userInfo));
            }
          } else {
            console.log('Dashboard: No token user found, redirecting to home');
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

  // Protected endpoint'den data çek
  const fetchProtectedData = async () => {
    setProtectedLoading(true);
    setProtectedData('');
    
    try {
      console.log('Dashboard: Fetching protected data...');
      const result = await authApi.getProtectedData();
      
      if (result.success) {
        setProtectedData(result.message || 'Protected data received successfully');
        console.log('Dashboard: Protected data received:', result.message);
      } else {
        setProtectedData(`Error: ${result.error || 'Failed to fetch protected data'}`);
        console.error('Dashboard: Protected data error:', result.error);
      }
    } catch (error) {
      setProtectedData(`Error: ${error.message || 'Unknown error occurred'}`);
      console.error('Dashboard: Protected data fetch error:', error);
    } finally {
      setProtectedLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/', { replace: true });
  };

  // Debug fonksiyonu - localStorage'ı console'a yazdır
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

  // Loading state
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

  // Eğer authenticate değilse hiçbir şey render etme
  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
                onClick={debugLocalStorage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Debug
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Çıkış yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            
            {/* Stats cards */}
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

            {/* Protected Route Test */}
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

            {/* Recent activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Son Aktiviteler
                </h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Yeni kullanıcı <span className="font-medium text-gray-900">john.doe@example.com</span> kayıt oldu
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>2 dakika önce</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Kullanıcı <span className="font-medium text-gray-900">jane.smith@example.com</span> giriş yaptı
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>15 dakika önce</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Başarısız giriş denemesi <span className="font-medium text-gray-900">unknown@example.com</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>1 saat önce</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
