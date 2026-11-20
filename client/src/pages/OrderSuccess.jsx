import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useSettings } from '../context/SettingsContext';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { settings } = useSettings();

  const [order, setOrder] = useState(location.state?.order || null);
  const [whatsappUrl, setWhatsappUrl] = useState(location.state?.whatsappUrl || '');
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && orderNumber) {
        setLoading(true);
        try {
          const res = await orderService.getOrderByNumber(orderNumber);
          if (res.success && res.order) {
            setOrder(res.order);

            // Reconstruct WhatsApp URL if not passed in state
            const formattedPhone = (settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '');
            const itemLines = res.order.items
              .map(
                (it, idx) =>
                  `${idx + 1}. *${it.name}* (${it.viscosity}) x ${it.quantity} = Rs. ${it.subtotal.toLocaleString()}`
              )
              .join('\n');

            const msg =
              `*Assalam-o-Alaikum H.I Lubricant!*\n\n` +
              `I have placed an order on your website.\n\n` +
              `*Order #:* ${res.order.orderNumber}\n` +
              `*Customer:* ${res.order.customer.name}\n` +
              `*Phone:* ${res.order.customer.phone}\n` +
              `*Address:* ${res.order.customer.address}, ${res.order.customer.city}\n\n` +
              `*Items Ordered:*\n${itemLines}\n\n` +
              `*Subtotal:* Rs. ${res.order.subtotal.toLocaleString()}\n` +
              `*Delivery:* ${res.order.deliveryCharges === 0 ? 'FREE' : 'Rs. ' + res.order.deliveryCharges.toLocaleString()}\n` +
              `*Total Amount:* Rs. ${res.order.total.toLocaleString()}\n` +
              `*Payment:* ${res.order.paymentMethod}\n\n` +
              `Please confirm my order. Thank you!`;

            setWhatsappUrl(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`);
          } else {
            setError('Could not locate order details.');
          }
        } catch (err) {
          console.error('Failed to fetch order:', err);
          setError('Failed to fetch order details.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#D7AD55] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#A5A19A]">Loading your order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F5F2EA]">Order Not Found</h2>
        <p className="text-xs text-[#A5A19A]">{error || 'Please check your order number or contact support.'}</p>
        <Link to="/" className="inline-flex px-6 py-2.5 rounded-lg btn-gold text-xs font-bold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-[#191919] to-[#141414] border border-[#D7AD55]/50 text-center space-y-4 shadow-card">
        <div className="w-16 h-16 rounded-full bg-[#D7AD55]/15 border border-[#D7AD55] text-[#D7AD55] flex items-center justify-center mx-auto shadow-gold-sm">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D7AD55]">
            Order Successfully Placed & Saved in Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA]">
            Thank You, {order.customer?.name}!
          </h1>
          <p className="text-xs text-[#A5A19A] max-w-md mx-auto">
            Your order has been recorded in our system. Our team at H.I Lubricant is preparing your package for dispatch.
          </p>
        </div>

        {/* Order Number Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#090909] border border-[#292722]">
          <span className="text-xs text-[#A5A19A]">Order Number:</span>
          <strong className="text-sm font-extrabold text-[#D7AD55]">{order.orderNumber}</strong>
        </div>

        {/* WhatsApp Button */}
        <div className="pt-4 max-w-md mx-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <Phone size={18} />
            <span>Click to Send Order Details on WhatsApp</span>
            <ExternalLink size={14} />
          </a>
          <p className="text-[11px] text-[#A5A19A] mt-2">
            Opens pre-filled message to +92 311 3728228 with your order number & items list.
          </p>
        </div>
      </div>

      {/* Order Summary & Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ordered Items */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <h2 className="text-sm font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
            <Package size={16} className="text-[#D7AD55]" />
            <span>Items in this Order ({order.items?.length})</span>
          </h2>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-[#F5F2EA]">{item.name}</div>
                  <div className="text-[11px] text-[#A5A19A]">
                    {item.viscosity} • Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-bold text-[#D7AD55]">
                  Rs. {item.subtotal?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#292722] space-y-2 text-xs">
            <div className="flex justify-between text-[#A5A19A]">
              <span>Subtotal:</span>
              <span className="text-[#F5F2EA]">Rs. {order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#A5A19A]">
              <span>Delivery Charges:</span>
              <span>{order.deliveryCharges === 0 ? 'FREE' : `Rs. ${order.deliveryCharges}`}</span>
            </div>
            <div className="pt-2 border-t border-[#292722] flex justify-between items-baseline font-bold">
              <span className="text-sm text-[#F5F2EA]">Total Amount:</span>
              <span className="text-xl text-[#D7AD55]">Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Dispatch Details */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <h2 className="text-sm font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
            <MapPin size={16} className="text-[#D7AD55]" />
            <span>Delivery & Customer Details</span>
          </h2>

          <div className="space-y-2.5 text-xs text-[#A5A19A]">
            <div>
              <span className="text-[11px] block uppercase text-[#666]">Recipient Name</span>
              <span className="text-[#F5F2EA] font-semibold">{order.customer?.name}</span>
            </div>

            <div>
              <span className="text-[11px] block uppercase text-[#666]">Phone Number</span>
              <span className="text-[#F5F2EA] font-semibold">{order.customer?.phone}</span>
            </div>

            <div>
              <span className="text-[11px] block uppercase text-[#666]">Delivery Address</span>
              <span className="text-[#F5F2EA] font-semibold">
                {order.customer?.address}, {order.customer?.city}
              </span>
            </div>

            <div>
              <span className="text-[11px] block uppercase text-[#666]">Payment Method</span>
              <span className="text-[#D7AD55] font-semibold">{order.paymentMethod}</span>
            </div>

            <div>
              <span className="text-[11px] block uppercase text-[#666]">Current Order Status</span>
              <span className="px-2 py-0.5 rounded bg-[#191919] border border-[#292722] text-[#F5F2EA] font-bold">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Return home link */}
      <div className="text-center pt-6">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#D7AD55] hover:underline"
        >
          <span>Continue Browsing Products</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
