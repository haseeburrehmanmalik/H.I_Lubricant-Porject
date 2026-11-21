import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, ShieldCheck, CheckCircle2, Truck, ArrowLeft, Phone } from 'lucide-react';
import OilQuantityCalculator from '../components/shop/OilQuantityCalculator';
import { useSettings } from '../context/SettingsContext';

const OilConverters = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between border-b border-[#292722] pb-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs text-[#A5A19A] hover:text-[#D7AD55] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center space-x-2 text-xs text-[#D7AD55] font-semibold">
          <ShieldCheck size={14} />
          <span>100% Genuine Bulk Refineries</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141414] via-[#1c1a16] to-[#141414] border border-[#292722] text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#191919] border border-[#D7AD55]/40 text-[#D7AD55] text-xs font-bold uppercase tracking-wider mb-2">
          <Droplets size={14} />
          <span>Custom Volume Measurement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight">
          Smart Oil Quantity Converters
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A19A] max-w-2xl mx-auto leading-relaxed">
          Order exact engine oil volumes directly from verified refinery drums. Perfect for custom bike engine capacities, car sumps, and commercial workshop requirements.
        </p>
      </div>

      {/* Main 10 Oil Converters Calculator Component */}
      <OilQuantityCalculator
        title="10 DYNAMIC OIL CONVERTER SLOTS"
        subtitle="Select from our 10 dynamic oil grades below. Enter your exact volume in millilitres or litres for instantaneous real-time pricing in PKR."
      />

      {/* Value Trust Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#292722]">
        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D7AD55]/10 border border-[#D7AD55]/20 flex items-center justify-center text-[#D7AD55] shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F5F2EA] mb-1">Guaranteed Original Drums</h4>
            <p className="text-[11px] text-[#A5A19A] leading-relaxed">
              We never blend or dilute. Oils are drawn straight from sealed manufacturer barrels.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D7AD55]/10 border border-[#D7AD55]/20 flex items-center justify-center text-[#D7AD55] shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F5F2EA] mb-1">Precision Volume Measurement</h4>
            <p className="text-[11px] text-[#A5A19A] leading-relaxed">
              Need exactly 750 ml or 3.2 Litres? We dispense the exact amount so you pay only for what you need.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414] border border-[#292722] flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D7AD55]/10 border border-[#D7AD55]/20 flex items-center justify-center text-[#D7AD55] shrink-0">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F5F2EA] mb-1">Sealed Container Delivery</h4>
            <p className="text-[11px] text-[#A5A19A] leading-relaxed">
              Dispatched in clean, leak-proof, food-grade HDPE bottles across Hyderabad and all Pakistan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OilConverters;
