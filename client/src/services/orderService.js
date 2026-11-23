import api from './api';

const normalizeOrder = (ord) => {
  const subtotal = ord.subtotal ?? ord.itemsPrice ?? 0;
  const delivery = ord.deliveryCharges ?? ord.deliveryFee ?? 0;
  const total = ord.total ?? ord.totalAmount ?? (subtotal + delivery);
  const statusRaw = ord.orderStatus || ord.status || 'Pending';
  // Capitalize status properly (e.g. 'processing' -> 'Processing')
  const status =
    statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).toLowerCase();

  const paymentStatusRaw = ord.paymentStatus || 'Unpaid';
  const paymentStatus =
    paymentStatusRaw.toLowerCase() === 'paid' ? 'Paid' : 'Unpaid';

  const items = (ord.items || []).map((it) => ({
    ...it,
    price: it.price || 0,
    quantity: it.quantity || 1,
    subtotal: it.subtotal ?? (it.price || 0) * (it.quantity || 1),
    viscosity: it.viscosity || it.unit || 'Standard Lubricant',
  }));

  return {
    ...ord,
    orderNumber: ord.orderNumber || 'HI-' + Math.floor(10000 + Math.random() * 90000),
    orderStatus: status,
    status: status,
    paymentStatus: paymentStatus,
    paymentMethod: ord.paymentMethod || 'Cash on Delivery',
    subtotal: subtotal,
    itemsPrice: subtotal,
    deliveryCharges: delivery,
    deliveryFee: delivery,
    total: total,
    totalAmount: total,
    items: items,
    createdAt: ord.createdAt || new Date().toISOString(),
    customer: {
      name: ord.customer?.name || 'Walk-in Customer',
      phone: ord.customer?.phone || '+92 300 0000000',
      email: ord.customer?.email || '',
      city: ord.customer?.city || 'Hyderabad',
      address: ord.customer?.address || 'Near Store, Hyderabad',
      notes: ord.customer?.notes || ord.notes || '',
    },
    notes: ord.notes || ord.customer?.notes || '',
  };
};

