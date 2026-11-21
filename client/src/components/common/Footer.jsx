import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  const brands = ['Shell', 'Caltex', 'PSO', 'Honda Genuine', 'Blaze', 'ZIC', 'Total'];

  return (
    <footer className="bg-[#0e0e0e] border-t border-[#292722] text-[#A5A19A] text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c1a16] to-[#121212] border border-[#D7AD55]/60 flex items-center justify-center p-1.5 shadow-gold-sm">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="42" stroke="#D7AD55" strokeWidth="6" fill="none" />
                  <path d="M35 30 L65 30 L65 42 L55 42 L55 70 L45 70 L45 42 L35 42 Z" fill="#D7AD55" />
                  <circle cx="68" cy="65" r="6" fill="#F2D28A" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider text-[#F5F2EA]">
                  H.I LUBRICANT
                </span>
                <p className="text-[10px] tracking-widest text-[#D7AD55] font-semibold uppercase">
                  Power Your Journey
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A5A19A] leading-relaxed">
              Your trusted partner for 100% original, factory-sealed automotive lubricants, engine oils, and fluids in Hyderabad, Sindh. We guarantee authenticity on every bottle.
            </p>

            <div className="flex items-center space-x-2 text-xs text-[#D7AD55] font-medium pt-1">
              <ShieldCheck size={16} />
              <span>100% Genuine Product Guarantee</span>
            </div>
          </div>

          {/* Supported Brands */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F2EA]">
              Authorized Brands
            </h3>
            <ul className="space-y-2 text-xs">
              {brands.map((brand) => (
                <li key={brand} className="flex items-center space-x-2">
                  <CheckCircle2 size={13} className="text-[#D7AD55]" />
                  <Link
                    to={`/shop?brand=${encodeURIComponent(brand.split(' ')[0])}`}
                    className="hover:text-[#F2D28A] transition-colors"
                  >
                    {brand} Lubricants
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F2EA]">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>Browse Product Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/oil-converters" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1 text-[#D7AD55]">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>Smart Oil Converters</span>
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1 text-[#D7AD55]">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>About Our Business</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>Contact & Store Directions</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>View Shopping Cart</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#F2D28A] transition-colors flex items-center space-x-1 text-[#D7AD55]/80">
                  <ArrowRight size={12} className="text-[#D7AD55]" />
                  <span>Administrator Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Physical Location & Store Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F2EA]">
              Store Location & Contact
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin size={16} className="text-[#D7AD55] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-[#F5F2EA]">
                  {settings.address || 'Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.'}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone size={14} className="text-[#D7AD55] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#F2D28A] transition-colors text-[#F5F2EA]">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail size={14} className="text-[#D7AD55] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#F2D28A] transition-colors text-[#F5F2EA]">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start space-x-2.5 pt-1">
                <Clock size={14} className="text-[#D7AD55] shrink-0 mt-0.5" />
                <span className="text-[#A5A19A] text-[11px]">
                  {settings.businessHours || 'Monday – Saturday: 9:00 AM – 9:00 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292722] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} H.I Lubricant. All Rights Reserved. Hyderabad, Sindh, Pakistan.</p>
          <div className="flex items-center space-x-6 text-[#A5A19A]">
            <span>100% Genuine Oils</span>
            <span>•</span>
            <span>Wholesale & Retail</span>
            <span>•</span>
            <span className="text-[#D7AD55]">Power Your Journey</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
