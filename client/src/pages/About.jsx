import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();

  const brands = [
    { name: 'Shell', desc: 'Gas-to-liquid PurePlus technology with ultimate sludge protection.' },
    { name: 'Caltex', desc: 'Havoline and Delo deposit shield formulations engineered by Chevron.' },
    { name: 'PSO', desc: 'Premier Pakistani national petroleum lubricants designed for local roads.' },
    { name: 'Honda', desc: 'Official Japanese OEM lubricants calibrated for high-precision engines.' },
    { name: 'Blaze', desc: 'High thermal endurance formulations for heavy commercial and city use.' },
    { name: 'ZIC', desc: 'South Korean YUBASE Group III synthetic base motor oils.' },
    { name: 'Total', desc: 'French Age Resistance Technology protecting under intense engine pressure.' },
  ];

  return (
    <div className="space-y-16 py-10">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#D7AD55]/40 text-[#D7AD55] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Our Story & Mission</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight max-w-3xl mx-auto">
          Powering Every Journey with{' '}
          <span className="gold-gradient-text">Authentic Lubricants.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#A5A19A] max-w-2xl mx-auto leading-relaxed">
          At H.I Lubricant, we are committed to safeguarding vehicle engines across Hyderabad and Sindh by providing 100% original, verified motor oils and fluids.
        </p>
      </section>

      {/* Main Business Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
            <h2 className="text-2xl font-extrabold text-[#F5F2EA]">
              Built on Trust, Authenticity, and Automotive Passion
            </h2>

            <p>
              Founded in Hyderabad, Sindh, <strong>H.I Lubricant</strong> was established with a singular mission: to eradicate counterfeit and adulterated engine oils from motorists' vehicles. The modern combustion engine requires precision lubrication, and counterfeit oils cause catastrophic internal friction, premature timing chain wear, and costly breakdowns.
            </p>

            <p>
              Operating directly from our retail and wholesale hub near Gari Khata, Tulsi Daas Road, adjacent to Amma Ayesha Hospital, we maintain direct supplier relationships with authorized refiners and brand distributors for Shell, Caltex, Pakistan State Oil (PSO), Honda Genuine, Blaze, ZIC, and Total.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#292722]">
                <div className="text-xl font-extrabold text-[#D7AD55]">100%</div>
                <div className="text-xs text-[#F5F2EA] font-semibold mt-0.5">Authenticity Guaranteed</div>
                <div className="text-[11px] text-[#A5A19A] mt-1">Every can factory sealed</div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#292722]">
                <div className="text-xl font-extrabold text-[#D7AD55]">Wholesale & Retail</div>
                <div className="text-xs text-[#F5F2EA] font-semibold mt-0.5">Competitive PKR Rates</div>
                <div className="text-[11px] text-[#A5A19A] mt-1">For drivers and workshops</div>
              </div>
            </div>
          </div>

          {/* Location & Brand Card */}
          <div className="p-8 rounded-3xl bg-[#141414] border border-[#292722] space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#292722]">
              <div className="w-12 h-12 rounded-xl bg-[#191919] border border-[#D7AD55]/60 flex items-center justify-center p-2 shadow-gold-sm">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="42" stroke="#D7AD55" strokeWidth="6" fill="none" />
                  <path d="M35 30 L65 30 L65 42 L55 42 L55 70 L45 70 L45 42 L35 42 Z" fill="#D7AD55" />
                  <circle cx="68" cy="65" r="6" fill="#F2D28A" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#F5F2EA]">H.I LUBRICANT</h3>
                <p className="text-xs text-[#D7AD55] font-semibold uppercase tracking-widest">
                  Power Your Journey
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#D7AD55] shrink-0 mt-0.5" />
                <div className="text-[#F5F2EA] leading-relaxed">
                  <strong>Store Location:</strong>
                  <br />
                  Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-[#D7AD55] shrink-0" />
                <div className="text-[#F5F2EA]">
                  <strong>Phone / WhatsApp:</strong> {settings.phone || '+92 311 3728228'}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-[#D7AD55] shrink-0" />
                <div className="text-[#F5F2EA]">
                  <strong>Email:</strong> {settings.email || 'malikimranali42@yahoo.com'}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock size={18} className="text-[#D7AD55] shrink-0" />
                <div className="text-[#A5A19A]">
                  <strong>Store Hours:</strong> Mon – Sat: 9:00 AM – 9:00 PM
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="w-full py-3 rounded-xl btn-gold text-xs font-bold flex items-center justify-center space-x-2 shadow-gold-sm"
              >
                <span>Visit Us or Send an Inquiry</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Portfolio */}
      <section className="bg-[#141414] border-y border-[#292722] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7AD55] mb-2 block">
              Our Brands
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA]">
              Authorized Lubricants Portfolio
            </h2>
            <p className="text-xs text-[#A5A19A] mt-2">
              We stock authentic formulations covering Japanese compacts, local sedans, diesel commercial fleets, and motorcycles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((b) => (
              <div key={b.name} className="p-6 rounded-2xl bg-[#191919] border border-[#292722] space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-[#D7AD55]" />
                  <h3 className="font-bold text-base text-[#F5F2EA]">{b.name} Lubricants</h3>
                </div>
                <p className="text-xs text-[#A5A19A] leading-relaxed">{b.desc}</p>
                <Link
                  to={`/shop?brand=${encodeURIComponent(b.name)}`}
                  className="inline-flex items-center space-x-1 text-xs text-[#D7AD55] font-semibold hover:underline pt-2"
                >
                  <span>Explore {b.name} range</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