const DEFAULT_ORDERS = [
  {
    _id: 'ord_1',
    orderNumber: 'HI-98421',
    createdAt: new Date().toISOString(),
    orderStatus: 'Processing',
    status: 'Processing',
    subtotal: 15580,
    itemsPrice: 15580,
    deliveryCharges: 250,
    deliveryFee: 250,
    total: 15830,
    totalAmount: 15830,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
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
    notes: 'Please call before delivery',
    items: [
      {
        name: 'Shell Helix Ultra 5W-40 (4L)',
        quantity: 2,
        price: 7790,
        subtotal: 15580,
        unit: 'Bottle (4 Litres)',
        viscosity: '5W-40 Fully Synthetic',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    _id: 'ord_2',
    orderNumber: 'HI-98420',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    orderStatus: 'Confirmed',
    status: 'Confirmed',
    subtotal: 7400,
    itemsPrice: 7400,
    deliveryCharges: 0,
    deliveryFee: 0,
    total: 7400,
    totalAmount: 7400,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
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
    notes: 'Deliver during shop hours',
    items: [
      {
        name: 'Caltex Havoline ProDS 5W-30 (4L)',
        quantity: 1,
        price: 7400,
        subtotal: 7400,
        unit: 'Bottle (4 Litres)',
        viscosity: '5W-30 Synthetic',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    _id: 'ord_3',
    orderNumber: 'HI-98419',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    orderStatus: 'Delivered',
    status: 'Delivered',
    subtotal: 8500,
    itemsPrice: 8500,
    deliveryCharges: 0,
    deliveryFee: 0,
    total: 8500,
    totalAmount: 8500,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
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
    notes: 'Leave at front gate',
    items: [
      {
        name: 'Honda Genuine OEM 0W-20 (4L)',
        quantity: 1,
        price: 8500,
        subtotal: 8500,
        unit: 'Bottle (4 Litres)',
        viscosity: '0W-20 Genuine OEM',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
];

const getStoredOrders = () => {
  const saved = localStorage.getItem('hi_store_orders');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeOrder);
      }
    } catch (e) {}
  }
  const initial = DEFAULT_ORDERS.map(normalizeOrder);
  localStorage.setItem('hi_store_orders', JSON.stringify(initial));
  return initial;
};

const saveStoredOrders = (orders) => {
  try {
    const normalized = (orders || []).map(normalizeOrder);
    localStorage.setItem('hi_store_orders', JSON.stringify(normalized));
  } catch (e) {}
};

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      if (response.data?.order) {
        const normalized = normalizeOrder(response.data.order);
        const list = getStoredOrders();
        list.unshift(normalized);
        saveStoredOrders(list);
        return { ...response.data, order: normalized };
      }
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const newOrder = normalizeOrder({
        ...orderData,
        _id: 'ord_' + Date.now(),
        orderNumber: 'HI-' + Math.floor(10000 + Math.random() * 90000),
        createdAt: new Date().toISOString(),
        orderStatus: 'Pending',
        status: 'Pending',
        paymentStatus: 'Unpaid',
      });
      list.unshift(newOrder);
      saveStoredOrders(list);
      return { success: true, order: newOrder, message: 'Order created successfully' };
    }
  },

  trackOrder: async (trackingData) => {
    try {
      const response = await api.post('/orders/track', trackingData);
      if (response.data?.order) {
        return { ...response.data, order: normalizeOrder(response.data.order) };
      }
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
        return { success: true, order: normalizeOrder(found) };
      }
      throw new Error('No matching order found with the provided details.');
    }
  },

  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/lookup/${orderNumber}`);
      if (response.data?.order) {
        return { ...response.data, order: normalizeOrder(response.data.order) };
      }
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const found = list.find((o) => o.orderNumber?.toUpperCase() === orderNumber?.toUpperCase());
      if (found) return { success: true, order: normalizeOrder(found) };
      throw err;
    }
  },

  getAdminOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders/admin', { params });
      if (response.data?.orders) {
        const normalizedList = response.data.orders.map(normalizeOrder);
        saveStoredOrders(normalizedList);
        return {
          ...response.data,
          orders: normalizedList,
        };
      }
      return response.data;
    } catch (err) {
      let list = getStoredOrders();
      if (params.status && params.status !== 'all') {
        const targetStatus = params.status.toLowerCase();
        list = list.filter((o) => (o.orderStatus || o.status || '').toLowerCase() === targetStatus);
      }
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        const targetPay = params.paymentStatus.toLowerCase();
        list = list.filter((o) => (o.paymentStatus || '').toLowerCase() === targetPay);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (o) =>
            o.orderNumber?.toLowerCase().includes(s) ||
            o.customer?.name?.toLowerCase().includes(s) ||
            o.customer?.phone?.includes(s) ||
            o.customer?.city?.toLowerCase().includes(s)
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
      if (response.data?.order) {
        return { ...response.data, order: normalizeOrder(response.data.order) };
      }
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const found = list.find((o) => o._id === id);
      if (found) return { success: true, order: normalizeOrder(found) };
      throw err;
    }
  },

  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/orders/admin/${id}/status`, statusData);
      if (response.data?.order) {
        const updated = normalizeOrder(response.data.order);
        const list = getStoredOrders();
        const idx = list.findIndex((o) => o._id === id);
        if (idx !== -1) {
          list[idx] = updated;
          saveStoredOrders(list);
        }
        return { ...response.data, order: updated };
      }
      return response.data;
    } catch (err) {
      const list = getStoredOrders();
      const idx = list.findIndex((o) => o._id === id);
      if (idx !== -1) {
        list[idx] = normalizeOrder({
          ...list[idx],
          orderStatus: statusData.status || list[idx].orderStatus,
          status: statusData.status || list[idx].status,
          paymentStatus: statusData.paymentStatus || list[idx].paymentStatus,
          adminNotes: statusData.adminNotes !== undefined ? statusData.adminNotes : list[idx].adminNotes,
          estimatedDeliveryDate: statusData.estimatedDeliveryDate || list[idx].estimatedDeliveryDate,
        });
        saveStoredOrders(list);
        return { success: true, order: list[idx], message: 'Status updated successfully' };
      }
      throw err;
    }
  },
};
