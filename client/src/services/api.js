import axios from 'axios';

// Live Cloud Backend API URL for 100% Real-Time Multi-Device Sync
const LIVE_BACKEND_URL = 'https://kingdom-swim-toolkit-functionality.trycloudflare.com/api';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// On GitHub Pages or mobile, connect directly to the Live Cloud Backend
const BASE_URL = isLocalhost ? '/api' : LIVE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hi_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses and unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on an admin route, clear token
      const hash = window.location.hash || '';
      if (hash.includes('/admin') && !hash.includes('/admin/login')) {
        localStorage.removeItem('hi_admin_token');
        localStorage.removeItem('hi_admin_user');
        window.location.hash = '#/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
