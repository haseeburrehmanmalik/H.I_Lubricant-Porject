import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Truck,
  Phone,
  AlertCircle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { orderService } from '../services/orderService';

const Checkout = () => {
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Hyderabad',
    address: '',
    notes: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F5F2EA]">No Items in Cart</h2>
        <p className="text-xs text-[#A5A19A]">Please add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-flex px-6 py-2.5 rounded-lg btn-gold text-xs font-bold">
          Browse Shop Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setError('Please provide a valid Pakistani contact phone number (e.g. 0311-3728228)');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please provide your complete delivery street address and area');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
        },
        items: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim(),
      };

      const response = await orderService.createOrder(orderPayload);

      if (response.success && response.order) {
        // Clear local shopping cart
        clearCart();

        // Navigate to Order Confirmation page with order details and pre-filled WhatsApp link
        navigate(`/order-success/${response.order.orderNumber}`, {
          state: {
            order: response.order,
            whatsappUrl: response.whatsappUrl,
            whatsappMessage: response.whatsappMessage,
          },
        });
      } else {
        setError(response.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg =
        err.response?.data?.message ||
        'Server failed to verify order or stock is insufficient. Please check your cart.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#292722]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA]">Order Checkout</h1>
        <p className="text-xs text-[#A5A19A] mt-1">
          Complete your delivery details for genuine automotive lubricants dispatch in Hyderabad.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center space-x-3 text-red-300 text-xs font-semibold">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form & Review Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Customer & Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-6">
            <h2 className="text-base font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
              <Truck size={18} className="text-[#D7AD55]" />
              <span>Customer & Delivery Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  Full Name <span className="text-[#D7AD55]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Malik Imran Ali"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  Contact Phone / WhatsApp <span className="text-[#D7AD55]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0311-3728228"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. malikimranali42@yahoo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  City / Region <span className="text-[#D7AD55]">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                >
                  <option value="Hyderabad">Hyderabad (Same-day / Express)</option>
                  <option value="Kotri">Kotri / Jamshoro</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Sukkur">Sukkur</option>
                  <option value="Larkana">Larkana</option>
                  <option value="Mirpurkhas">Mirpurkhas</option>
                  <option value="Other Sindh City">Other City in Sindh / Pakistan</option>
                </select>
              </div>

              {/* Street Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  Complete Delivery Address (House/Shop #, Street, Area) <span className="text-[#D7AD55]">*</span>
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Shop # 5, Near Gari Khata Auto Market, Tulsi Daas Road, Hyderabad"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                ></textarea>
              </div>

              {/* Special Order Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  Additional Order Notes / Landmark
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Near Amma Ayesha Hospital, call before arrival"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
            <h2 className="text-base font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
              <Lock size={18} className="text-[#D7AD55]" />
              <span>Select Payment Method</span>
            </h2>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#191919] border border-[#D7AD55]/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                    className="accent-[#D7AD55]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#F5F2EA]">
                      Cash on Delivery (COD)
                    </div>
                    <div className="text-[11px] text-[#A5A19A]">
                      Pay cash upon delivery at your doorstep or workshop in Hyderabad.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#D7AD55] text-black">
                  Recommended
                </span>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#191919] border border-[#292722] cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer / WhatsApp"
                    checked={formData.paymentMethod === 'Bank Transfer / WhatsApp'}
                    onChange={handleChange}
                    className="accent-[#D7AD55]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#F5F2EA]">
                      Bank Transfer / Easypaisa / JazzCash via WhatsApp
                    </div>
                    <div className="text-[11px] text-[#A5A19A]">
                      Send screenshot after placing order on official WhatsApp (0311-3728228).
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Order Review & Submit */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-6 sticky top-24">
          <h2 className="text-base font-extrabold text-[#F5F2EA] pb-3 border-b border-[#292722]">
            Order Items Review ({cart.length})
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#292722] p-1 shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-[#F5F2EA] truncate">{item.name}</div>
                    <div className="text-[11px] text-[#A5A19A]">
                      {item.viscosity} • Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[#D7AD55] shrink-0">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#292722] space-y-2 text-xs">
            <div className="flex justify-between text-[#A5A19A]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#F5F2EA]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#A5A19A]">
              <span>Delivery Fee</span>
              <span className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase">Free Delivery</span>
                ) : (
                  <span className="text-[#F5F2EA]">Rs. {deliveryFee.toLocaleString()}</span>
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-[#292722] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#F5F2EA]">Total Payable</span>
              <span className="text-2xl font-extrabold text-[#D7AD55]">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl btn-gold text-xs font-extrabold flex items-center justify-center space-x-2 shadow-gold-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying & Recording Order in MongoDB...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <p className="text-[11px] text-[#A5A19A] text-center leading-relaxed">
            By placing your order, you agree to receive dispatch updates and invoices on WhatsApp (+92 311 3728228).
          </p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
