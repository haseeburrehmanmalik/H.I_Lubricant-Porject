import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  AlertCircle,
  Eye,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import { productService } from '../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Shell',
    category: 'Passenger Car Motor Oil',
    viscosity: '5W-30',
    volume: '4 Litres',
    price: '',
    originalPrice: '',
    stock: '',
    lowStockThreshold: 5,
    images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'],
    description: '',
    keyBenefits: '',
    featured: false,
    isActive: true,
  });

  const brands = ['Shell', 'Caltex', 'PSO', 'Honda', 'Blaze', 'ZIC', 'Total'];
  const categories = [
    'Passenger Car Motor Oil',
    'Heavy Duty Diesel Oil',
    'Motorcycle & 4T Oils',
    'Gear & Transmission Oil',
    'Coolants & Brake Fluids',
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        search,
        brand: brandFilter !== 'all' ? brandFilter : undefined,
        all: 'true',
        includeInactive: 'true',
      });
      if (res.success) {
        setProducts(res.products || []);
        setTotal(res.count || res.products?.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, brandFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'Shell',
      category: 'Passenger Car Motor Oil',
      viscosity: '5W-30',
      volume: '4 Litres',
      price: '',
      originalPrice: '',
      stock: '20',
      lowStockThreshold: 5,
      images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'],
      description: '',
      keyBenefits: 'Superior engine cleanliness\nEnhanced fuel economy\nExtreme thermal stability',
      featured: false,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      viscosity: product.viscosity,
      volume: product.volume || '4 Litres',
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 5,
      images: product.images && product.images.length > 0 ? product.images : [''],
      description: product.description,
      keyBenefits: Array.isArray(product.keyBenefits) ? product.keyBenefits.join('\n') : '',
      featured: product.featured,
      isActive: product.isActive,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await productService.uploadImage(data);
      if (res.success && res.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          images: [res.imageUrl, ...prev.images.filter((img) => img !== res.imageUrl)],
        }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.price || !formData.viscosity) {
      setFormError('Please enter product name, price, and viscosity');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock) || 0,
      lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      keyBenefits: formData.keyBenefits
        ? formData.keyBenefits.split('\n').map((b) => b.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
      } else {
        await productService.createProduct(payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      setFormError(err.response?.data?.message || 'Failed to save product in database.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from MongoDB database?`)) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Create, edit, upload images, and control inventory for all automotive lubricants ({total} items in database).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold flex items-center space-x-2 shadow-gold-sm"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or viscosity..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-[#A5A19A]">Brand:</span>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292722] bg-[#191919] text-[#A5A19A]">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Brand</th>
                <th className="py-3 px-4 font-semibold">Viscosity</th>
                <th className="py-3 px-4 font-semibold">Price (PKR)</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292722]/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#A5A19A]">
                    Loading products from database...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= (p.lowStockThreshold || 5);
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p._id} className="hover:bg-[#191919]/50 transition-colors">
                      {/* Product Name & Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#292722] p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'}
                              alt={p.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#F5F2EA] line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-[#A5A19A]">
                              {p.volume || '4L'} • {p.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-3 px-4 font-semibold text-[#D7AD55]">{p.brand}</td>

                      {/* Viscosity */}
                      <td className="py-3 px-4 font-bold text-[#F5F2EA]">{p.viscosity}</td>

                      {/* Price */}
                      <td className="py-3 px-4 font-extrabold text-[#D7AD55]">
                        Rs. {p.price?.toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            isOut
                              ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                              : isLow
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                              : 'text-emerald-400'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      {/* Active & Featured */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          {p.isActive ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-gray-500" title="Inactive"></span>
                          )}
                          {p.featured && (
                            <span className="px-1.5 py-0.2 rounded bg-[#D7AD55]/20 text-[#D7AD55] text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-[#A5A19A] hover:text-[#D7AD55] transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#A5A19A]">
                    No products found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#141414] border border-[#292722] rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <h2 className="text-lg font-bold text-[#F5F2EA]">
                {editingProduct ? 'Edit Lubricant Product' : 'Add New Automotive Lubricant'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A5A19A] hover:text-[#F5F2EA]"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center space-x-2 text-red-300 text-xs">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#A5A19A]">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shell Helix Ultra PurePlus Fully Synthetic"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Viscosity & Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Viscosity Grade *</label>
                  <input
                    type="text"
                    value={formData.viscosity}
                    onChange={(e) => setFormData({ ...formData, viscosity: e.target.value })}
                    placeholder="e.g. 5W-30, 0W-20, 20W-50"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Package Volume</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    placeholder="e.g. 4 Litres, 1 Litre"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  />
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Price in PKR *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 9800"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Original Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 10500"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#A5A19A]">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 25"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div className="space-y-2">
                <label className="font-bold text-[#A5A19A]">Product Image</label>
                <div className="flex items-center space-x-3">
                  <label className="px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#D7AD55] cursor-pointer flex items-center space-x-1.5">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="Or enter image URL..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#A5A19A]">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Engine oil specifications, applications, and technology..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                ></textarea>
              </div>

              {/* Key Benefits */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#A5A19A]">Key Benefits (One per line)</label>
                <textarea
                  rows={2}
                  value={formData.keyBenefits}
                  onChange={(e) => setFormData({ ...formData, keyBenefits: e.target.value })}
                  placeholder="e.g. Extreme thermal stability&#10;Unsurpassed sludge cleansing"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                ></textarea>
              </div>

              {/* Featured & Active Checkboxes */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 font-semibold text-[#F5F2EA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-[#D7AD55]"
                  />
                  <span>Mark as Featured Product</span>
                </label>

                <label className="flex items-center space-x-2 font-semibold text-[#F5F2EA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-[#D7AD55]"
                  />
                  <span>Active & Visible in Shop</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#292722]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs font-semibold text-[#A5A19A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold shadow-gold-sm"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product in Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
