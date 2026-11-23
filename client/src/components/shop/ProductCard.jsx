import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const brandName = typeof product.brand === 'object' ? (product.brand?.name || '') : (product.brand || '');
  const categoryName = typeof product.category === 'object' ? (product.category?.name || '') : (product.category || '');

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col justify-between bg-[#191919] border border-[#292722] hover:border-[#D7AD55]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      {/* Top Media & Badges */}
      <div className="relative aspect-square w-full bg-[#121212] overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded bg-[#090909]/80 backdrop-blur-md border border-[#D7AD55]/40 text-[#D7AD55] text-[11px] font-bold tracking-wide">
            {brandName}
          </span>
          {product.featured && (
            <span className="px-2 py-0.5 rounded bg-[#D7AD55] text-[#090909] text-[10px] font-extrabold uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Viscosity Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2.5 py-1 rounded bg-[#090909]/90 border border-[#292722] text-[#F5F2EA] text-xs font-bold tracking-wider shadow-sm">
            {product.viscosity}
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#A5A19A] mb-1">
            <span>{categoryName}</span>
            <span>{product.volume || '4L'}</span>
          </div>

          <Link
            to={`/product/${product.slug || product._id}`}
            className="block font-bold text-sm text-[#F5F2EA] group-hover:text-[#F2D28A] transition-colors line-clamp-2 min-h-[2.5rem]"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing and Stock Status */}
        <div className="mt-4 pt-3 border-t border-[#292722]/70">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-lg font-extrabold text-[#D7AD55]">
                Rs. {product.price?.toLocaleString()}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-[#A5A19A] line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Stock indicator */}
            <div className="text-right">
              {isOutOfStock ? (
                <span className="text-[11px] text-red-400 font-semibold flex items-center justify-end space-x-1">
                  <span>Sold Out</span>
                </span>
              ) : isLowStock ? (
                <span className="text-[11px] text-amber-400 font-medium flex items-center justify-end space-x-1">
                  <AlertTriangle size={11} />
                  <span>Only {product.stock} left</span>
                </span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-end space-x-1">
                  <Check size={11} />
                  <span>In Stock</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.slug || product._id}`}
              className="px-3 py-2 rounded-lg bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#F5F2EA] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Eye size={13} />
              <span>Details</span>
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-[#222222] text-[#666666] cursor-not-allowed border border-transparent'
                  : 'btn-gold shadow-sm'
              }`}
            >
              <ShoppingCart size={13} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
