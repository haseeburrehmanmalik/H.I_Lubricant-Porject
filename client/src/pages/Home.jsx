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
} from 'lucide-react';
import { productService } from '../services/productService';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/shop/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const viscosities = ['0W-20', '5W-30', '10W-40', '20W-50', '15W-40', 'ATF Synthetic'];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#292722]">
        {/* Subtle background ambient gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-[#090909] to-[#090909] z-0"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D7AD55]/10 blur-[130px] rounded-full pointer-events-none"></div>

        {/* Ambient subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D7AD55 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#191919] border border-[#D7AD55]/40 text-[#D7AD55] text-xs font-bold uppercase tracking-wider mb-8 shadow-gold-sm animate-fadeIn">
            <Sparkles size={14} />
            <span>Authorized Automotive Lubricants Dealer • Hyderabad</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F2EA] max-w-4xl mx-auto leading-[1.1] mb-6">
            Every Journey Deserves{' '}
            <span className="gold-gradient-text block sm:inline">Better Oil.</span>
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-lg sm:text-xl text-[#A5A19A] max-w-2xl mx-auto leading-relaxed mb-10">
            H.I Lubricant delivers 100% authentic, factory-sealed engine oils, motor oils, and fluids from world-leading brands. Protect your engine with guaranteed genuine formulas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-xl btn-gold text-sm font-bold flex items-center justify-center space-x-2 shadow-gold-md"
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href={`https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-[#F5F2EA] hover:text-[#D7AD55] text-sm font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Phone size={16} className="text-[#D7AD55]" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-[#292722]/80 text-left">
            <div className="p-3 rounded-lg bg-[#141414]/60 border border-[#292722]">
              <div className="text-xs text-[#A5A19A] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <ShieldCheck size={14} className="text-[#D7AD55]" />
                <span>100% Genuine</span>
              </div>
              <p className="text-xs font-semibold text-[#F5F2EA]">Direct Factory Sealed</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141414]/60 border border-[#292722]">
              <div className="text-xs text-[#A5A19A] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Truck size={14} className="text-[#D7AD55]" />
                <span>Fast Dispatch</span>
              </div>
              <p className="text-xs font-semibold text-[#F5F2EA]">Hyderabad & Nationwide</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141414]/60 border border-[#292722]">
              <div className="text-xs text-[#A5A19A] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Award size={14} className="text-[#D7AD55]" />
                <span>Verified Brands</span>
              </div>
              <p className="text-xs font-semibold text-[#F5F2EA]">Shell, Caltex, PSO, Honda</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141414]/60 border border-[#292722]">
              <div className="text-xs text-[#A5A19A] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Zap size={14} className="text-[#D7AD55]" />
                <span>Best Pricing</span>
              </div>
              <p className="text-xs font-semibold text-[#F5F2EA]">Wholesale & Retail Rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISCOSITY SELECTOR SHORTCUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-[#F5F2EA] flex items-center justify-center md:justify-start space-x-2">
              <Layers size={18} className="text-[#D7AD55]" />
              <span>Looking for a specific Viscosity Grade?</span>
            </h3>
            <p className="text-xs text-[#A5A19A]">
              Filter authentic oils by engine manufacturer recommendations
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {viscosities.map((grade) => (
              <Link
                key={grade}
                to={`/shop?viscosity=${encodeURIComponent(grade)}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-bold text-[#F5F2EA] hover:text-[#D7AD55] transition-all"
              >
                {grade}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#D7AD55] mb-2">
              Premium Selections
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA]">
              Featured Lubricants & Engine Oils
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D7AD55] hover:text-[#F2D28A] transition-colors"
          >
            <span>View All Products</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 rounded-xl bg-[#191919] border border-[#292722] animate-pulse"
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
          <div className="text-center py-12 text-[#A5A19A]">
            No featured products found. Visit the shop to view all products.
          </div>
        )}
      </section>

      {/* 4. POPULAR BRANDS SECTION */}
      <section className="bg-[#141414] border-y border-[#292722] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7AD55] mb-2 block">
              Certified Partnerships
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA] mb-3">
              Official World-Class Lubricant Brands
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A19A]">
              We supply only original lubricants directly backed by manufacturer quality guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularBrands.map((b) => (
              <Link
                key={b.name}
                to={`/shop?brand=${encodeURIComponent(b.name)}`}
                className="p-5 rounded-xl bg-[#191919] border border-[#292722] hover:border-[#D7AD55]/60 transition-all hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-extrabold text-base text-[#F5F2EA] group-hover:text-[#D7AD55] transition-colors">
                    {b.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#090909] text-[#D7AD55] border border-[#292722]">
                    {b.tag}
                  </span>
                </div>
                <p className="text-xs text-[#A5A19A] leading-relaxed mb-4">{b.desc}</p>
                <span className="text-xs font-semibold text-[#D7AD55] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Browse {b.name}</span>
                  <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE H.I LUBRICANT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D7AD55] mb-2 block">
            The H.I Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA] mb-3">
            Why Motorists & Workshops Rely On Us
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A19A]">
            In an automotive market crowded with counterfeit engine oils, we stand uncompromisingly for genuine quality and engine protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#191919] border border-[#292722] relative overflow-hidden group hover:border-[#D7AD55]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#D7AD55]/15 border border-[#D7AD55]/30 flex items-center justify-center text-[#D7AD55] mb-5">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#F5F2EA] mb-2">Zero Counterfeit Tolerance</h3>
            <p className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
              Every single bottle and can in our store originates directly from official refineries and authorized distributors. Factory tamper seals intact, guaranteed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#191919] border border-[#292722] relative overflow-hidden group hover:border-[#D7AD55]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#D7AD55]/15 border border-[#D7AD55]/30 flex items-center justify-center text-[#D7AD55] mb-5">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#F5F2EA] mb-2">Physical Hyderabad Presence</h3>
            <p className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
              Located near Gari Khata, Amma Ayesha Hospital in Hyderabad. You can visit our store in person, inspect the packaging, and pick up your lubricants on the spot.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#191919] border border-[#292722] relative overflow-hidden group hover:border-[#D7AD55]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#D7AD55]/15 border border-[#D7AD55]/30 flex items-center justify-center text-[#D7AD55] mb-5">
              <Phone size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#F5F2EA] mb-2">Expert Oil Consultation</h3>
            <p className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
              Unsure whether your car needs 0W-20 or 5W-30? Chat with our lubricant specialists on WhatsApp for personalized recommendation based on your car's mileage and engine type.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HYDERABAD STORE LOCATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141414] via-[#191919] to-[#141414] border border-[#292722] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D7AD55]">
                Visit Our Physical Outlet
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA]">
                H.I Lubricant Store, Hyderabad
              </h2>
              <p className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
                Whether you need a single 4-litre pack for your family sedan or wholesale quantities for commercial fleets and workshops, our Hyderabad inventory is fully stocked.
              </p>

              <div className="space-y-2 pt-2 text-xs text-[#F5F2EA]">
                <div className="flex items-center space-x-2">
                  <MapPin size={15} className="text-[#D7AD55]" />
                  <span>Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={15} className="text-[#D7AD55]" />
                  <span>Mon – Sat: 9:00 AM – 9:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={15} className="text-[#D7AD55]" />
                  <span>Call / WhatsApp: +92 311 3728228</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl btn-gold text-xs font-bold flex items-center space-x-2 shadow-sm"
                >
                  <span>Get Directions</span>
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum H.I Lubricant! I want to inquire about lubricant availability at your Hyderabad store.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#090909] border border-[#292722] hover:border-[#D7AD55] text-xs font-bold text-[#F5F2EA] flex items-center space-x-2 transition-colors"
                >
                  <Phone size={14} className="text-[#D7AD55]" />
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Map Visual Box */}
            <div className="rounded-2xl bg-[#090909] border border-[#292722] p-6 flex flex-col justify-between space-y-4 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
                <span className="font-bold text-sm text-[#F5F2EA]">Location Landmark</span>
                <span className="text-[11px] text-[#D7AD55] font-semibold">Hyderabad, Sindh</span>
              </div>
              <p className="text-xs text-[#A5A19A] leading-relaxed">
                Tulsi Daas Road runs through the heart of Hyderabad's prominent automotive hubs, right adjacent to Amma Ayesha Hospital and Gari Khata. Easy parking and convenient access for all motorists.
              </p>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#292722]/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F5F2EA]">H.I Lubricant</div>
                  <div className="text-[11px] text-[#A5A19A]">Gari Khata, Hyderabad, Sindh</div>
                </div>
                <Link
                  to="/contact"
                  className="px-3 py-1.5 rounded-lg bg-[#D7AD55] text-[#090909] text-[11px] font-bold hover:bg-[#F2D28A]"
                >
                  View Map
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
