import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Users,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Droplets,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Product Management', path: '/admin/products', icon: Package },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Oil Converters', path: '/admin/oil-converters', icon: Droplets },
    { name: 'Inventory Control', path: '/admin/inventory', icon: Layers },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
    { name: 'Contact Inquiries', path: '/admin/messages', icon: Mail },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
    { name: 'Account & Security', path: '/admin/settings/security', icon: ShieldCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard';
    if (path === '/admin/settings') return location.pathname === '/admin/settings';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F2EA] flex flex-col md:flex-row">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#141414] border-r border-[#292722] shrink-0 justify-between">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-[#292722] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#191919] border border-[#D7AD55]/60 flex items-center justify-center p-1.5 shadow-gold-sm">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" stroke="#D7AD55" strokeWidth="6" fill="none" />
                <path d="M35 30 L65 30 L65 42 L55 42 L55 70 L45 70 L45 42 L35 42 Z" fill="#D7AD55" />
                <circle cx="68" cy="65" r="6" fill="#F2D28A" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-[#F5F2EA] block">
                H.I LUBRICANT
              </span>
              <span className="text-[10px] text-[#D7AD55] font-bold uppercase tracking-widest">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#191919] text-[#D7AD55] border border-[#D7AD55]/40 shadow-sm'
                      : 'text-[#A5A19A] hover:text-[#F5F2EA] hover:bg-[#191919]/60'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-[#D7AD55]' : 'text-[#A5A19A]'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User & Logout */}
        <div className="p-4 border-t border-[#292722] space-y-3">
          <div className="px-3 py-2 rounded-xl bg-[#191919] border border-[#292722] flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-bold text-[#F5F2EA] truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-[#A5A19A] uppercase tracking-wider font-semibold">
                {user?.role || 'Super Admin'}
              </div>
            </div>
            <ShieldCheck size={16} className="text-[#D7AD55] shrink-0" />
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-[#191919] border border-[#292722] hover:border-[#D7AD55] text-xs font-semibold text-[#F5F2EA] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>View Store</span>
              <ExternalLink size={12} />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/50 transition-colors"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#292722]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-[#191919] border border-[#292722] text-[#F5F2EA]"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-extrabold text-sm text-[#F5F2EA]">H.I Admin</span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="px-2.5 py-1.5 rounded-lg bg-[#191919] border border-[#292722] text-xs text-[#D7AD55] flex items-center space-x-1"
          >
            <span>Store</span>
            <ExternalLink size={11} />
          </Link>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR MODAL */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex">
          <div className="w-64 h-full bg-[#141414] border-r border-[#292722] p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#292722]">
                <span className="font-bold text-sm text-[#F5F2EA]">Admin Console</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X size={18} className="text-[#A5A19A]" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                        active
                          ? 'bg-[#191919] text-[#D7AD55] border border-[#D7AD55]/40'
                          : 'text-[#A5A19A] hover:text-[#F5F2EA]'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#292722]">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
