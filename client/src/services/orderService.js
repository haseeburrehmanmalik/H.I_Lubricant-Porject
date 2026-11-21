import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  trackOrder: async (trackingData) => {
    const response = await api.post('/orders/track', trackingData);
    return response.data;
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/lookup/${orderNumber}`);
    return response.data;
  },

  getAdminOrders: async (params = {}) => {
    const response = await api.get('/orders/admin', { params });
    return response.data;
  },

  getAdminOrderById: async (id) => {
    const response = await api.get(`/orders/admin/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await api.patch(`/orders/admin/${id}/status`, statusData);
    return response.data;
  },

  updateOrderPayment: async (id, paymentData) => {
    const response = await api.patch(`/orders/admin/${id}/payment`, paymentData);
    return response.data;
  },

  updateOrderTracking: async (id, trackingData) => {
    const response = await api.patch(`/orders/admin/${id}/tracking`, trackingData);
    return response.data;
  },
};
