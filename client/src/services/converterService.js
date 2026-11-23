import api from './api';

const DEFAULT_CONVERTERS = [
  {
    _id: 'conv_1',
    converterNumber: 1,
    slotNumber: 1,
    name: 'Converter 01 (Caltex Open Oil)',
    description: 'Caltex Delo & Havoline premium open lubricants per litre.',
    brand: 'Caltex',
    productAssociation: 'Caltex Havoline Open Oil',
    pricePerLitre: 1450,
    availableLitres: 450,
    availableQuantity: 450,
    minimumQuantity: 1,
    maximumQuantity: 200,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_2',
    converterNumber: 2,
    slotNumber: 2,
    name: 'Converter 02 (PSO Open Oil)',
    description: 'Pakistan State Oil premier Carient & DEO bulk open oil.',
    brand: 'PSO',
    productAssociation: 'PSO Carient Open Oil',
    pricePerLitre: 1350,
    availableLitres: 600,
    availableQuantity: 600,
    minimumQuantity: 1,
    maximumQuantity: 300,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_3',
    converterNumber: 3,
    slotNumber: 3,
    name: 'Converter 03 (Shell Open Oil)',
    description: 'Shell Helix & Rimula PurePlus technology open engine oil.',
    brand: 'Shell',
    productAssociation: 'Shell Helix Open Oil',
    pricePerLitre: 1550,
    availableLitres: 500,
    availableQuantity: 500,
    minimumQuantity: 1,
    maximumQuantity: 250,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_4',
    converterNumber: 4,
    slotNumber: 4,
    name: 'Converter 04 (Honda Oil)',
    description: 'Genuine OEM Engine Oil formulated for Honda VTEC engines.',
    brand: 'Honda',
    productAssociation: 'Honda Genuine Open Oil',
    pricePerLitre: 1850,
    availableLitres: 350,
    availableQuantity: 350,
    minimumQuantity: 1,
    maximumQuantity: 150,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_5',
    converterNumber: 5,
    slotNumber: 5,
    name: 'Converter 05 (Blaze Oil)',
    description: 'Blaze heavy-duty thermal endurance synthetic motor oil.',
    brand: 'Blaze',
    productAssociation: 'Blaze Synthetic Open Oil',
    pricePerLitre: 1250,
    availableLitres: 400,
    availableQuantity: 400,
    minimumQuantity: 1,
    maximumQuantity: 200,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_6',
    converterNumber: 6,
    slotNumber: 6,
    name: 'Converter 06 (Motorcycle Oil)',
    description: '4-Stroke motorcycle engine oil for Honda, Yamaha, Suzuki bikes.',
    brand: 'Shell',
    productAssociation: 'Shell Advance 4T Open Oil',
    pricePerLitre: 1150,
    availableLitres: 300,
    availableQuantity: 300,
    minimumQuantity: 0.7,
    maximumQuantity: 50,
    quantityIncrement: 0.1,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_7',
    converterNumber: 7,
    slotNumber: 7,
    name: 'Converter 07 (Engine Oil)',
    description: 'High performance multi-grade automotive engine oil.',
    brand: 'ZIC',
    productAssociation: 'ZIC X7 Open Oil',
    pricePerLitre: 1600,
    availableLitres: 280,
    availableQuantity: 280,
    minimumQuantity: 1,
    maximumQuantity: 100,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_8',
    converterNumber: 8,
    slotNumber: 8,
    name: 'Converter 08 (Gear Oil)',
    description: 'Extreme pressure manual transmission & differential gear oil.',
    brand: 'Caltex',
    productAssociation: 'Caltex Thuban GL-5 Open Oil',
    pricePerLitre: 1750,
    availableLitres: 220,
    availableQuantity: 220,
    minimumQuantity: 1,
    maximumQuantity: 100,
    quantityIncrement: 0.5,
    unit: 'L',
    packagingType: 'Open Oil Dispenser',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_9',
    converterNumber: 9,
    slotNumber: 9,
    name: 'Converter 09 (Drum Oil)',
    description: 'Industrial and commercial fleet drum lubricant wholesale.',
    brand: 'PSO',
    productAssociation: 'PSO Fleet DEO Drum Oil',
    pricePerLitre: 1200,
    availableLitres: 1200,
    availableQuantity: 1200,
    minimumQuantity: 10,
    maximumQuantity: 1000,
    quantityIncrement: 5,
    unit: 'L',
    packagingType: '208L Steel Drum',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'conv_10',
    converterNumber: 10,
    slotNumber: 10,
    name: 'Converter 10 (Custom Oil Converter)',
    description: 'Configurable custom formulation for commercial and fleet engines.',
    brand: 'Other',
    productAssociation: 'Custom Fleet Blend',
    pricePerLitre: 1500,
    availableLitres: 500,
    availableQuantity: 500,
    minimumQuantity: 1,
    maximumQuantity: 500,
    quantityIncrement: 1,
    unit: 'L',
    packagingType: 'Custom Container',
    enabled: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  },
];

const STORAGE_KEY = 'hi_oil_converters';

const normalizeConverter = (c, index = 0) => {
  const num = c.converterNumber || c.slotNumber || (index + 1);
  return {
    ...c,
    _id: c._id || `conv_${num}`,
    converterNumber: num,
    slotNumber: num,
    availableLitres: c.availableLitres ?? c.availableQuantity ?? 500,
    availableQuantity: c.availableQuantity ?? c.availableLitres ?? 500,
    unit: c.unit || 'L',
    enabled: c.enabled !== false,
  };
};

