import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Phone,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Check,
  ChevronRight,
  Package,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/shop/ProductCard';

const ProductDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProduct(identifier);
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
          if (data.product.images && data.product.images.length > 0) {
            setSelectedImage(data.product.images[0]);
          }
          setQuantity(1);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Failed to load product details or product does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="h-96 rounded-2xl bg-[#141414] border border-[#292722]"></div>
          <div className="space-y-4">
            <div className="h-6 w-32 bg-[#191919] rounded"></div>
            <div className="h-10 w-3/4 bg-[#191919] rounded"></div>
            <div className="h-6 w-1/4 bg-[#191919] rounded"></div>
            <div className="h-24 bg-[#191919] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-900/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#F5F2EA]">Product Unavailable</h2>
        <p className="text-xs text-[#A5A19A]">
          {error || 'This product might have been removed or the URL is incorrect.'}
        </p>
        <Link to="/shop" className="inline-flex px-6 py-2.5 rounded-lg btn-gold text-xs font-bold">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pre-filled WhatsApp direct inquiry message
  const whatsappMsg =
    `*Assalam-o-Alaikum H.I Lubricant!*\n\n` +
    `I am interested in purchasing:\n` +
    `*Product:* ${product.name}\n` +
    `*Brand:* ${product.brand}\n` +
    `*Viscosity:* ${product.viscosity}\n` +
    `*Volume:* ${product.volume || '4L'}\n` +
    `*Price:* Rs. ${product.price?.toLocaleString()}\n` +
    `*Quantity:* ${quantity}\n\n` +
    `Please confirm stock and delivery to Hyderabad. Thank you!`;

  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#A5A19A]">
        <Link to="/" className="hover:text-[#F5F2EA]">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[#F5F2EA]">
          Shop
        </Link>
        <ChevronRight size={12} />
        <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="hover:text-[#F5F2EA]">
          {product.brand}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#D7AD55] truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery & Product Visuals */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-[#141414] border border-[#292722] overflow-hidden p-6 flex items-center justify-center">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-lg"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded bg-[#090909]/90 border border-[#D7AD55]/50 text-[#D7AD55] text-xs font-bold">
                {product.brand}
              </span>
              <span className="px-3 py-1 rounded bg-[#090909]/90 border border-[#292722] text-[#F5F2EA] text-xs font-bold">
                {product.viscosity}
              </span>
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-sm tracking-wider uppercase">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl bg-[#141414] border p-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#D7AD55] shadow-gold-sm'
                      : 'border-[#292722] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#292722] grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-[#A5A19A]">
              <ShieldCheck size={16} className="text-[#D7AD55] shrink-0" />
              <span>100% Genuine Seal Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2 text-[#A5A19A]">
              <Truck size={16} className="text-[#D7AD55] shrink-0" />
              <span>Express Delivery in Hyderabad</span>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#D7AD55]">
                {product.category}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-[#A5A19A] hover:text-[#D7AD55] flex items-center space-x-1"
                title="Copy product link"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA] tracking-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              <span className="px-2.5 py-1 rounded bg-[#191919] border border-[#292722] text-[#F5F2EA] font-semibold">
                Grade: {product.viscosity}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#191919] border border-[#292722] text-[#F5F2EA] font-semibold">
                Pack Size: {product.volume || '4 Litres'}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#191919] border border-[#292722] text-[#A5A19A]">
                Brand: <strong className="text-[#F5F2EA]">{product.brand}</strong>
              </span>
            </div>
          </div>

          {/* Pricing & Stock Banner */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#A5A19A]">Retail Price (PKR)</div>
              <div className="text-3xl font-extrabold text-[#D7AD55]">
                Rs. {product.price?.toLocaleString()}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-[#A5A19A] line-through">
                  Original: Rs. {product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-bold">
                  <span>Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-bold">
                  <AlertTriangle size={13} />
                  <span>Only {product.stock} units left!</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={13} />
                  <span>In Stock ({product.stock} units)</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>

          {/* Key Benefits */}
          {product.keyBenefits && product.keyBenefits.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F2EA]">
                Key Performance Advantages
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.keyBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-start space-x-2 text-[#A5A19A]">
                    <Check size={14} className="text-[#D7AD55] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-[#292722]">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-[#A5A19A]">Quantity:</span>
              <div className="inline-flex items-center rounded-lg bg-[#141414] border border-[#292722]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-1.5 text-sm font-bold text-[#F5F2EA] hover:text-[#D7AD55] disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs text-[#F5F2EA]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-1.5 text-sm font-bold text-[#F5F2EA] hover:text-[#D7AD55] disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#A5A19A]">
                Total: <strong className="text-[#D7AD55]">Rs. {(product.price * quantity).toLocaleString()}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center space-x-2 shadow-gold-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                <span>Add to Shopping Cart</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-[#F5F2EA] hover:text-[#D7AD55] text-xs font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <Phone size={16} className="text-[#D7AD55]" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {product.specifications && (
            <div className="pt-4 border-t border-[#292722] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F2EA]">
                Specifications & OEM Compliance
              </h3>
              <div className="rounded-xl bg-[#141414] border border-[#292722] overflow-hidden text-xs">
                <div className="grid grid-cols-2 p-3 border-b border-[#292722]">
                  <span className="text-[#A5A19A]">API Classification</span>
                  <span className="font-semibold text-[#F5F2EA]">
                    {product.specifications.apiRating || 'API SN/CF'}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-[#292722]">
                  <span className="text-[#A5A19A]">Base Oil Technology</span>
                  <span className="font-semibold text-[#F5F2EA]">
                    {product.specifications.baseOil || 'Fully Synthetic'}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-[#292722]">
                  <span className="text-[#A5A19A]">Recommended Applications</span>
                  <span className="font-semibold text-[#F5F2EA]">
                    {product.specifications.vehicleType || 'Passenger Vehicles'}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <span className="text-[#A5A19A]">Package Volume</span>
                  <span className="font-semibold text-[#F5F2EA]">
                    {product.volume || '4 Litres'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#292722] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#F5F2EA]">
              Related Lubricants from {product.brand}
            </h2>
            <Link to="/shop" className="text-xs text-[#D7AD55] font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
