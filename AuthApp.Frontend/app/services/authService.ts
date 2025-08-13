function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.VITE_API_BASE_URL || 'http://backend:5000/api/auth';
  }
  
  const stored = localStorage.getItem('apiBaseUrl');
  if (stored) return stored;
  
  return 'http://localhost:5000/api/auth';
}

const API_BASE_URL = getApiBaseUrl();

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
  };
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.log('Non-JSON response:', textResponse);
      throw new Error(`Server returned non-JSON response: ${textResponse || 'Empty response'}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Beklenmeyen bir hata oluştu');
  }
}

function parseJwtToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Token parse error:', error);
    return null;
  }
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<any>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('Login response:', response);
    
    if (response.token) {
      const userPayload = parseJwtToken(response.token);
      console.log('Parsed user payload:', userPayload);
      
      const loginResult = {
        success: true,
        token: response.token,
        user: userPayload,
        message: response.message || 'Login successful'
      };
      console.log('Login result:', loginResult);
      return loginResult;
    } else {
      return {
        success: false,
        message: response.message || 'Login failed - no token received'
      };
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<any>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    console.log('Register response:', response);
    
    if (response.token) {
      const userPayload = parseJwtToken(response.token);
      
      return {
        success: true,
        token: response.token,
        user: userPayload,
        message: response.message || 'Registration successful'
      };
    } else {
      return {
        success: false,
        message: response.message || 'Registration failed - no token received'
      };
    }
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const payload = parseJwtToken(token);
      if (!payload) return false;

      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  getCurrentUserData() {
    if (typeof window === 'undefined') {
      return null;
    }
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  },

  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;
    
    return parseJwtToken(token);
  },

  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      console.log('validateToken: No token found');
      return false;
    }

    try {
      console.log('validateToken: Sending request to backend...');
      const response = await apiRequest<any>('/validate-token', {
        method: 'GET',
      });
      
      console.log('validateToken: Backend response received:', response);
      const isValid = response.isValid === true || response.valid === true;
      
      console.log('validateToken: Token validation result:', isValid);
      return isValid;
    } catch (error) {
      console.error('validateToken: Backend validation error:', error);
      console.log('validateToken: Error type:', typeof error);
      console.log('validateToken: Error message:', error.message);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.log('validateToken: Token is unauthorized, logging out');
        this.logout();
        return false;
      }
      console.log('validateToken: Other error, returning false but not logging out');
      return false;
    }
  },

  async isAuthenticatedSecure(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    return await this.validateToken();
  },

  async getProtectedData(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      console.log('getProtectedData: Making request to protected endpoint...');
      const response = await apiRequest<any>('/protected', {
        method: 'GET',
      });
      
      console.log('getProtectedData: Protected endpoint response:', response);
      return {
        success: true,
        message: response.message || response.data || 'Protected data received'
      };
    } catch (error) {
      console.error('getProtectedData: Protected endpoint error:', error);
      return {
        success: false,
        error: error.message || 'Failed to access protected route'
      };
    }
  }
};
