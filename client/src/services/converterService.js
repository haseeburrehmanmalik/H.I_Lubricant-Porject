import api from './api';

const DEFAULT_CONVERTERS = [
  {
    _id: 'conv_1',
    slotNumber: 1,
    name: 'Converter 01 (Caltex Open Oil)',
    description: 'Caltex Delo & Havoline premium open lubricants per litre.',
    brand: 'Caltex',
    productAssociation: 'Caltex Havoline Open Oil',
    pricePerLitre: 1450,
    availableQuantity: 450,
    minimumQuantity: 1,
    maximumQuantity: 200,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_2',
    slotNumber: 2,
    name: 'Converter 02 (PSO Open Oil)',
    description: 'Pakistan State Oil premier Carient & DEO bulk open oil.',
    brand: 'PSO',
    productAssociation: 'PSO Carient Open Oil',
    pricePerLitre: 1350,
    availableQuantity: 600,
    minimumQuantity: 1,
    maximumQuantity: 300,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_3',
    slotNumber: 3,
    name: 'Converter 03 (Shell Open Oil)',
    description: 'Shell Helix & Rimula PurePlus technology open engine oil.',
    brand: 'Shell',
    productAssociation: 'Shell Helix Open Oil',
    pricePerLitre: 1550,
    availableQuantity: 500,
    minimumQuantity: 1,
    maximumQuantity: 250,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_4',
    slotNumber: 4,
    name: 'Converter 04 (Honda Oil)',
    description: 'Genuine OEM Engine Oil formulated for Honda VTEC engines.',
    brand: 'Honda',
    productAssociation: 'Honda Genuine Open Oil',
    pricePerLitre: 1850,
    availableQuantity: 350,
    minimumQuantity: 1,
    maximumQuantity: 150,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_5',
    slotNumber: 5,
    name: 'Converter 05 (Blaze Oil)',
    description: 'Blaze heavy-duty thermal endurance synthetic motor oil.',
    brand: 'Blaze',
    productAssociation: 'Blaze Synthetic Open Oil',
    pricePerLitre: 1250,
    availableQuantity: 400,
    minimumQuantity: 1,
    maximumQuantity: 200,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_6',
    slotNumber: 6,
    name: 'Converter 06 (Motorcycle Oil)',
    description: '4-Stroke motorcycle engine oil for Honda, Yamaha, Suzuki bikes.',
    brand: 'Shell',
    productAssociation: 'Shell Advance 4T Open Oil',
    pricePerLitre: 1150,
    availableQuantity: 300,
    minimumQuantity: 0.7,
    maximumQuantity: 50,
    quantityIncrement: 0.1,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_7',
    slotNumber: 7,
    name: 'Converter 07 (Engine Oil)',
    description: 'High performance multi-grade automotive engine oil.',
    brand: 'ZIC',
    productAssociation: 'ZIC X7 Open Oil',
    pricePerLitre: 1600,
    availableQuantity: 280,
    minimumQuantity: 1,
    maximumQuantity: 100,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_8',
    slotNumber: 8,
    name: 'Converter 08 (Gear Oil)',
    description: 'Extreme pressure manual transmission & differential gear oil.',
    brand: 'Caltex',
    productAssociation: 'Caltex Thuban GL-5 Open Oil',
    pricePerLitre: 1750,
    availableQuantity: 220,
    minimumQuantity: 1,
    maximumQuantity: 100,
    quantityIncrement: 0.5,
    unit: 'Litre',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
  },
  {
    _id: 'conv_9',
    slotNumber: 9,
    name: 'Converter 09 (Drum Oil)',
    description: 'Industrial and commercial fleet drum lubricant wholesale.',
    brand: 'PSO',
    productAssociation: 'PSO Fleet DEO Drum Oil',
    pricePerLitre: 1200,
    availableQuantity: 1200,
    minimumQuantity: 10,
    maximumQuantity: 1000,
    quantityIncrement: 5,
    unit: 'Litre',
    packagingType: '208L Steel Drum',
    enabled: true,
  },
  {
    _id: 'conv_10',
    slotNumber: 10,
    name: 'Converter 10 (Custom Oil Converter)',
    description: 'Configurable custom formulation for commercial and fleet engines.',
    brand: 'Other',
    productAssociation: 'Custom Fleet Blend',
    pricePerLitre: 1500,
    availableQuantity: 500,
    minimumQuantity: 1,
    maximumQuantity: 500,
    quantityIncrement: 1,
    unit: 'Litre',
    packagingType: 'Custom Container',
    enabled: true,
  },
];

