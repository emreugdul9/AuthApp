import type { Route } from "./+types/home";
import { Form, Link } from "react-router";
import { useActionData, useNavigate } from "react-router";
import { useEffect } from "react";
import { authApi } from "../services/authService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AuthApp - Giriş Yap" },
    { name: "description", content: "AuthApp ile güvenli giriş yapın" },
  ];
}

// Form action handler - Backend entegrasyonu
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { 
      success: false, 
      error: 'Email ve şifre alanları zorunludur' 
    };
  }

  try {
    // Backend API'ye login isteği gönder
    const response = await authApi.login({ email, password });
    console.log('Action received response:', response);
    
    if (response.success) {
      console.log('Login successful, returning success response for client-side redirect');
      return { 
        success: true,
        token: response.token,
        user: response.user,
        redirectTo: '/dashboard'
      };
    } else {
      console.log('Login failed:', response.message);
      return { 
        success: false, 
        error: response.message || 'Giriş başarısız' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Sunucu hatası oluştu' 
    };
  }
}

export default function Home() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  // Client-side redirect after successful login
  useEffect(() => {
    if (actionData?.success && actionData.token && actionData.redirectTo) {
      console.log('Client-side: Login successful, storing token and redirecting');
      
      // Token'ı localStorage'a kaydet (client-side'da)
      localStorage.setItem('authToken', actionData.token);
      
      // User bilgilerini de kaydet
      if (actionData.user) {
        const userInfo = {
          email: actionData.user.email || actionData.user.sub,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      // Dashboard'a yönlendir
      navigate(actionData.redirectTo, { replace: true });
    }
  }, [actionData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo ve başlık */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AuthApp
          </h1>
          <p className="text-gray-600">
            Hesabınıza giriş yapın
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-700 font-medium">
                  {actionData.error}
                </span>
              </div>
            </div>
          )}

          <Form method="post" className="space-y-6">
            {/* Email input */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-100"
                  placeholder="ornek@email.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password input */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-100"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
            >
              <span className="flex items-center justify-center">
                Giriş Yap
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </Form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Hesabınız yok mu?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-300"
              >
                Hesap oluşturun
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 AuthApp. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
