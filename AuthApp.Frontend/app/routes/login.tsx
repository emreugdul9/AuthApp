import type { Route } from "./+types/login";
import { Form, Link, useNavigate } from "react-router";
import { useActionData } from "react-router";
import { authApi } from "../services/authService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - AuthApp" },
    { name: "description", content: "Login to your account" },
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
    
    if (response.success) {
      return { 
        success: true, 
        redirectTo: '/dashboard',
        user: response.user 
      };
    } else {
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

export default function Login() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  // Başarılı login sonrası yönlendirme
  if (actionData?.success && actionData.redirectTo) {
    navigate(actionData.redirectTo, { replace: true });
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veya{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              yeni hesap oluşturun
            </Link>
          </p>
        </div>
        
        {actionData?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {actionData.error}
            </div>
          </div>
        )}
        
        <Form className="mt-8 space-y-6" method="post">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                E-posta adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="E-posta adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Şifrenizi mi unuttunuz?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Giriş yap
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
