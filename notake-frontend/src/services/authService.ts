import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface ApiError {
  error: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/register`,
      userData
    );
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
