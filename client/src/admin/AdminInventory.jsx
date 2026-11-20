import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stocks'); // 'stocks' | 'transactions'

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Stock Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('restock');
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [invRes, txRes] = await Promise.all([
        adminService.getInventory({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: search.trim() || undefined,
          limit: 30,
        }),
        adminService.getTransactions({ limit: 25 }),
      ]);

      if (invRes.success) {
        setProducts(invRes.products || []);
        setTotal(invRes.total || 0);
      }
      if (txRes.success) {
        setTransactions(txRes.transactions || []);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [statusFilter, search]);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustQuantity || Number(adjustQuantity) === 0) {
      alert('Please enter a valid non-zero quantity');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminService.adjustStock(adjustingProduct._id, {
        type: adjustType,
        quantity: Number(adjustQuantity),
        notes: adjustNotes.trim(),
      });

      if (res.success) {
        setAdjustingProduct(null);
        setAdjustQuantity('');
        setAdjustNotes('');
        fetchInventoryData();
      }
    } catch (err) {
      alert('Failed to adjust stock: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Inventory & Warehouse Management
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Real-time stock audit, low-stock notifications, restock logs, and inventory movement history.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 bg-[#141414] p-1 rounded-xl border border-[#292722]">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stocks'
                ? 'bg-[#D7AD55] text-black shadow-sm'
                : 'text-[#A5A19A] hover:text-[#F5F2EA]'
            }`}
          >
            Stock Levels ({total})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'transactions'
                ? 'bg-[#D7AD55] text-black shadow-sm'
                : 'text-[#A5A19A] hover:text-[#F5F2EA]'
            }`}
          >
            Audit Trail Logs ({transactions.length})
          </button>
        </div>
      </div>

      {activeTab === 'stocks' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory by title or viscosity..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs text-[#A5A19A]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock (≤ Threshold)</option>
                <option value="out">Out of Stock (0 units)</option>
                <option value="in_stock">Healthy Stock</option>
              </select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#292722] bg-[#191919] text-[#A5A19A]">
                    <th className="py-3 px-4 font-semibold">Lubricant SKU</th>
                    <th className="py-3 px-4 font-semibold">Brand</th>
                    <th className="py-3 px-4 font-semibold">Viscosity</th>
                    <th className="py-3 px-4 font-semibold">Current Stock</th>
                    <th className="py-3 px-4 font-semibold">Low-Stock Alert Level</th>
                    <th className="py-3 px-4 font-semibold">Inventory Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292722]/60">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-[#A5A19A]">
                        Checking warehouse stock in MongoDB...
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((p) => {
                      const isLow = p.stock > 0 && p.stock <= (p.lowStockThreshold || 5);
                      const isOut = p.stock <= 0;
                      return (
                        <tr key={p._id} className="hover:bg-[#191919]/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#F5F2EA]">
                            {p.name}
                          </td>
                          <td className="py-3 px-4 text-[#D7AD55] font-semibold">{p.brand}</td>
                          <td className="py-3 px-4 font-bold text-[#F5F2EA]">{p.viscosity}</td>
                          <td className="py-3 px-4 font-extrabold text-sm text-[#F5F2EA]">
                            {p.stock} units
                          </td>
                          <td className="py-3 px-4 text-[#A5A19A]">
                            ≤ {p.lowStockThreshold || 5} units
                          </td>
                          <td className="py-3 px-4">
                            {isOut ? (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-red-950/60 text-red-400 border border-red-500/40 uppercase">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-950/60 text-amber-400 border border-amber-500/40 uppercase flex items-center space-x-1 w-max">
                                <AlertTriangle size={11} />
                                <span>Low Stock Alert</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 uppercase">
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setAdjustingProduct(p);
                                setAdjustType('restock');
                                setAdjustQuantity('10');
                                setAdjustNotes('Restock from local distributor shipment');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#D7AD55] inline-flex items-center space-x-1"
                            >
                              <span>Update Stock</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-[#A5A19A]">
                        No products match current stock filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TRANSACTIONS AUDIT TRAIL TAB */
        <div className="rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden">
          <div className="p-4 border-b border-[#292722] flex justify-between items-center">
            <span className="font-bold text-sm text-[#F5F2EA]">Inventory Transaction History</span>
            <span className="text-xs text-[#A5A19A]">Immutable audit trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#292722] bg-[#191919] text-[#A5A19A]">
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Event Type</th>
                  <th className="py-3 px-4 font-semibold">Qty Change</th>
                  <th className="py-3 px-4 font-semibold">Stock Before → After</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292722]/60">
                {transactions.map((tx) => {
                  const isPositive = tx.quantity > 0;
                  return (
                    <tr key={tx._id} className="hover:bg-[#191919]/50 transition-colors">
                      <td className="py-3 px-4 text-[#A5A19A]">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#F5F2EA]">
                        {tx.productName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#191919] border border-[#292722] text-[10px] font-bold uppercase tracking-wider text-[#D7AD55]">
                          {tx.transactionType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold">
                        <span
                          className={`inline-flex items-center space-x-1 ${
                            isPositive ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          <span>{tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#F5F2EA]">
                        {tx.previousStock} → <strong className="text-[#D7AD55]">{tx.newStock}</strong>
                      </td>
                      <td className="py-3 px-4 text-[#A5A19A]">{tx.reference || '—'}</td>
                      <td className="py-3 px-4 text-[#A5A19A] max-w-xs truncate">{tx.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK STOCK ADJUSTMENT MODAL */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-[#292722] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#A5A19A]">
                  Inventory Adjustment
                </span>
                <h2 className="text-base font-extrabold text-[#F5F2EA]">
                  {adjustingProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-[#A5A19A] hover:text-[#F5F2EA]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#191919] border border-[#292722] flex justify-between items-center text-xs">
              <span className="text-[#A5A19A]">Current In-Stock Quantity:</span>
              <strong className="text-sm font-extrabold text-[#D7AD55]">
                {adjustingProduct.stock} units
              </strong>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#A5A19A]">Adjustment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('restock')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'restock'
                        ? 'bg-[#D7AD55] text-black'
                        : 'bg-[#191919] border border-[#292722] text-[#A5A19A]'
                    }`}
                  >
                    + Restock (Add Stock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjustment')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'adjustment'
                        ? 'bg-[#D7AD55] text-black'
                        : 'bg-[#191919] border border-[#292722] text-[#A5A19A]'
                    }`}
                  >
                    Correction / Damage
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#A5A19A]">
                  Quantity to {adjustType === 'restock' ? 'Add' : 'Adjust (positive or negative)'}
                </label>
                <input
                  type="number"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  placeholder="e.g. 10 or -2"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#A5A19A]">Reason / Audit Reference</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Delivery intake from Shell supplier Hyderabad"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#292722]">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs font-semibold text-[#A5A19A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold shadow-gold-sm disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Commit Stock Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
