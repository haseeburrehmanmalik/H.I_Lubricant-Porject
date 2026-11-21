import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Zap,
  Phone,
  CheckCircle2,
  ChevronRight,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Package,
  Droplets,
  Check,
  Headphones,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/shop/ProductCard';
import OilQuantityCalculator from '../components/shop/OilQuantityCalculator';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homeTrackId, setHomeTrackId] = useState('');
  const { settings } = useSettings();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getProducts({ featured: 'true', limit: 8 });
        if (data.success) {
          setFeaturedProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const popularBrands = [
    { name: 'Shell', desc: 'Helix & Rimula PurePlus Technology', tag: 'Global Leader' },
    { name: 'Caltex', desc: 'Havoline & Delo Deposit Shield', tag: 'Chevron Formulation' },
    { name: 'PSO', desc: 'Carient S-Pro & DEO Extreme', tag: 'Pakistan Premier' },
    { name: 'Honda', desc: 'Genuine OEM Precision Formulation', tag: 'Official OEM' },
    { name: 'Blaze', desc: 'High Thermal Endurance Synthetics', tag: 'Heavy Duty' },
    { name: 'ZIC', desc: 'YUBASE Group III Synthetic Tech', tag: 'Korean Engineering' },
    { name: 'Total', desc: 'Quartz Age Resistance Technology', tag: 'French Performance' },
  ];

  const categories = [
    {
      name: 'Engine Oil',
      slug: 'Engine Oil',
      desc: 'Full synthetic & mineral motor oils for modern petrol & diesel vehicles.',
      count: 'Premium Brands',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Motorcycle Oil',
      slug: 'Motorcycle Oil',
      desc: '4T high-RPM clutch & gearbox protection for street & touring bikes.',
      count: 'JASO MA2 Certified',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Car Lubricants',
      slug: 'Car Lubricants',
      desc: 'High-mileage passenger car motor oils for daily city commuting.',
      count: 'API SP / SN Plus',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Gear Oil & Transmission',
      slug: 'Gear Oil',
      desc: 'Manual transmission & differential gear lubricants for extreme pressure.',
      count: 'GL-4 & GL-5 Spec',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Other Lubricants & Fluids',
      slug: 'Other Lubricants',
      desc: 'Brake fluids, radiators coolants, hydraulic oils, and grease.',
      count: 'Industrial & Auto',
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const viscosities = ['0W-20', '5W-30', '10W-40', '20W-50', '15W-40', 'ATF Synthetic'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. CINEMATIC ASYMMETRICAL HERO SECTION */}
      <section className="relative min-h-[680px] lg:min-h-[760px] flex items-center justify-center overflow-hidden border-b border-[#292722] bg-[#080909]">
        {/* Soft background radial lighting */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#D5A746]/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-[#D5A746]/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* LEFT SIDE — 48% (lg:col-span-6 or 5.8) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#151616] border border-[#D5A746]/40 text-[#D5A746] text-xs font-bold uppercase tracking-wider shadow-gold-sm">
                <Sparkles size={13} />
                <span>ENGINE OILS • AUTOMOTIVE LUBRICANTS</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F7F5EF] leading-[1.12]">
                PROTECT YOUR ENGINE.{' '}
                <span className="gold-gradient-text block mt-1">POWER EVERY JOURNEY.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#A6A6A6] max-w-xl leading-relaxed">
                Discover genuine engine oils and premium automotive lubricants from trusted brands at H.I Lubricant, Hyderabad. Direct factory refinery seals guaranteed.
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 max-w-md">
                <Link
                  to="/shop"
                  className="px-7 py-4 rounded-xl btn-gold text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-gold-md"
                >
                  <span>EXPLORE PRODUCTS</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/track-order"
                  className="px-7 py-4 rounded-xl bg-[#151616] border border-[#D5A746]/40 hover:border-[#D5A746] text-[#D5A746] hover:text-[#E9C16B] text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all"
                >
                  <Package size={15} />
                  <span>TRACK YOUR ORDER</span>
                </Link>
              </div>

              {/* Supporting Line */}
              <div className="pt-2 flex items-center space-x-3 text-xs text-[#A6A6A6]">
                <div className="w-2 h-2 rounded-full bg-[#D5A746]"></div>
                <span>Quality Products</span>
                <span className="text-[#292722]">•</span>
                <span>Trusted Brands</span>
                <span className="text-[#292722]">•</span>
                <span>Customer Service</span>
              </div>
            </div>

            {/* RIGHT SIDE — 52% (lg:col-span-6): Cinematic Media Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#D5A746]/40 shadow-2xl bg-[#101111] aspect-[16/10] sm:aspect-[16/11]">
                {/* Fallback & Poster Image / Video Element */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80"
                  className="w-full h-full object-cover"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-car-mechanic-pouring-oil-into-an-engine-43093-large.mp4" type="video/mp4" />
                </video>

                {/* Subtle dark gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080909]/90 via-[#080909]/30 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#080909]/40 via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Product Information Card (Bottom-Left) */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl bg-[#080909]/90 backdrop-blur-md border border-[#D5A746]/40 text-xs shadow-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D5A746]">
                      100% Genuine Guaranteed
                    </span>
                  </div>
                  <p className="font-bold text-[#F7F5EF] text-xs">
                    Factory Sealed Refinery Batches
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#A6A6A6] mt-2 pt-2 border-t border-[#292722]">
                    <span>0W-20 to 20W-50 Available</span>
                    <span className="text-[#D5A746] font-semibold">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SLIM BRAND TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl bg-[#151616] border border-[#292722] shadow-xl divide-y lg:divide-y-0 lg:divide-x divide-[#292722]">
          <div className="p-4 sm:p-5 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D5A746]/10 border border-[#D5A746]/30 flex items-center justify-center text-[#D5A746] shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#F7F5EF]">Genuine Lubricants</h4>
              <p className="text-[11px] text-[#A6A6A6]">100% Factory Tamper Sealed</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D5A746]/10 border border-[#D5A746]/30 flex items-center justify-center text-[#D5A746] shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#F7F5EF]">Trusted Automotive Brands</h4>
              <p className="text-[11px] text-[#A6A6A6]">Shell, Caltex, PSO, Honda</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D5A746]/10 border border-[#D5A746]/30 flex items-center justify-center text-[#D5A746] shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#F7F5EF]">Customer Support</h4>
              <p className="text-[11px] text-[#A6A6A6]">Oil Specialist WhatsApp Helpline</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D5A746]/10 border border-[#D5A746]/30 flex items-center justify-center text-[#D5A746] shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#F7F5EF]">Delivery Across Pakistan</h4>
              <p className="text-[11px] text-[#A6A6A6]">Fast Hyderabad & Nationwide Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC 10 OIL CONVERTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OilQuantityCalculator
          title="SMART OIL QUANTITY CONVERTERS"
          subtitle="Choose your preferred oil converter, enter your required quantity and instantly calculate the price in PKR."
        />
      </section>

      {/* 4. EDITORIAL FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D5A746] mb-2">
              Automotive Product Line
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F7F5EF]">
              Explore Lubricant Categories
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D5A746] hover:text-[#E9C16B] transition-colors"
          >
            <span>View All in Catalog</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-2xl overflow-hidden bg-[#151616] border border-[#292722] hover:border-[#D5A746] transition-all duration-300 flex flex-col justify-between h-72 p-5"
            >
              {/* Background category image with overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-25 group-hover:opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-[#080909]/80 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#080909]/80 border border-[#D5A746]/40 text-[#D5A746]">
                  {cat.count}
                </span>
                <h3 className="font-extrabold text-base text-[#F7F5EF] mt-3 group-hover:text-[#D5A746] transition-colors">
                  {cat.name}
                </h3>
              </div>

              <div className="relative z-10 space-y-3">
                <p className="text-[11px] text-[#A6A6A6] line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 border-t border-[#292722] flex items-center justify-between text-xs text-[#D5A746] font-bold group-hover:translate-x-1 transition-transform">
                  <span>Explore Products</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D5A746] mb-2">
              Featured Selections
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F7F5EF]">
              Top Performance Engine Oils
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D5A746] hover:text-[#E9C16B] transition-colors"
          >
            <span>Browse All {featuredProducts.length || ''} Products</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-[#151616] border border-[#292722] animate-pulse"
              ></div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#A6A6A6]">
            No featured products found.
          </div>
        )}
      </section>

      {/* 6. LARGE AUTOMOTIVE BRAND SHOWCASE */}
      <section className="bg-[#101111] border-y border-[#292722] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D5A746] mb-2 block">
              Authorized Stockist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F7F5EF] mb-2">
              Official World-Class Lubricant Brands
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A6A6]">
              Caltex, PSO, Shell, Honda Genuine, and Blaze lubricants directly backed by manufacturer quality guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularBrands.map((b) => (
              <Link
                key={b.name}
                to={`/shop?brand=${encodeURIComponent(b.name)}`}
                className="p-5 rounded-2xl bg-[#151616] border border-[#292722] hover:border-[#D5A746]/60 transition-all hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-extrabold text-base text-[#F7F5EF] group-hover:text-[#D5A746] transition-colors">
                    {b.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#080909] text-[#D5A746] border border-[#292722]">
                    {b.tag}
                  </span>
                </div>
                <p className="text-xs text-[#A6A6A6] leading-relaxed mb-4">{b.desc}</p>
                <span className="text-xs font-semibold text-[#D5A746] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Browse {b.name} Lubricants</span>
                  <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BRAND STORY SECTION (Asymmetrical Split Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Large Automotive Lubricant Imagery */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-[#D5A746]/40 shadow-2xl aspect-[4/3] sm:aspect-[16/10]">
            <img
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80"
              alt="Automotive engine oil maintenance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080909] via-transparent to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#080909]/85 backdrop-blur-md border border-[#292722] text-xs">
              <span className="text-[#D5A746] font-bold block mb-0.5">Physical Retail & Wholesale Depot</span>
              <span className="text-[#F7F5EF]">Tulsi Daas Road, Gari Khata, Hyderabad, Sindh</span>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D5A746]">
              ABOUT H.I LUBRICANT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F7F5EF] leading-tight">
              THE RIGHT OIL MAKES THE DIFFERENCE.
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed">
              In an automotive market crowded with counterfeit and diluted lubricants, H.I Lubricant stands uncompromisingly for genuine quality and engine protection.
            </p>
            <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed">
              Located adjacent to Amma Ayesha Hospital in Hyderabad, we supply original factory-sealed engine oils, motor oils, transmission fluids, and custom open-drum lubricants for individual motorists, commercial transporters, and professional workshops.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl btn-gold text-xs font-bold shadow-gold-sm"
              >
                <span>DISCOVER OUR STORE</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ORDER TRACKING PROMOTION: "YOUR ORDER. YOUR CONTROL." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#101111] via-[#1c1a16] to-[#101111] border border-[#D5A746]/40 shadow-gold-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D5A746] flex items-center space-x-1.5">
                <Truck size={14} />
                <span>Live Delivery Tracking</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F7F5EF] tracking-tight">
                YOUR ORDER. YOUR CONTROL.
              </h2>
              <p className="text-xs sm:text-sm text-[#A6A6A6] max-w-xl leading-relaxed">
                Track your H.I Lubricant order and stay updated throughout the delivery process. Monitor your package from packing to courier rider handover.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#F7F5EF]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={15} className="text-[#D5A746]" />
                  <span>7-Stage Real-Time Timeline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={15} className="text-[#D5A746]" />
                  <span>Verified Phone / Email Protection</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#080909] border border-[#292722] space-y-3.5 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F7F5EF] flex items-center space-x-2">
                  <Search size={15} className="text-[#D5A746]" />
                  <span>Quick Order Lookup</span>
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={homeTrackId}
                    onChange={(e) => setHomeTrackId(e.target.value)}
                    placeholder="Enter Order ID (e.g. HI-2026-10492)"
                    className="w-full px-4 py-3 rounded-xl bg-[#151616] border border-[#292722] text-xs text-[#F7F5EF] placeholder-[#A6A6A6] focus:outline-none focus:border-[#D5A746]"
                  />
                  <Link
                    to={
                      homeTrackId.trim()
                        ? `/track-order?id=${encodeURIComponent(homeTrackId.trim())}`
                        : '/track-order'
                    }
                    className="w-full py-3.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center space-x-2 shadow-gold-sm"
                  >
                    <Package size={15} />
                    <span>TRACK YOUR ORDER</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PREMIUM CONTACT & LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#151616] border border-[#292722]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D5A746]">
                Store Location & Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F7F5EF]">
                H.I Lubricant, Hyderabad
              </h2>
              <p className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed">
                Visit our physical automotive lubricants depot in Hyderabad or order online for delivery right to your workshop or home.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-[#F7F5EF]">
                <div className="flex items-start space-x-2.5">
                  <MapPin size={16} className="text-[#D5A746] shrink-0 mt-0.5" />
                  <span>Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone size={15} className="text-[#D5A746] shrink-0" />
                  <span>Phone: +92 311 3728228</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Clock size={15} className="text-[#D5A746] shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 9:00 PM</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum H.I Lubricant! I want to inquire about lubricant availability at your Hyderabad store.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl btn-gold text-xs font-bold flex items-center space-x-2 shadow-sm"
                >
                  <Phone size={14} />
                  <span>WhatsApp Contact</span>
                </a>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl bg-[#080909] border border-[#292722] hover:border-[#D5A746] text-xs font-bold text-[#F7F5EF] flex items-center space-x-2 transition-colors"
                >
                  <span>Store Directions</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Quick Map Visual Box */}
            <div className="rounded-2xl bg-[#080909] border border-[#292722] p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
                <span className="font-bold text-sm text-[#F7F5EF]">Location Landmark</span>
                <span className="text-[11px] text-[#D5A746] font-semibold">Hyderabad, Sindh</span>
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Tulsi Daas Road connects directly with Gari Khata and Amma Ayesha Hospital. Easily accessible for cars, commercial vehicles, and motorcycles with convenient customer parking.
              </p>
              <div className="p-3.5 rounded-xl bg-[#151616] border border-[#292722] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#F7F5EF]">H.I Lubricant Physical Depot</div>
                  <div className="text-[11px] text-[#A6A6A6]">Gari Khata, Hyderabad</div>
                </div>
                <Link
                  to="/contact"
                  className="px-3 py-1.5 rounded-lg bg-[#D5A746] text-[#080909] text-[11px] font-bold"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
