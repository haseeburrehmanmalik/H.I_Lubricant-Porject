import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PackageCheck,
  Search,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useSettings } from '../context/SettingsContext';

const TIMELINE_STAGES = [
  { key: 'Pending', label: 'Order Placed', desc: 'Order received and logged in system' },
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Order verified by H.I Lubricant sales team' },
  { key: 'Processing', label: 'Processing', desc: 'Quality verification & inventory allocation' },
  { key: 'Packed', label: 'Packed', desc: 'Sealed with tamper-evident packaging' },
  { key: 'Shipped', label: 'Shipped', desc: 'Dispatched with logistics / local courier' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider en route to delivery address' },
  { key: 'Delivered', label: 'Delivered', desc: 'Package received & signed by customer' },
];

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();

  const [orderNumber, setOrderNumber] = useState(searchParams.get('id') || '');
  const [verification, setVerification] = useState(searchParams.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Auto track if both parameters provided in URL
  useEffect(() => {
    const idParam = searchParams.get('id');
    const verifyParam = searchParams.get('phone') || searchParams.get('email');
    if (idParam && verifyParam) {
      setOrderNumber(idParam);
      setVerification(verifyParam);
      handleTrack(idParam, verifyParam);
    }
  }, []);

  const handleTrack = async (idToUse, verifyToUse) => {
    const targetId = (idToUse || orderNumber).trim();
    const targetVerify = (verifyToUse || verification).trim();

    if (!targetId) {
      setError('Please enter your Order ID (e.g. HI-2026-10492).');
      return;
    }
    if (!targetVerify) {
      setError('Please enter the phone number or email associated with this order.');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await orderService.trackOrder({
        orderNumber: targetId,
        verification: targetVerify,
      });

      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setError(res.message || 'No order found with these details.');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError(
        err.response?.data?.message ||
          'Could not find order. Please verify that both the Order ID and phone/email are correct.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  const handleCopyOrderId = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to determine stage completion and index
  const getStageIndex = (status) => {
    const idx = TIMELINE_STAGES.findIndex((s) => s.key.toLowerCase() === (status || '').toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = order ? getStageIndex(order.orderStatus) : -1;
  const isCancelled = order?.orderStatus === 'Cancelled';
  const isReturned = order?.orderStatus === 'Returned';

  // Find history event for a specific stage
  const getHistoryEvent = (stageKey) => {
    if (!order?.trackingHistory) return null;
    return order.trackingHistory.find(
      (h) => h.status?.toLowerCase() === stageKey.toLowerCase()
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#D7AD55]/40 text-[#D7AD55] text-xs font-bold uppercase tracking-wider shadow-sm">
          <PackageCheck size={14} />
          <span>Real-time Live Order Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
          Stay updated with your H.I Lubricant order. Enter your unique Order ID and the phone number or email you provided during checkout.
        </p>
      </div>

      {/* Tracking Input Card */}
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#292722] shadow-card space-y-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order ID Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A5A19A] block">
                Order ID <span className="text-[#D7AD55]">*</span>
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A19A]" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. HI-2026-10492"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs font-medium text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55] transition-colors"
                />
              </div>
            </div>

            {/* Verification Field (Phone or Email) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A5A19A] block">
                Phone Number or Email <span className="text-[#D7AD55]">*</span>
              </label>
              <div className="relative">
                <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A19A]" />
                <input
                  type="text"
                  value={verification}
                  onChange={(e) => setVerification(e.target.value)}
                  placeholder="e.g. 0311-3728228 or email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs font-medium text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55] transition-colors"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#A5A19A] leading-relaxed">
            🔒 For customer privacy, an Order ID can only be tracked when verified with the corresponding phone or email on file.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl btn-gold text-xs font-extrabold flex items-center justify-center space-x-2 shadow-gold-sm disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying and Retrieving Order Timeline...</span>
              </span>
            ) : (
              <>
                <Search size={15} />
                <span>Track My Order Now</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start space-x-3 text-red-300 text-xs animate-fadeIn">
            <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Order Tracking Notice</div>
              <div>{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* TRACKING RESULTS SECTION */}
      {order && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Order Information Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#292722] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#292722] gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#A5A19A]">
                    Order Tracking Summary
                  </span>
                  <span className="text-[#D7AD55]">•</span>
                  <span className="text-xs text-[#A5A19A]">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#D7AD55]">
                    {order.orderNumber}
                  </h2>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs text-[#A5A19A] hover:text-[#D7AD55] flex items-center space-x-1 transition-colors"
                    title="Copy Order ID"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                    isCancelled
                      ? 'bg-red-950/70 text-red-400 border border-red-500/50'
                      : isReturned
                      ? 'bg-amber-950/70 text-amber-400 border border-amber-500/50'
                      : order.orderStatus === 'Delivered'
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/50'
                      : 'bg-[#191919] text-[#D7AD55] border border-[#D7AD55]/50'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#191919] border border-[#292722] space-y-1">
                <span className="text-[11px] text-[#A5A19A] block uppercase tracking-wider">
                  Recipient
                </span>
                <div className="font-bold text-[#F5F2EA] truncate">{order.customer?.name}</div>
                <div className="text-[11px] text-[#A5A19A] truncate">{order.customer?.city}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#191919] border border-[#292722] space-y-1">
                <span className="text-[11px] text-[#A5A19A] block uppercase tracking-wider">
                  Payment
                </span>
                <div className="font-bold text-[#F5F2EA]">{order.paymentMethod}</div>
                <div className={`text-[11px] font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {order.paymentStatus}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#191919] border border-[#292722] space-y-1">
                <span className="text-[11px] text-[#A5A19A] block uppercase tracking-wider">
                  Total Payable
                </span>
                <div className="font-extrabold text-[#D7AD55] text-sm">
                  Rs. {order.total?.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#A5A19A]">
                  {order.deliveryCharges === 0 ? 'Free Delivery' : `Delivery: Rs. ${order.deliveryCharges}`}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#191919] border border-[#292722] space-y-1">
                <span className="text-[11px] text-[#A5A19A] block uppercase tracking-wider">
                  Estimated Delivery
                </span>
                <div className="font-bold text-[#F5F2EA]">
                  {order.estimatedDeliveryDate
                    ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                    : '1-3 Business Days'}
                </div>
                <div className="text-[10px] text-[#A5A19A]">Hyderabad & Region</div>
              </div>
            </div>

            {/* Latest Tracking Note Banner */}
            {order.trackingNotes && (
              <div className="p-3.5 rounded-xl bg-[#191919] border border-[#292722] text-xs flex items-start space-x-2.5">
                <Clock size={15} className="text-[#D7AD55] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#A5A19A]">Latest Dispatch Update: </span>
                  <span className="text-[#F5F2EA] font-medium">"{order.trackingNotes}"</span>
                </div>
              </div>
            )}
          </div>

          {/* VISUAL ORDER PROGRESS TIMELINE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#292722] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
              <div>
                <h3 className="text-base font-extrabold text-[#F5F2EA]">Order Progress Timeline</h3>
                <p className="text-[11px] text-[#A5A19A]">Live status tracked directly from MongoDB fulfillment records</p>
              </div>
              <span className="text-xs text-[#D7AD55] font-semibold">Stage {currentStageIndex + 1} of 7</span>
            </div>

            {/* Cancelled or Returned Special Banners */}
            {isCancelled && (
              <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
                  <AlertCircle size={18} />
                  <span>Order Cancelled</span>
                </div>
                <p className="text-xs text-red-200">
                  This order was cancelled. Reserved inventory was safely returned to warehouse stock.
                </p>
                {getHistoryEvent('Cancelled') && (
                  <div className="text-[11px] text-[#A5A19A] pt-1">
                    Recorded on {new Date(getHistoryEvent('Cancelled').updatedAt).toLocaleString()} • {getHistoryEvent('Cancelled').notes}
                  </div>
                )}
              </div>
            )}

            {isReturned && (
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <RotateCcw size={18} />
                  <span>Order Returned</span>
                </div>
                <p className="text-xs text-amber-200">
                  This order was marked as returned.
                </p>
              </div>
            )}

            {/* Standard 7-Stage Timeline */}
            {!isCancelled && !isReturned && (
              <>
                {/* Desktop Horizontal View */}
                <div className="hidden lg:block pt-4 pb-2">
                  <div className="relative flex items-start justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-[#222222] z-0">
                      <div
                        className="h-full bg-gradient-to-r from-[#D7AD55] to-[#F2D28A] transition-all duration-700"
                        style={{
                          width: `${Math.min(100, Math.max(0, (currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100))}%`,
                        }}
                      ></div>
                    </div>

                    {TIMELINE_STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const historyEvent = getHistoryEvent(stage.key);

                      return (
                        <div key={stage.key} className="relative z-10 flex flex-col items-center text-center w-28 group">
                          {/* Circle Icon */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-[#D7AD55] text-black shadow-gold-sm'
                                : 'bg-[#191919] border border-[#292722] text-[#A5A19A]'
                            } ${isCurrent ? 'ring-4 ring-[#D7AD55]/30' : ''}`}
                          >
                            {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                          </div>

                          {/* Stage Title */}
                          <div className={`mt-3 text-xs font-bold ${isCompleted ? 'text-[#F5F2EA]' : 'text-[#666]'}`}>
                            {stage.label}
                          </div>

                          {/* Stage Date from MongoDB History */}
                          <div className="text-[10px] text-[#A5A19A] mt-0.5">
                            {historyEvent ? (
                              <span>{new Date(historyEvent.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            ) : isCurrent ? (
                              <span className="text-[#D7AD55] font-semibold">Active</span>
                            ) : (
                              <span>Pending</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile & Tablet Vertical Timeline */}
                <div className="lg:hidden space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#292722]">
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const historyEvent = getHistoryEvent(stage.key);

                    return (
                      <div key={stage.key} className="relative flex items-start space-x-3 text-xs">
                        <div
                          className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-[#D7AD55] text-black' : 'bg-[#191919] border border-[#292722] text-[#666]'
                          } ${isCurrent ? 'ring-4 ring-[#D7AD55]/30' : ''}`}
                        >
                          {isCompleted ? <Check size={12} strokeWidth={3} /> : <span className="text-[9px] font-bold">{idx + 1}</span>}
                        </div>

                        <div className="space-y-0.5 pl-2">
                          <div className={`font-bold ${isCompleted ? 'text-[#F5F2EA]' : 'text-[#666]'}`}>
                            {stage.label}
                          </div>
                          <div className="text-[11px] text-[#A5A19A]">{stage.desc}</div>
                          {historyEvent && (
                            <div className="text-[10px] text-[#D7AD55]">
                              {new Date(historyEvent.updatedAt).toLocaleString()}
                              {historyEvent.notes ? ` • ${historyEvent.notes}` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Ordered Products Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-[#292722] space-y-4">
            <h3 className="text-base font-extrabold text-[#F5F2EA] pb-3 border-b border-[#292722] flex items-center space-x-2">
              <Package size={17} className="text-[#D7AD55]" />
              <span>Products in this Package ({order.items?.length || 0})</span>
            </h3>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#191919] border border-[#292722] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#292722] p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-[#F5F2EA]">{item.name}</div>
                      <div className="text-[11px] text-[#A5A19A]">
                        {item.viscosity} • {item.volume || '4L'} • Quantity: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-[#D7AD55]">
                      Rs. {item.subtotal?.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#A5A19A]">
                      Rs. {item.price?.toLocaleString()} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery destination summary */}
            <div className="pt-3 border-t border-[#292722] flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#A5A19A] gap-2">
              <div className="flex items-center space-x-1.5">
                <MapPin size={13} className="text-[#D7AD55]" />
                <span>Destination: <strong className="text-[#F5F2EA]">{order.customer?.address}, {order.customer?.city}</strong></span>
              </div>
              <a
                href={`https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum H.I Lubricant! Inquiring about progress on Order #${order.orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D7AD55] hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Need assistance? Chat on WhatsApp</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
