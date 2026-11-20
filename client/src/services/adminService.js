import api from './api';

export const adminService = {
  // Auth
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/admin/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/admin/me', data);
    return response.data;
  },

  // Dashboard Metrics
  getDashboardSummary: async () => {
    const response = await api.get('/admin/dashboard/summary');
    return response.data;
  },

  getSalesChart: async () => {
    const response = await api.get('/admin/dashboard/sales');
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await api.get('/admin/dashboard/recent-orders');
    return response.data;
  },

  // Inventory
  getInventory: async (params = {}) => {
    const response = await api.get('/admin/inventory', { params });
    return response.data;
  },

  adjustStock: async (productId, data) => {
    const response = await api.patch(`/admin/inventory/${productId}`, data);
    return response.data;
  },

  getTransactions: async (params = {}) => {
    const response = await api.get('/admin/inventory/transactions', { params });
    return response.data;
  },

  // Customers
  getCustomers: async (params = {}) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await api.put('/settings/admin', settingsData);
    return response.data;
  },

  // Messages
  getContactMessages: async () => {
    const response = await api.get('/contact/admin');
    return response.data;
  },

  submitContactMessage: async (formData) => {
    const response = await api.post('/contact', formData);
    return response.data;
  },
};
