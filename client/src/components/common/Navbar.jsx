import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, ShieldCheck, MapPin, ExternalLink, Wrench } from 'lucide-react';
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
    { name: 'About Us', path: '/about' },
    { name: 'Contact & Location', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#090909]/95 border-b border-[#292722]">
      {/* Top Announcement Bar */}
      <div className="bg-[#141414] border-b border-[#292722]/60 py-1.5 px-4 text-xs text-[#A5A19A]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7AD55] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D7AD55]"></span>
            </span>
            <span className="font-medium text-[#F5F2EA]">
              {settings.announcement || '100% Genuine Automotive Lubricants in Hyderabad, Sindh.'}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center space-x-1.5 hover:text-[#D7AD55] transition-colors"
            >
              <Phone size={13} className="text-[#D7AD55]" />
              <span>{settings.phone}</span>
            </a>
            <div className="flex items-center space-x-1.5 text-[#A5A19A]">
              <MapPin size={13} className="text-[#D7AD55]" />
              <span>Gari Khata, Hyderabad</span>
            </div>
            <Link
              to="/admin/login"
              className="text-[#A5A19A] hover:text-[#F2D28A] transition-colors flex items-center space-x-1"
            >
              <ShieldCheck size={13} className="text-[#D7AD55]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#1c1a16] to-[#121212] border border-[#D7AD55]/60 flex items-center justify-center p-2 shadow-gold-sm group-hover:border-[#D7AD55] transition-all">
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-[#D7AD55] bg-[#141414] border border-[#292722]'
                    : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#141414]/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#141414] border border-[#292722] text-[#F5F2EA] text-xs font-semibold hover:border-[#D7AD55] hover:text-[#D7AD55] transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>WhatsApp: 0311-3728228</span>
            </a>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-lg bg-[#141414] border border-[#292722] text-[#F5F2EA] hover:border-[#D7AD55] hover:text-[#D7AD55] transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D7AD55] text-[#090909] font-extrabold text-[11px] h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-gold-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#141414] border border-[#292722] text-[#F5F2EA] hover:text-[#D7AD55]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-[#292722] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#191919] text-[#D7AD55] border border-[#292722]'
                    : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#141414]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#292722] space-y-2">
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-[#191919] border border-[#292722] text-xs font-semibold text-[#D7AD55]"
            >
              <span>Instant WhatsApp Inquiry: 0311-3728228</span>
            </a>

            <div className="flex justify-between items-center pt-2 px-1 text-xs text-[#A5A19A]">
              <span>Near Gari Khata, Hyderabad</span>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#D7AD55] hover:underline"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
