import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Phone,
  MapPin,
  Package,
} from 'lucide-react';
import { orderService } from '../services/orderService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await orderService.getAdminOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
        setCurrentPage(res.currentPage || 1);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await orderService.updateOrderStatus(orderId, {
        status: newStatus,
        adminNotes: adminNotes.trim() || undefined,
      });
      if (res.success) {
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
        fetchOrders(currentPage);
      }
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40';
      case 'Confirmed':
        return 'bg-blue-950/60 text-blue-400 border border-blue-500/40';
      case 'Processing':
        return 'bg-purple-950/60 text-purple-400 border border-purple-500/40';
      case 'Pending':
        return 'bg-amber-950/60 text-amber-400 border border-amber-500/40';
      case 'Cancelled':
        return 'bg-red-950/60 text-red-400 border border-red-500/40';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Order Management
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Track customer deliveries, update fulfillment statuses, and manage inventory restoration ({total} orders).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name, phone..."
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
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292722] bg-[#191919] text-[#A5A19A]">
                <th className="py-3 px-4 font-semibold">Order #</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">City & Address</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total (PKR)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292722]/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#A5A19A]">
                    Loading orders from database...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#191919]/50 transition-colors">
                    {/* Order Number */}
                    <td className="py-3 px-4 font-bold text-[#D7AD55]">
                      {ord.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 text-[#F5F2EA]">
                      <div className="font-semibold">{ord.customer?.name}</div>
                      <div className="text-[10px] text-[#A5A19A]">{ord.customer?.phone}</div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 text-[#A5A19A] max-w-xs truncate">
                      <span className="text-[#F5F2EA]">{ord.customer?.city}: </span>
                      {ord.customer?.address}
                    </td>

                    {/* Items Count */}
                    <td className="py-3 px-4 text-[#F5F2EA] font-semibold">
                      {ord.items?.length || 0} items
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 font-extrabold text-[#D7AD55]">
                      Rs. {ord.total?.toLocaleString()}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-[11px] text-[#A5A19A]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setAdminNotes(ord.adminNotes || '');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-[#F5F2EA] hover:text-[#D7AD55] transition-colors inline-flex items-center space-x-1 font-semibold"
                      >
                        <Eye size={12} />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[#A5A19A]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW & MANAGE ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#141414] border border-[#292722] rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#A5A19A]">
                  Order Details
                </span>
                <h2 className="text-lg font-extrabold text-[#D7AD55]">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#A5A19A] hover:text-[#F5F2EA]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-[#191919] border border-[#292722] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#A5A19A] text-[11px] block">Customer:</span>
                <strong className="text-[#F5F2EA]">{selectedOrder.customer?.name}</strong>
              </div>
              <div>
                <span className="text-[#A5A19A] text-[11px] block">Phone:</span>
                <strong className="text-[#D7AD55]">{selectedOrder.customer?.phone}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#A5A19A] text-[11px] block">Complete Delivery Address:</span>
                <span className="text-[#F5F2EA]">
                  {selectedOrder.customer?.address}, {selectedOrder.customer?.city}
                </span>
              </div>
              {selectedOrder.notes && (
                <div className="sm:col-span-2 text-amber-300">
                  <span className="text-[#A5A19A] text-[11px] block">Customer Notes:</span>
                  <span>"{selectedOrder.notes}"</span>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A5A19A]">
                Ordered Products
              </h3>
              <div className="rounded-xl bg-[#191919] border border-[#292722] divide-y divide-[#292722]/60 overflow-hidden text-xs">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-[#F5F2EA]">{it.name}</div>
                      <div className="text-[11px] text-[#A5A19A]">
                        {it.viscosity} • Qty: {it.quantity} x Rs. {it.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-extrabold text-[#D7AD55]">
                      Rs. {it.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-4 rounded-xl bg-[#191919] border border-[#292722] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#A5A19A]">
                <span>Subtotal:</span>
                <span className="text-[#F5F2EA]">Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#A5A19A]">
                <span>Delivery Charges:</span>
                <span>{selectedOrder.deliveryCharges === 0 ? 'FREE' : `Rs. ${selectedOrder.deliveryCharges}`}</span>
              </div>
              <div className="pt-2 border-t border-[#292722] flex justify-between font-bold text-sm">
                <span className="text-[#F5F2EA]">Total Amount:</span>
                <span className="text-[#D7AD55]">Rs. {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Update Control */}
            <div className="space-y-3 pt-3 border-t border-[#292722]">
              <label className="text-xs font-bold text-[#F5F2EA] block">
                Update Fulfillment Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(selectedOrder._id, st)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      selectedOrder.orderStatus === st
                        ? 'bg-[#D7AD55] text-black shadow-gold-sm'
                        : 'bg-[#191919] border border-[#292722] text-[#A5A19A] hover:text-[#F5F2EA] hover:border-[#D7AD55]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {selectedOrder.orderStatus === 'Cancelled' && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] text-red-300 flex items-center space-x-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>
                    Stock has been automatically returned to inventory and logged in audit transactions.
                  </span>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A5A19A] block">
                Internal Admin Notes
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Dispatched with Hyderabad rider Tariq (Tracking # 482)"
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
