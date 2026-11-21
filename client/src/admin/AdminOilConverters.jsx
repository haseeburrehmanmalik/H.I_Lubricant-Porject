import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  X,
  AlertTriangle,
  DollarSign,
  Package,
  Layers,
  Search,
  Check,
} from 'lucide-react';
import { converterService } from '../services/converterService';

const AdminOilConverters = () => {
  const [converters, setConverters] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, disabled: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'disabled'
  const [sortBy, setSortBy] = useState('number'); // 'number', 'name', 'priceAsc', 'priceDesc', 'newest'

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingConverter, setEditingConverter] = useState(null);
  const [deletingConverter, setDeletingConverter] = useState(null);
  const [previewConverter, setPreviewConverter] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const initialForm = {
    name: '',
    description: '',
    brand: 'Caltex',
    pricePerLitre: '',
    availableLitres: 500,
    minimumQuantity: 0.5,
    maximumQuantity: 200,
    quantityIncrement: 0.1,
    enabled: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchConverters = async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sortBy,
      };
      const res = await converterService.getAdminConverters(params);
      if (res.success && res.converters) {
        setConverters(res.converters);
        if (res.stats) {
          setStats(res.stats);
        } else {
          setStats({
            total: res.converters.length,
            active: res.converters.filter((c) => c.enabled).length,
            disabled: res.converters.filter((c) => !c.enabled).length,
          });
        }
      }
    } catch (err) {
      console.error('Failed to load admin converters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchConverters();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, sortBy]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenCreate = () => {
    setFormData(initialForm);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (conv) => {
    setEditingConverter(conv);
    setFormData({
      name: conv.name || '',
      description: conv.description || '',
      brand: conv.brand || '',
      pricePerLitre: conv.pricePerLitre || '',
      availableLitres: conv.availableLitres || 0,
      minimumQuantity: conv.minimumQuantity || 0.5,
      maximumQuantity: conv.maximumQuantity || 200,
      quantityIncrement: conv.quantityIncrement || 0.1,
      enabled: conv.enabled !== undefined ? conv.enabled : true,
      image: conv.image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    });
  };

  const handleToggleStatus = async (conv) => {
    try {
      const nextStatus = !conv.enabled;
      const res = await converterService.toggleStatus(conv._id, nextStatus);
      if (res.success) {
        showToast(
          `Converter #${conv.converterNumber} (${conv.name}) is now ${
            nextStatus ? 'ACTIVE' : 'DISABLED'
          }`
        );
        fetchConverters();
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Converter Name is required.');
      return;
    }
    if (!formData.pricePerLitre || parseFloat(formData.pricePerLitre) < 0) {
      alert('Please enter a valid price per litre.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await converterService.createConverter(formData);
      if (res.success) {
        showToast(`Created new Converter #${res.converter.converterNumber} (${res.converter.name})!`);
        setIsCreateOpen(false);
        fetchConverters();
      }
    } catch (err) {
      alert('Failed to create converter: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingConverter) return;
    if (!formData.name.trim()) {
      alert('Converter Name is required.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await converterService.updateConverter(editingConverter._id, formData);
      if (res.success) {
        showToast(`Saved changes for Slot #${editingConverter.converterNumber} (${formData.name})!`);
        setEditingConverter(null);
        fetchConverters();
      }
    } catch (err) {
      alert('Failed to update converter: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingConverter) return;
    setActionLoading(true);
    try {
      const res = await converterService.deleteConverter(deletingConverter._id);
      if (res.success) {
        showToast(`Converter #${deletingConverter.converterNumber} (${deletingConverter.name}) deleted.`);
        setDeletingConverter(null);
        fetchConverters();
      }
    } catch (err) {
      alert('Failed to delete converter: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs shadow-2xl flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
              Dynamic Oil Converters
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#191919] border border-[#D7AD55]/40 text-[#D7AD55] text-xs font-bold">
              Unlimited Control
            </span>
          </div>
          <p className="text-xs text-[#A5A19A] mt-1">
            Create, edit, toggle, and delete oil converters dynamically. Add unlimited bulk oil grades with custom pricing and live customer calculation.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchConverters}
            className="p-2.5 rounded-xl bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-xs font-bold text-[#A5A19A] hover:text-[#F5F2EA] transition-all"
            title="Refresh list"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl btn-gold text-xs font-bold flex items-center space-x-2 shadow-gold-sm"
          >
            <Plus size={16} />
            <span>Create New Converter</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#141414] border border-[#292722] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Total Converters
            </span>
            <div className="text-2xl font-extrabold text-[#F5F2EA] mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D7AD55]/10 border border-[#D7AD55]/30 flex items-center justify-center text-[#D7AD55]">
            <Droplets size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-[#292722] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Active on Storefront
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.active}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-[#292722] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Disabled / Hidden
            </span>
            <div className="text-2xl font-extrabold text-red-400 mt-1">{stats.disabled}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#292722] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, description..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[#A5A19A]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[#A5A19A]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
            >
              <option value="number">Slot # (Ascending)</option>
              <option value="name">Name (A-Z)</option>
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Converters Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#A5A19A] bg-[#141414] border border-[#292722] rounded-3xl">
          <div className="w-8 h-8 border-2 border-[#D7AD55] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading oil converters from MongoDB...</p>
        </div>
      ) : converters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {converters.map((conv) => (
            <div
              key={conv._id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                conv.enabled
                  ? 'bg-[#141414] border-[#292722] hover:border-[#D7AD55]/60'
                  : 'bg-[#121212]/75 border-[#292722]/50 opacity-70'
              }`}
            >
              <div>
                {/* Top Bar: Slot Number, Brand & Status Toggle */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-[#191919] text-[#D7AD55] border border-[#292722]">
                      Slot #{conv.converterNumber < 10 ? `0${conv.converterNumber}` : conv.converterNumber}
                    </span>
                    <span className="text-xs font-bold text-[#A5A19A]">{conv.brand}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(conv)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1 ${
                      conv.enabled
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900/60'
                        : 'bg-red-950/70 text-red-400 border border-red-500/40 hover:bg-red-900/60'
                    }`}
                  >
                    <span>{conv.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                  </button>
                </div>

                {/* Name */}
                <h3 className="text-base font-extrabold text-[#F5F2EA] mb-1">
                  {conv.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#A5A19A] line-clamp-2 mb-4 leading-relaxed">
                  {conv.description || 'Authentic bulk oil formulation.'}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#090909] border border-[#292722] text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-[#A5A19A] block">Rate / Litre:</span>
                    <strong className="text-[#D7AD55] font-extrabold">
                      Rs. {conv.pricePerLitre?.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A5A19A] block">Stock (L):</span>
                    <strong className="text-[#F5F2EA] font-bold">{conv.availableLitres} L</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A5A19A] block">Min / Step:</span>
                    <span className="text-[#A5A19A] font-semibold text-[11px]">
                      {conv.minimumQuantity}L / {conv.quantityIncrement}L
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Preview, Edit, Delete */}
              <div className="pt-3 border-t border-[#292722] flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPreviewConverter(conv)}
                    className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#A5A19A] hover:text-[#F5F2EA] flex items-center space-x-1.5 transition-colors"
                  >
                    <Eye size={12} />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingConverter(conv)}
                    className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:bg-red-900/50 hover:border-red-500 transition-colors"
                    title="Delete converter"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(conv)}
                  className="px-4 py-1.5 rounded-lg btn-gold text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Edit2 size={12} />
                  <span>Edit Configuration</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-[#A5A19A] bg-[#141414] border border-[#292722] rounded-3xl">
          <Droplets size={32} className="mx-auto mb-2 text-[#D7AD55]/60" />
          <h3 className="font-bold text-sm text-[#F5F2EA]">No Converters Found</h3>
          <p className="text-xs text-[#A5A19A] mt-1 mb-4">
            No oil converters match your filter criteria or search query.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl btn-gold text-xs font-bold inline-flex items-center space-x-1"
          >
            <Plus size={14} />
            <span>Create New Converter</span>
          </button>
        </div>
      )}

      {/* CREATE CONVERTER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-[#141414] border border-[#D7AD55]/40 rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#A5A19A]">
                  New Converter Slot
                </span>
                <h2 className="text-xl font-extrabold text-[#D7AD55] mt-0.5">
                  Create Dynamic Oil Converter
                </h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-[#A5A19A] hover:text-[#F5F2EA] p-1.5 rounded-lg hover:bg-[#191919]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">
                    Converter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Total Quartz Open Oil"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Total, Shell, Caltex, ZIC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">
                    Price Per Litre (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.pricePerLitre}
                    onChange={(e) => setFormData({ ...formData, pricePerLitre: e.target.value })}
                    placeholder="e.g. 1950"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] font-bold text-[#D7AD55] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">
                    Available Stock (Litres) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.availableLitres}
                    onChange={(e) => setFormData({ ...formData, availableLitres: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-[#A5A19A] block mb-1 text-[11px]">
                    Min Qty (L)
                  </label>
                  <input
                    type="number"
                    min="0.05"
                    step="0.05"
                    value={formData.minimumQuantity}
                    onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A5A19A] block mb-1 text-[11px]">
                    Max Qty (L)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.maximumQuantity}
                    onChange={(e) => setFormData({ ...formData, maximumQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A5A19A] block mb-1 text-[11px]">
                    Step Increment (L)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.05"
                    value={formData.quantityIncrement}
                    onChange={(e) => setFormData({ ...formData, quantityIncrement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#F5F2EA] block mb-1">
                  Description / Details
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Authentic French synthetic technology engine oil..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                ></textarea>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#090909] border border-[#292722]">
                <input
                  type="checkbox"
                  id="createEnabledCheck"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 accent-[#D7AD55] rounded"
                />
                <label htmlFor="createEnabledCheck" className="text-xs font-semibold text-[#F5F2EA] cursor-pointer">
                  Activate and display immediately on customer website
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#292722]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#A5A19A] hover:text-[#F5F2EA] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl btn-gold font-bold disabled:opacity-50"
                >
                  {actionLoading ? 'Creating in MongoDB...' : 'Create Converter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CONVERTER MODAL */}
      {editingConverter && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-[#141414] border border-[#292722] rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#A5A19A]">
                  Edit Configuration
                </span>
                <h2 className="text-xl font-extrabold text-[#D7AD55] mt-0.5">
                  Slot #{editingConverter.converterNumber}: {editingConverter.name}
                </h2>
              </div>
              <button
                onClick={() => setEditingConverter(null)}
                className="text-[#A5A19A] hover:text-[#F5F2EA] p-1.5 rounded-lg hover:bg-[#191919]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">
                    Converter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">
                    Price Per Litre (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.pricePerLitre}
                    onChange={(e) => setFormData({ ...formData, pricePerLitre: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] font-bold text-[#D7AD55] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#F5F2EA] block mb-1">
                    Available Stock (Litres) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.availableLitres}
                    onChange={(e) => setFormData({ ...formData, availableLitres: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-[#A5A19A] block mb-1 text-[11px]">
                    Min Qty (L)
                  </label>
                  <input
                    type="number"
                    min="0.05"
                    step="0.05"
                    value={formData.minimumQuantity}
                    onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A5A19A] block mb-1 text-[11px]">
                    Max Qty (L)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.maximumQuantity}
                    onChange={(e) => setFormData({ ...formData, maximumQuantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A5A19A] block mb-1 text-[11px]">
                    Step (L)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.05"
                    value={formData.quantityIncrement}
                    onChange={(e) => setFormData({ ...formData, quantityIncrement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#F5F2EA] block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                ></textarea>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#090909] border border-[#292722]">
                <input
                  type="checkbox"
                  id="editEnabledCheck"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 accent-[#D7AD55] rounded"
                />
                <label htmlFor="editEnabledCheck" className="text-xs font-semibold text-[#F5F2EA] cursor-pointer">
                  Enable this Converter for Customer Website
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#292722]">
                <button
                  type="button"
                  onClick={() => setEditingConverter(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#A5A19A] hover:text-[#F5F2EA] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl btn-gold font-bold disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingConverter && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-red-500/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-[#F5F2EA]">
                Delete Converter?
              </h3>
              <p className="text-xs text-[#A5A19A] leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-red-300">
                  Slot #{deletingConverter.converterNumber} ({deletingConverter.name})
                </strong>
                ?
              </p>
              <p className="text-[11px] text-[#A5A19A] bg-[#090909] p-3 rounded-xl border border-[#292722]">
                This will immediately remove this converter from the storefront. Historical orders will remain safely preserved in the database.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingConverter(null)}
                className="px-5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs font-semibold text-[#A5A19A] hover:text-[#F5F2EA]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-lg shadow-red-950/50 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewConverter && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-[#D7AD55]/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#191919] text-[#D7AD55]">
                  Slot #{previewConverter.converterNumber}
                </span>
                <span className="text-xs text-[#A5A19A]">Storefront Preview</span>
              </div>
              <button
                onClick={() => setPreviewConverter(null)}
                className="text-[#A5A19A] hover:text-[#F5F2EA]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-[#F5F2EA]">
                {previewConverter.name}
              </h3>
              <p className="text-xs text-[#A5A19A]">
                {previewConverter.description || 'Authentic bulk oil formulation.'}
              </p>

              <div className="p-4 rounded-xl bg-[#090909] border border-[#292722] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A5A19A]">Brand:</span>
                  <span className="text-[#F5F2EA] font-semibold">{previewConverter.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A5A19A]">Price per Litre:</span>
                  <span className="text-[#D7AD55] font-bold">
                    Rs. {previewConverter.pricePerLitre?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A5A19A]">Stock:</span>
                  <span className="text-[#F5F2EA]">{previewConverter.availableLitres} Litres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A5A19A]">Status:</span>
                  <span
                    className={`font-bold ${
                      previewConverter.enabled ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {previewConverter.enabled ? 'Active on Storefront' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewConverter(null)}
                className="px-5 py-2 rounded-xl btn-gold text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOilConverters;
