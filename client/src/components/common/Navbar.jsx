import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Search,
  PackageCheck,
  Compass,
  Droplets,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { settings } = useSettings();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Products', path: '/shop' },
    { name: 'Oil Converters', path: '/oil-converters' },
    { name: 'About Us', path: '/about' },
    { name: 'Track Order', path: '/track-order', highlight: true },
    { name: 'Contact & Location', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const whatsappPhone = (settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#090909]/95 border-b border-[#292722]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Logo & Brand Name & HYD Badge */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1c1a16] to-[#121212] border border-[#D7AD55]/60 flex items-center justify-center p-2 shadow-gold-sm group-hover:border-[#D7AD55] transition-all">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" stroke="#D7AD55" strokeWidth="6" fill="none" />
                <path d="M35 30 L65 30 L65 42 L55 42 L55 70 L45 70 L45 42 L35 42 Z" fill="#D7AD55" />
                <circle cx="68" cy="65" r="6" fill="#F2D28A" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider text-[#F5F2EA] group-hover:text-[#F2D28A] transition-colors">
                  H.I LUBRICANT
                </span>
                <span className="bg-[#D7AD55]/15 text-[#D7AD55] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#D7AD55]/30">
                  HYD
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#A5A19A] font-semibold">
                Power Your Journey
              </p>
            </div>
          </Link>

          {/* Center: Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'text-[#D7AD55] bg-[#141414] border border-[#D7AD55]/40 shadow-sm'
                      : link.highlight
                      ? 'text-[#F5F2EA] hover:text-[#D7AD55] hover:bg-[#141414] border border-[#292722]/70'
                      : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#141414]/60'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    {link.highlight && <PackageCheck size={14} className={active ? 'text-[#D7AD55]' : 'text-[#D7AD55]/80'} />}
                    <span>{link.name}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side: WhatsApp Button & Shopping Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* WhatsApp Contact CTA */}
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#141414] border border-[#292722] text-[#F5F2EA] text-xs font-semibold hover:border-[#D7AD55] hover:text-[#D7AD55] transition-all shadow-sm"
              title="Chat with H.I Lubricant on WhatsApp"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Phone size={13} className="text-[#25D366]" />
              <span className="font-bold">0311-3728228</span>
            </a>

            {/* Shopping Cart Icon with Live Badge */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-[#141414] border border-[#292722] text-[#F5F2EA] hover:border-[#D7AD55] hover:text-[#D7AD55] transition-all shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={19} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D7AD55] text-[#090909] font-extrabold text-[11px] h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-gold-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#141414] border border-[#292722] text-[#F5F2EA] hover:text-[#D7AD55]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-[#292722] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors ${
                    active
                      ? 'bg-[#191919] text-[#D7AD55] border border-[#D7AD55]/40'
                      : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#141414]'
                  }`}
                >
                  {link.highlight && <PackageCheck size={15} className="text-[#D7AD55]" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#292722] space-y-2">
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-[#141414] border border-[#292722] text-xs font-bold text-[#D7AD55]"
            >
              <Phone size={14} className="text-[#25D366]" />
              <span>WhatsApp Inquiry: +92 311 3728228</span>
            </a>

            <div className="flex justify-between items-center pt-2 px-1 text-xs text-[#A5A19A]">
              <span>Gari Khata, Hyderabad</span>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#D7AD55] hover:underline flex items-center space-x-1"
              >
                <ShieldCheck size={12} />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
