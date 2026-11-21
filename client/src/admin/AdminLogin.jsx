import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@hilubricant.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@hilubricant.com');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D7AD55]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c1a16] to-[#121212] border border-[#D7AD55] flex items-center justify-center p-2.5 mx-auto shadow-gold-sm">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="42" stroke="#D7AD55" strokeWidth="6" fill="none" />
              <path d="M35 30 L65 30 L65 42 L55 42 L55 70 L45 70 L45 42 L35 42 Z" fill="#D7AD55" />
              <circle cx="68" cy="65" r="6" fill="#F2D28A" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-wide">
            H.I LUBRICANT
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#D7AD55] font-bold">
            Administrative Control Center
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-[#141414] border border-[#292722] shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#292722]">
            <span className="text-sm font-bold text-[#F5F2EA]">Admin Authentication</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#191919] text-[#D7AD55] border border-[#292722]">
              JWT Protected
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center space-x-2.5 text-red-300 text-xs">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A5A19A] block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A19A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hilubricant.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A5A19A] block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5A19A]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center space-x-2 shadow-gold-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Database...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-[#292722] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#A5A19A]">
              <span>Default Credentials:</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[#D7AD55] hover:underline font-semibold flex items-center space-x-1"
              >
                <Sparkles size={11} />
                <span>Fill Credentials</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-[#090909] border border-[#292722] text-[11px] text-[#A5A19A] space-y-0.5">
              <div>Email: <strong className="text-[#F5F2EA]">admin@hilubricant.com</strong></div>
              <div>Password: <strong className="text-[#F5F2EA]">Admin@123456</strong></div>
            </div>
          </div>
        </div>

        {/* Back to Customer Store */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-[#A5A19A] hover:text-[#D7AD55] transition-colors"
          >
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
