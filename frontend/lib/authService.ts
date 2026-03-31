import api from './api';

export const authService = {
  async register(data: { fullName: string; email: string; phone?: string; password: string; role?: string }) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async verifyOTP(userId: string, otp: string) {
    const res = await api.post('/auth/verify-otp', { userId, otp });
    return res.data;
  },

  async login(data: { email: string; password: string; totpToken?: string; smsOtp?: string }) {
    const res = await api.post('/auth/login', data);
    if (res.data.data?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
    }
    return res.data;
  },

  async logout() {
    if (typeof window !== 'undefined') {
      await api.post('/auth/logout').catch(() => {});
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }
};
