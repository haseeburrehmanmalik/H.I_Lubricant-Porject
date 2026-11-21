import api from './api';

const DEFAULT_ORDERS = [
  {
    _id: 'ord_1',
    orderNumber: 'HI-98421',
    createdAt: new Date().toISOString(),
    status: 'processing',
    totalAmount: 14500,
    itemsPrice: 14250,
    deliveryFee: 250,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'pending',
    trackingNumber: 'TCS-992148102',
    courierName: 'TCS Courier',
    customer: {
      name: 'Muhammad Tariq',
      phone: '+92 300 1234567',
      email: 'tariq@gmail.com',
      address: 'House # 42, Block C, Latifabad Unit 7',
      city: 'Hyderabad',
      notes: 'Please call before delivery',
    },
    items: [
      {
        name: 'Shell Helix Ultra 5W-40 (4L)',
        quantity: 2,
        price: 7790,
        unit: 'Bottle (4 Litres)',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    _id: 'ord_2',
    orderNumber: 'HI-98420',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'confirmed',
    totalAmount: 7400,
    itemsPrice: 7400,
    deliveryFee: 0,
    paymentMethod: 'JazzCash / EasyPaisa',
    paymentStatus: 'paid',
    trackingNumber: 'LEO-4481029',
    courierName: 'Leopards Courier',
    customer: {
      name: 'Ahmed Raza',
      phone: '+92 312 9876543',
      email: 'ahmed.raza@yahoo.com',
      address: 'Shop # 12, Auto Market, Gari Khata',
      city: 'Hyderabad',
      notes: 'Deliver during shop hours',
    },
    items: [
      {
        name: 'Caltex Havoline ProDS 5W-30 (4L)',
        quantity: 1,
        price: 7400,
        unit: 'Bottle (4 Litres)',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    _id: 'ord_3',
    orderNumber: 'HI-98419',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'delivered',
    totalAmount: 8500,
    itemsPrice: 8500,
    deliveryFee: 0,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'paid',
    trackingNumber: 'TCS-9912048',
    courierName: 'TCS Courier',
    customer: {
      name: 'Bilal Khan',
      phone: '+92 333 4567890',
      email: 'bilal.k@gmail.com',
      address: 'Plot 18, Phase 2, Qasimabad',
      city: 'Hyderabad',
      notes: 'Leave at front gate',
    },
    items: [
      {
        name: 'Honda Genuine OEM 0W-20 (4L)',
        quantity: 1,
        price: 8500,
        unit: 'Bottle (4 Litres)',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

const getStoredOrders = () => {
  const saved = localStorage.getItem('hi_store_orders');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  localStorage.setItem('hi_store_orders', JSON.stringify(DEFAULT_ORDERS));
  return DEFAULT_ORDERS;
};

const saveStoredOrders = (orders) => {
  localStorage.setItem('hi_store_orders', JSON.stringify(orders));
};

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const newOrder = {
        ...orderData,
        _id: 'ord_' + Date.now(),
        orderNumber: 'HI-' + Math.floor(10000 + Math.random() * 90000),
        createdAt: new Date().toISOString(),
        status: 'pending',
        paymentStatus: 'pending',
      };
      list.unshift(newOrder);
      saveStoredOrders(list);
      return { success: true, order: newOrder, message: 'Order created successfully' };
    }
  },

  trackOrder: async (trackingData) => {
    try {
      const response = await api.post('/orders/track', trackingData);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const searchNum = trackingData.orderNumber?.trim().toUpperCase();
      const searchPhone = trackingData.phone?.trim();
      const found = list.find(
        (o) =>
          o.orderNumber?.toUpperCase() === searchNum ||
          o.trackingNumber === searchNum ||
          (searchPhone && o.customer?.phone?.includes(searchPhone))
      );
      if (found) {
        return { success: true, order: found };
      }
      throw new Error('No matching order found with the provided details.');
    }
  },

  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/lookup/${orderNumber}`);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const found = list.find((o) => o.orderNumber?.toUpperCase() === orderNumber?.toUpperCase());
      if (found) return { success: true, order: found };
      throw err;
    }
  },

  getAdminOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders/admin', { params });
      return response.data;
    } catch (err) {
      let list = getStoredOrders();
      if (params.status && params.status !== 'all') {
        list = list.filter((o) => o.status === params.status);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (o) =>
            o.orderNumber?.toLowerCase().includes(s) ||
            o.customer?.name?.toLowerCase().includes(s) ||
            o.customer?.phone?.includes(s)
        );
      }
      return {
        success: true,
        orders: list,
        total: list.length,
        pages: 1,
        currentPage: 1,
      };
    }
  },

  getAdminOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/admin/${id}`);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const found = list.find((o) => o._id === id);
      if (found) return { success: true, order: found };
      throw err;
    }
  },

  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await api.patch(`/orders/admin/${id}/status`, statusData);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const idx = list.findIndex((o) => o._id === id);
      if (idx !== -1) {
        list[idx].status = statusData.status;
        saveStoredOrders(list);
        return { success: true, order: list[idx], message: 'Status updated' };
      }
      return { success: true };
    }
  },

  updateOrderPayment: async (id, paymentData) => {
    try {
      const response = await api.patch(`/orders/admin/${id}/payment`, paymentData);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const idx = list.findIndex((o) => o._id === id);
      if (idx !== -1) {
        list[idx].paymentStatus = paymentData.paymentStatus;
        saveStoredOrders(list);
        return { success: true, order: list[idx], message: 'Payment status updated' };
      }
      return { success: true };
    }
  },

  updateOrderTracking: async (id, trackingData) => {
    try {
      const response = await api.patch(`/orders/admin/${id}/tracking`, trackingData);
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const idx = list.findIndex((o) => o._id === id);
      if (idx !== -1) {
        list[idx].trackingNumber = trackingData.trackingNumber;
        list[idx].courierName = trackingData.courierName;
        saveStoredOrders(list);
        return { success: true, order: list[idx], message: 'Tracking updated' };
      }
      return { success: true };
    }
  },
};