const getStoredConverters = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((c, i) => normalizeConverter(c, i));
      }
    } catch (e) {
      console.warn('Failed to parse saved converters:', e);
    }
  }
  const initial = DEFAULT_CONVERTERS.map((c, i) => normalizeConverter(c, i));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveStoredConverters = (converters) => {
  try {
    const normalized = (converters || []).map((c, i) => normalizeConverter(c, i));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (e) {
    console.warn('Failed to save converters to localStorage:', e);
  }
};

const removeConverterFromStorage = (id) => {
  const idStr = String(id || '').trim();
  let list = getStoredConverters();
  list = list.filter((c) => {
    const cIdStr = String(c._id || '').trim();
    const cNumStr = String(c.converterNumber || c.slotNumber || '').trim();
    return cIdStr !== idStr && cNumStr !== idStr;
  });
  saveStoredConverters(list);
  return list;
};

export const converterService = {
  // Public - active converters for customer page & calculator
  getPublicConverters: async (params = {}) => {
    try {
      const response = await api.get('/oil-converters', { params });
      if (response.data?.converters) {
        saveStoredConverters(response.data.converters);
        return {
          ...response.data,
          converters: response.data.converters.map((c, i) => normalizeConverter(c, i)),
        };
      }
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
      const idStr = String(id || '').trim();
      const found = list.find((c) => {
        const cIdStr = String(c._id || '').trim();
        const cNumStr = String(c.converterNumber || c.slotNumber || '').trim();
        return cIdStr === idStr || cNumStr === idStr;
      });
      if (found) return { success: true, converter: found };
      throw err;
    }
  },

  // Admin - get all converters with search/filter/sort
  getAdminConverters: async (params = {}) => {
    try {
      const response = await api.get('/admin/oil-converters', { params });
      if (response.data?.converters) {
        saveStoredConverters(response.data.converters);
        return {
          ...response.data,
          converters: response.data.converters.map((c, i) => normalizeConverter(c, i)),
        };
      }
      return response.data;
    } catch (err) {
      let list = getStoredConverters();
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (c) =>
            (c.name && c.name.toLowerCase().includes(s)) ||
            (c.brand && c.brand.toLowerCase().includes(s))
        );
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
    let createdItem = null;
    try {
      const response = await api.post('/admin/oil-converters', data);
      if (response.data?.converter) {
        createdItem = normalizeConverter(response.data.converter);
      }
    } catch (err) {
      // Offline / GitHub Pages fallback
    }

    const list = getStoredConverters();
    if (!createdItem) {
      const nextNum = list.reduce((max, c) => Math.max(max, c.converterNumber || 0), 0) + 1;
      createdItem = normalizeConverter({
        ...data,
        _id: 'conv_' + Date.now(),
        converterNumber: nextNum,
        slotNumber: nextNum,
        availableLitres: parseFloat(data.availableLitres || data.availableQuantity || 500),
        enabled: data.enabled !== undefined ? Boolean(data.enabled) : true,
      });
    }

    list.push(createdItem);
    saveStoredConverters(list);
    return { success: true, converter: createdItem, message: 'Converter created successfully!' };
  },

  // Admin - update a converter configuration
  updateConverter: async (id, data) => {
    let updatedItem = null;
    try {
      const response = await api.put(`/admin/oil-converters/${id}`, data);
      if (response.data?.converter) {
        updatedItem = normalizeConverter(response.data.converter);
      }
    } catch (err) {
      // Offline / GitHub Pages fallback
    }

    const list = getStoredConverters();
    const idStr = String(id || '').trim();
    const idx = list.findIndex((c) => {
      const cIdStr = String(c._id || '').trim();
      const cNumStr = String(c.converterNumber || c.slotNumber || '').trim();
      return cIdStr === idStr || cNumStr === idStr;
    });

    if (idx !== -1) {
      list[idx] = normalizeConverter(updatedItem || { ...list[idx], ...data }, idx);
      saveStoredConverters(list);
      return { success: true, converter: list[idx], message: 'Converter updated successfully!' };
    }

    return { success: true, message: 'Saved successfully' };
  },

  // Admin - toggle enabled status
  toggleStatus: async (id, enabled) => {
    try {
      await api.patch(`/admin/oil-converters/${id}/status`, { enabled });
    } catch (err) {
      // Offline / GitHub Pages fallback
    }

    const list = getStoredConverters();
    const idStr = String(id || '').trim();
    const idx = list.findIndex((c) => {
      const cIdStr = String(c._id || '').trim();
      const cNumStr = String(c.converterNumber || c.slotNumber || '').trim();
      return cIdStr === idStr || cNumStr === idStr;
    });

    if (idx !== -1) {
      list[idx].enabled = Boolean(enabled);
      saveStoredConverters(list);
      return {
        success: true,
        converter: list[idx],
        message: `Converter ${enabled ? 'activated' : 'disabled'}`,
      };
    }
    return { success: true };
  },

  // Admin - safe delete a converter
  deleteConverter: async (id) => {
    // 1. Always purge from localStorage cache immediately
    removeConverterFromStorage(id);

    // 2. Try backend API call if online
    try {
      const response = await api.delete(`/admin/oil-converters/${id}`);
      return response.data || { success: true, message: 'Converter deleted successfully.' };
    } catch (err) {
      // Even if backend is not reachable (e.g. GitHub Pages), the item is safely deleted in local state
      return { success: true, message: 'Converter deleted successfully.' };
    }
  },
};