const getStoredConverters = () => {
  const saved = localStorage.getItem('hi_oil_converters');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved converters:', e);
    }
  }
  localStorage.setItem('hi_oil_converters', JSON.stringify(DEFAULT_CONVERTERS));
  return DEFAULT_CONVERTERS;
};

const saveStoredConverters = (converters) => {
  localStorage.setItem('hi_oil_converters', JSON.stringify(converters));
};

export const converterService = {
  // Public - active converters for customer page & calculator
  getPublicConverters: async (params = {}) => {
    try {
      const response = await api.get('/oil-converters', { params });
      return response.data;
    } catch (err) {
      const list = getStoredConverters().filter((c) => c.enabled !== false);
      return { success: true, count: list.length, converters: list };
    }
  },

  // Public - get single converter details
  getConverterById: async (id) => {
    try {
      const response = await api.get(`/oil-converters/${id}`);
      return response.data;
    } catch (err) {
      const list = getStoredConverters();
      const found = list.find((c) => c._id === id || c.slotNumber === Number(id));
      if (found) return { success: true, converter: found };
      throw err;
    }
  },

  // Admin - get all converters with search/filter/sort
  getAdminConverters: async (params = {}) => {
    try {
      const response = await api.get('/admin/oil-converters', { params });
      return response.data;
    } catch (err) {
      let list = getStoredConverters();
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter((c) => c.name.toLowerCase().includes(s) || c.brand.toLowerCase().includes(s));
      }
      if (params.status === 'active') {
        list = list.filter((c) => c.enabled);
      } else if (params.status === 'disabled') {
        list = list.filter((c) => !c.enabled);
      }
      return {
        success: true,
        total: list.length,
        stats: {
          total: list.length,
          active: list.filter((c) => c.enabled).length,
          disabled: list.filter((c) => !c.enabled).length,
        },
        converters: list,
      };
    }
  },

  // Admin - create a new converter slot
  createConverter: async (data) => {
    try {
      const response = await api.post('/admin/oil-converters', data);
      return response.data;
    } catch (err) {
      const list = getStoredConverters();
      const newSlot = {
        ...data,
        _id: 'conv_' + Date.now(),
        slotNumber: list.length + 1,
        enabled: data.enabled !== undefined ? data.enabled : true,
      };
      list.push(newSlot);
      saveStoredConverters(list);
      return { success: true, converter: newSlot, message: 'Converter created successfully!' };
    }
  },

  // Admin - update a converter configuration
  updateConverter: async (id, data) => {
    try {
      const response = await api.put(`/admin/oil-converters/${id}`, data);
      return response.data;
    } catch (err) {
      const list = getStoredConverters();
      const idx = list.findIndex((c) => c._id === id || c.slotNumber === Number(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        saveStoredConverters(list);
        return { success: true, converter: list[idx], message: 'Converter updated successfully!' };
      }
      return { success: true, message: 'Saved successfully' };
    }
  },

  // Admin - toggle enabled status
  toggleStatus: async (id, enabled) => {
    try {
      const response = await api.patch(`/admin/oil-converters/${id}/status`, { enabled });
      return response.data;
    } catch (err) {
      const list = getStoredConverters();
      const idx = list.findIndex((c) => c._id === id || c.slotNumber === Number(id));
      if (idx !== -1) {
        list[idx].enabled = enabled;
        saveStoredConverters(list);
        return { success: true, converter: list[idx], message: `Converter ${enabled ? 'activated' : 'disabled'}` };
      }
      return { success: true };
    }
  },

  // Admin - safe delete a converter
  deleteConverter: async (id) => {
    try {
      const response = await api.delete(`/admin/oil-converters/${id}`);
      return response.data;
    } catch (err) {
      let list = getStoredConverters();
      list = list.filter((c) => c._id !== id && c.slotNumber !== Number(id));
      saveStoredConverters(list);
      return { success: true, message: 'Converter removed successfully' };
    }
  },
};
