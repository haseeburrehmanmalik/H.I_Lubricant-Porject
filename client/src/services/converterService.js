import api from './api';

export const converterService = {
  // Public - active converters for customer page & calculator
  getPublicConverters: async (params = {}) => {
    const response = await api.get('/oil-converters', { params });
    return response.data;
  },

  // Public - get single converter details
  getConverterById: async (id) => {
    const response = await api.get(`/oil-converters/${id}`);
    return response.data;
  },

  // Admin - get all converters with search/filter/sort
  getAdminConverters: async (params = {}) => {
    const response = await api.get('/admin/oil-converters', { params });
    return response.data;
  },

  // Admin - create a new converter slot
  createConverter: async (data) => {
    const response = await api.post('/admin/oil-converters', data);
    return response.data;
  },

  // Admin - update a converter configuration
  updateConverter: async (id, data) => {
    const response = await api.put(`/admin/oil-converters/${id}`, data);
    return response.data;
  },

  // Admin - toggle enabled status
  toggleStatus: async (id, enabled) => {
    const response = await api.patch(`/admin/oil-converters/${id}/status`, { enabled });
    return response.data;
  },

  // Admin - safe delete a converter
  deleteConverter: async (id) => {
    const response = await api.delete(`/admin/oil-converters/${id}`);
    return response.data;
  },
};
