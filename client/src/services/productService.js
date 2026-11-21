import api from './api';

const DEFAULT_PRODUCTS = [
  {
    _id: 'prod_1',
    name: 'Shell Helix Ultra 5W-40 (4L)',
    slug: 'shell-helix-ultra-5w-40-4l',
    sku: 'SHL-HXU-5W40-4L',
    brand: { name: 'Shell', slug: 'shell' },
    category: { name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
    price: 8200,
    discountPrice: 7790,
    stock: 45,
    unit: 'Bottle (4 Litres)',
    viscosity: '5W-40',
    oilType: 'Full Synthetic',
    featured: true,
    rating: 4.9,
    numReviews: 28,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    description: 'Shell PurePlus Technology natural gas synthesis formulation. Maximum cleaning, wear protection and deposit defense for luxury and high-performance engines.',
  },
  {
    _id: 'prod_2',
    name: 'Caltex Havoline ProDS 5W-30 Fully Synthetic (4L)',
    slug: 'caltex-havoline-prods-5w-30-4l',
    sku: 'CTX-HAV-5W30-4L',
    brand: { name: 'Caltex', slug: 'caltex' },
    category: { name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
    price: 7800,
    discountPrice: 7400,
    stock: 38,
    unit: 'Bottle (4 Litres)',
    viscosity: '5W-30',
    oilType: 'Full Synthetic',
    featured: true,
    rating: 4.8,
    numReviews: 22,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    description: 'Deposit Shield technology delivers uninterrupted protection against engine sludge and thermal degradation. Recommended for modern turbocharged engines.',
  },
  {
    _id: 'prod_3',
    name: 'PSO Carient S-Pro 5W-30 Premium Synthetic (4L)',
    slug: 'pso-carient-s-pro-5w-30-4l',
    sku: 'PSO-CAR-5W30-4L',
    brand: { name: 'PSO', slug: 'pso' },
    category: { name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
    price: 7200,
    discountPrice: 6850,
    stock: 50,
    unit: 'Bottle (4 Litres)',
    viscosity: '5W-30',
    oilType: 'Full Synthetic',
    featured: true,
    rating: 4.7,
    numReviews: 35,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    description: 'Pakistan State Oil flagship synthetic lubricant engineered specifically for local ambient temperatures and fuel characteristics.',
  },
  {
    _id: 'prod_4',
    name: 'Honda Genuine OEM Engine Oil 0W-20 (4L)',
    slug: 'honda-genuine-oem-0w-20-4l',
    sku: 'HON-OEM-0W20-4L',
    brand: { name: 'Honda', slug: 'honda' },
    category: { name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
    price: 8900,
    discountPrice: 8500,
    stock: 25,
    unit: 'Bottle (4 Litres)',
    viscosity: '0W-20',
    oilType: 'Full Synthetic',
    featured: true,
    rating: 5.0,
    numReviews: 41,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    description: 'Official factory OEM Honda formulation for Civic, City, BR-V, HR-V, and Vezel. Maximizes fuel economy and engine quietness.',
  },
  {
    _id: 'prod_5',
    name: 'ZIC X7 5W-30 Synthetic (4L)',
    slug: 'zic-x7-5w-30-4l',
    sku: 'ZIC-X7-5W30-4L',
    brand: { name: 'ZIC', slug: 'zic' },
    category: { name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
    price: 6800,
    discountPrice: 6450,
    stock: 30,
    unit: 'Bottle (4 Litres)',
    viscosity: '5W-30',
    oilType: 'Synthetic',
    featured: true,
    rating: 4.8,
    numReviews: 19,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    description: 'YUBASE Group III synthetic base stock from SK Enmove Korea. Provides ultra-stable molecular viscosity across extreme operating heats.',
  },
  {
    _id: 'prod_6',
    name: 'Blaze Endurance 10W-40 Heavy Duty (4L)',
    slug: 'blaze-endurance-10w-40-4l',
    sku: 'BLZ-END-10W40-4L',
    brand: { name: 'Blaze', slug: 'blaze' },
    category: { name: 'Heavy Duty Diesel Oil', slug: 'heavy-duty-diesel-oil' },
    price: 4800,
    discountPrice: 4500,
    stock: 60,
    unit: 'Bottle (4 Litres)',
    viscosity: '10W-40',
    oilType: 'Semi-Synthetic',
    featured: true,
    rating: 4.6,
    numReviews: 14,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    description: 'High thermal endurance semi-synthetic formulation for commercial vans, pickups, and heavy duty highway transit vehicles.',
  },
  {
    _id: 'prod_7',
    name: 'Shell Advance 4T AX7 10W-40 Synthetic (1L)',
    slug: 'shell-advance-4t-ax7-10w-40-1l',
    sku: 'SHL-ADV-10W40-1L',
    brand: { name: 'Shell', slug: 'shell' },
    category: { name: 'Motorcycle & 4T Oils', slug: 'motorcycle-4t-oils' },
    price: 1550,
    discountPrice: 1450,
    stock: 120,
    unit: 'Bottle (1 Litre)',
    viscosity: '10W-40',
    oilType: 'Synthetic Based',
    featured: true,
    rating: 4.9,
    numReviews: 53,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    description: 'RCE technology (Reliability, Control, Enjoyment). Smooth clutch engagement and high gear protection for 70cc, 125cc, 150cc motorcycles.',
  },
  {
    _id: 'prod_8',
    name: 'Total Quartz 9000 Energy 5W-40 (4L)',
    slug: 'total-quartz-9000-5w-40-4l',
    sku: 'TOT-QTZ-5W40-4L',
    brand: { name: 'Total', slug: 'total' },
    category: { name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
    price: 7600,
    discountPrice: 7200,
    stock: 22,
    unit: 'Bottle (4 Litres)',
    viscosity: '5W-40',
    oilType: 'Full Synthetic',
    featured: true,
    rating: 4.7,
    numReviews: 17,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    description: 'Age Resistance Technology (ART) with reinforced molecules provides superior antioxidant stability and extended drain intervals.',
  },
];

const getStoredProducts = () => {
  const saved = localStorage.getItem('hi_store_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  localStorage.setItem('hi_store_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
};

const saveStoredProducts = (products) => {
  localStorage.setItem('hi_store_products', JSON.stringify(products));
};

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (err) {
      let list = getStoredProducts();
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(s) || p.brand.name.toLowerCase().includes(s));
      }
      if (params.brand && params.brand !== 'all' && params.brand !== 'All') {
        list = list.filter((p) => p.brand.name.toLowerCase() === params.brand.toLowerCase());
      }
      if (params.category && params.category !== 'all' && params.category !== 'All') {
        list = list.filter((p) => p.category.name.toLowerCase() === params.category.toLowerCase());
      }
      if (params.viscosity && params.viscosity !== 'all' && params.viscosity !== 'All') {
        list = list.filter((p) => p.viscosity === params.viscosity);
      }
      if (params.featured === 'true') {
        list = list.filter((p) => p.featured);
      }
      return {
        success: true,
        count: list.length,
        total: list.length,
        pages: 1,
        currentPage: 1,
        products: list,
      };
    }
  },

  getProduct: async (identifier) => {
    try {
      const response = await api.get(`/products/${identifier}`);
      return response.data;
    } catch (err) {
      const list = getStoredProducts();
      const product = list.find((p) => p._id === identifier || p.slug === identifier);
      if (product) return { success: true, product };
      throw err;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (err) {
      const list = getStoredProducts();
      const newP = {
        ...productData,
        _id: 'prod_' + Date.now(),
        slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: { name: productData.brand || 'H.I Lubricant' },
        category: { name: productData.category || 'Engine Oil' },
      };
      list.push(newP);
      saveStoredProducts(list);
      return { success: true, product: newP, message: 'Product created successfully' };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (err) {
      const list = getStoredProducts();
      const idx = list.findIndex((p) => p._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...productData };
        saveStoredProducts(list);
        return { success: true, product: list[idx], message: 'Product updated successfully' };
      }
      return { success: true };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (err) {
      let list = getStoredProducts();
      list = list.filter((p) => p._id !== id);
      saveStoredProducts(list);
      return { success: true, message: 'Product deleted' };
    }
  },

  uploadImage: async (formData) => {
    try {
      const response = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return { success: true, imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80' };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (err) {
      return {
        success: true,
        categories: [
          { _id: 'cat-1', name: 'Passenger Car Motor Oil', slug: 'passenger-car-motor-oil' },
          { _id: 'cat-2', name: 'Heavy Duty Diesel Oil', slug: 'heavy-duty-diesel-oil' },
          { _id: 'cat-3', name: 'Motorcycle & 4T Oils', slug: 'motorcycle-4t-oils' },
          { _id: 'cat-4', name: 'Gear & Transmission Oil', slug: 'gear-transmission-oil' },
          { _id: 'cat-5', name: 'Coolants & Brake Fluids', slug: 'coolants-brake-fluids' },
        ],
      };
    }
  },

  getBrands: async () => {
    try {
      const response = await api.get('/brands');
      return response.data;
    } catch (err) {
      return {
        success: true,
        brands: [
          { _id: 'b-1', name: 'Shell', slug: 'shell' },
          { _id: 'b-2', name: 'Caltex', slug: 'caltex' },
          { _id: 'b-3', name: 'PSO', slug: 'pso' },
          { _id: 'b-4', name: 'Honda', slug: 'honda' },
          { _id: 'b-5', name: 'Blaze', slug: 'blaze' },
          { _id: 'b-6', name: 'ZIC', slug: 'zic' },
          { _id: 'b-7', name: 'Total', slug: 'total' },
        ],
      };
    }
  },
};
