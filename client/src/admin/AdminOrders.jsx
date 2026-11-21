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
  Mail,
  MapPin,
  Package,
  Truck,
  Calendar,
  FileText,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { orderService } from '../services/orderService';

const ALL_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [trackingNotes, setTrackingNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentStatus = paymentFilter;

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
  }, [search, statusFilter, paymentFilter]);

  const openOrderModal = (ord) => {
    setSelectedOrder(ord);
    setSelectedStatus(ord.orderStatus);
    setSelectedPaymentStatus(ord.paymentStatus || 'Unpaid');
    setTrackingNotes('');
    setAdminNotes(ord.adminNotes || '');
    setEstimatedDeliveryDate(
      ord.estimatedDeliveryDate
        ? new Date(ord.estimatedDeliveryDate).toISOString().split('T')[0]
        : ''
    );
    setUpdateSuccessMsg('');
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    setUpdateSuccessMsg('');
    try {
      const payload = {
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus,
        adminNotes: adminNotes.trim(),
        trackingNotes: trackingNotes.trim() || undefined,
        estimatedDeliveryDate: estimatedDeliveryDate || undefined,
      };

      const res = await orderService.updateOrderStatus(selectedOrder._id, payload);
      if (res.success) {
        setSelectedOrder(res.order);
        setUpdateSuccessMsg('Order details and tracking updated successfully!');
        setTrackingNotes('');
        fetchOrders(currentPage);
      }
    } catch (err) {
      alert('Failed to update order: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40';
      case 'Packed':
      case 'Processing':
        return 'bg-purple-950/60 text-purple-400 border border-purple-500/40';
      case 'Confirmed':
        return 'bg-blue-950/60 text-blue-400 border border-blue-500/40';
      case 'Pending':
        return 'bg-amber-950/60 text-amber-400 border border-amber-500/40';
      case 'Cancelled':
        return 'bg-red-950/60 text-red-400 border border-red-500/40';
      case 'Returned':
        return 'bg-orange-950/60 text-orange-400 border border-orange-500/40';
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
            Order & Tracking Management
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Track customer deliveries, update 9-stage fulfillment statuses, record dispatch notes, and manage payments ({total} total orders).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A19A]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer, phone, city..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Order Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#A5A19A]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#A5A19A]">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
            >
              <option value="all">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292722] bg-[#191919] text-[#A5A19A]">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total (PKR)</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292722]/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#A5A19A]">
                    Loading orders from database...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#191919]/50 transition-colors">
                    {/* Order ID */}
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

                    {/* Payment Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ord.paymentStatus || 'Unpaid'}
                      </span>
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
                        onClick={() => openOrderModal(ord)}
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
                  <td colSpan="9" className="py-12 text-center text-[#A5A19A]">
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-[#141414] border border-[#292722] rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#A5A19A]">
                  Order & Tracking Manager
                </span>
                <div className="flex items-center space-x-3 mt-0.5">
                  <h2 className="text-xl font-extrabold text-[#D7AD55]">
                    {selectedOrder.orderNumber}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#A5A19A] hover:text-[#F5F2EA] p-1.5 rounded-lg hover:bg-[#191919]"
              >
                <X size={20} />
              </button>
            </div>

            {updateSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 size={16} />
                <span>{updateSuccessMsg}</span>
              </div>
            )}

            {/* Customer & Delivery Details */}
            <div className="p-4 rounded-xl bg-[#191919] border border-[#292722] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#A5A19A] text-[11px] block">Customer:</span>
                <strong className="text-[#F5F2EA]">{selectedOrder.customer?.name}</strong>
              </div>
              <div>
                <span className="text-[#A5A19A] text-[11px] block">Contact Phone:</span>
                <strong className="text-[#D7AD55]">{selectedOrder.customer?.phone}</strong>
              </div>
              <div>
                <span className="text-[#A5A19A] text-[11px] block">Email:</span>
                <span className="text-[#F5F2EA]">{selectedOrder.customer?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#A5A19A] text-[11px] block">City:</span>
                <span className="text-[#F5F2EA]">{selectedOrder.customer?.city}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#A5A19A] text-[11px] block">Delivery Address:</span>
                <span className="text-[#F5F2EA]">{selectedOrder.customer?.address}</span>
              </div>
              {selectedOrder.notes && (
                <div className="sm:col-span-2 text-amber-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                  <span className="text-[#A5A19A] text-[10px] block uppercase font-bold">Customer Order Note:</span>
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
                <span>Delivery Fee:</span>
                <span>{selectedOrder.deliveryCharges === 0 ? 'FREE' : `Rs. ${selectedOrder.deliveryCharges}`}</span>
              </div>
              <div className="pt-2 border-t border-[#292722] flex justify-between font-bold text-sm">
                <span className="text-[#F5F2EA]">Grand Total:</span>
                <span className="text-[#D7AD55]">Rs. {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* STATUS & PAYMENT CONTROLS */}
            <div className="p-5 rounded-2xl bg-[#090909] border border-[#292722] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D7AD55] flex items-center space-x-1.5">
                <SlidersHorizontal size={14} />
                <span>Update Fulfillment & Tracking</span>
              </h3>

              {/* Status Selector */}
              <div>
                <label className="text-xs font-semibold text-[#A5A19A] block mb-2">
                  Order Status (9 Stages):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between ${
                        selectedStatus === st
                          ? 'bg-[#D7AD55] text-black shadow-gold-sm'
                          : 'bg-[#191919] border border-[#292722] text-[#A5A19A] hover:text-[#F5F2EA] hover:border-[#D7AD55]'
                      }`}
                    >
                      <span>{st}</span>
                      {selectedStatus === st && <CheckCircle2 size={13} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment & Estimated Delivery Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#A5A19A] block mb-1.5">
                    Payment Status:
                  </label>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  >
                    <option value="Unpaid">Unpaid (Cash on Delivery Pending)</option>
                    <option value="Paid">Paid (Cash / Bank Transfer Received)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A5A19A] block mb-1.5">
                    Estimated Delivery Date:
                  </label>
                  <input
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                  />
                </div>
              </div>

              {/* Status Update Note (Appended to Customer Tracking Timeline) */}
              <div>
                <label className="text-xs font-semibold text-[#A5A19A] block mb-1.5">
                  Tracking Event Note (Visible on Customer Tracking Timeline):
                </label>
                <input
                  type="text"
                  value={trackingNotes}
                  onChange={(e) => setTrackingNotes(e.target.value)}
                  placeholder="e.g. Package dispatched via Hyderabad local courier rider Tariq"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                />
              </div>

              {/* Internal Admin Note */}
              <div>
                <label className="text-xs font-semibold text-[#A5A19A] block mb-1.5">
                  Internal Store Admin Notes:
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal warehouse or rider contact details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
                />
              </div>

              {selectedStatus === 'Cancelled' && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] text-red-300 flex items-center space-x-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>
                    Saving as Cancelled will automatically restore product stock into MongoDB and record audit logs.
                  </span>
                </div>
              )}

              {selectedStatus === 'Returned' && (
                <div className="p-3 rounded-lg bg-orange-950/40 border border-orange-500/30 text-[11px] text-orange-300 flex items-center space-x-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>
                    Saving as Returned will restore inventory stock to prevent inventory discrepancies.
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={handleUpdateOrder}
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Saving in MongoDB...' : 'Save Changes & Update Tracking'}
                </button>
              </div>
            </div>

            {/* AUDIT / TRACKING HISTORY TIMELINE */}
            <div className="space-y-3 pt-2 border-t border-[#292722]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A5A19A] flex items-center space-x-2">
                <Clock size={14} className="text-[#D7AD55]" />
                <span>Tracking History Timeline ({selectedOrder.trackingHistory?.length || 0} events)</span>
              </h3>

              {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                <div className="space-y-3 pl-2">
                  {selectedOrder.trackingHistory.map((hist, idx) => (
                    <div key={idx} className="relative pl-6 pb-2 border-l border-[#292722] last:border-0">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#D7AD55] border-2 border-[#141414]"></div>
                      <div className="p-3 rounded-xl bg-[#191919] border border-[#292722] text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(
                              hist.status
                            )}`}
                          >
                            {hist.status}
                          </span>
                          <span className="text-[10px] text-[#A5A19A]">
                            {new Date(hist.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[#F5F2EA]">{hist.notes || 'Status updated.'}</p>
                        <div className="text-[10px] text-[#A5A19A] mt-1">
                          Updated by: <span className="text-[#D7AD55]">{hist.updatedBy || 'System'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A5A19A] italic">No tracking history recorded yet.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#292722]">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 rounded-xl bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#F5F2EA]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
