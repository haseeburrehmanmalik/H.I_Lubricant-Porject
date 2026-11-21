import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    cart,
    itemCount,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const freeDeliveryDiff = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#141414] border border-[#292722] flex items-center justify-center mx-auto text-[#A5A19A]">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#F5F2EA]">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-[#A5A19A] max-w-md mx-auto">
            You haven't added any automotive lubricants or engine oils yet. Explore our genuine brands and stock up on certified fluids.
          </p>
        </div>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl btn-gold text-xs font-bold shadow-gold-sm"
          >
            <span>Explore Lubricants</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#292722] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA]">Shopping Cart</h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Review your selected automotive lubricants ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-[#A5A19A] hover:text-red-400 flex items-center space-x-1.5 transition-colors"
        >
          <Trash2 size={13} />
          <span>Clear Shopping Cart</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-[#F5F2EA] flex items-center space-x-1.5">
            <Truck size={14} className="text-[#D7AD55]" />
            {freeDeliveryDiff === 0 ? (
              <span className="text-emerald-400 font-bold">
                Congratulations! You qualify for FREE Delivery in Hyderabad & across Pakistan!
              </span>
            ) : (
              <span>
                Add <strong className="text-[#D7AD55]">Rs. {freeDeliveryDiff.toLocaleString()}</strong> more to get <strong>FREE DELIVERY</strong>!
              </span>
            )}
          </span>
          <span className="text-[#A5A19A]">{freeDeliveryProgress}%</span>
        </div>
        <div className="w-full bg-[#191919] h-2 rounded-full overflow-hidden border border-[#292722]">
          <div
            className="bg-gradient-to-r from-[#D7AD55] to-[#F2D28A] h-full transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Content: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product}
              className="p-4 sm:p-5 rounded-2xl bg-[#141414] border border-[#292722] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between transition-all"
            >
              {/* Image & Product info */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-xl bg-[#191919] border border-[#292722] p-2 shrink-0 flex items-center justify-center">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[11px] text-[#A5A19A]">
                    <span className="text-[#D7AD55] font-semibold">{item.brand}</span>
                    <span>•</span>
                    <span>{item.viscosity}</span>
                    <span>•</span>
                    <span>{item.volume || `${item.quantity} L`}</span>
                  </div>
                  {item.isCustomOil ? (
                    <span className="font-bold text-sm text-[#F5F2EA] block">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={`/product/${item.slug || item.product}`}
                      className="font-bold text-sm text-[#F5F2EA] hover:text-[#F2D28A] line-clamp-1 block"
                    >
                      {item.name}
                    </Link>
                  )}
                  <div className="text-xs font-semibold text-[#D7AD55]">
                    {item.isCustomOil ? `Rs. ${item.price.toLocaleString()} / Litre` : `Rs. ${item.price.toLocaleString()} / unit`}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price Subtotal */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#292722]">
                {/* Stepper */}
                <div className="inline-flex items-center rounded-lg bg-[#191919] border border-[#292722]">
                  <button
                    onClick={() => updateQuantity(item.product, item.isCustomOil ? Math.max(0.5, item.quantity - 0.5) : item.quantity - 1)}
                    className="p-1.5 text-xs text-[#F5F2EA] hover:text-[#D7AD55]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-[#F5F2EA]">
                    {item.quantity} {item.isCustomOil ? 'L' : ''}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.isCustomOil ? item.quantity + 0.5 : item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 text-xs text-[#F5F2EA] hover:text-[#D7AD55] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[5rem]">
                  <div className="text-sm font-extrabold text-[#F5F2EA]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-[#A5A19A] hover:text-red-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#D7AD55] hover:underline"
            >
              <span>← Continue Shopping & Add More Lubricants</span>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Order Summary Box */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-6 sticky top-24">
          <h2 className="text-base font-extrabold text-[#F5F2EA] pb-3 border-b border-[#292722]">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#A5A19A]">
              <span>Cart Subtotal ({itemCount} units)</span>
              <span className="text-[#F5F2EA] font-semibold">Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-[#A5A19A]">
              <span>Estimated Delivery Fee</span>
              <span className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 uppercase font-bold">Free</span>
                ) : (
                  <span className="text-[#F5F2EA]">Rs. {deliveryFee.toLocaleString()}</span>
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#292722] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#F5F2EA]">Grand Total</span>
              <span className="text-2xl font-extrabold text-[#D7AD55]">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-xl btn-gold text-xs font-extrabold flex items-center justify-center space-x-2 shadow-gold-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={15} />
          </button>

          <div className="pt-2 space-y-2 text-[11px] text-[#A5A19A] border-t border-[#292722]/60">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={14} className="text-[#D7AD55]" />
              <span>100% Guaranteed Original Lubricants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck size={14} className="text-[#D7AD55]" />
              <span>Cash on Delivery available in Hyderabad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
