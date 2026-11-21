import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  LogOut,
  Clock,
  UserCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

const AdminSecurity = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Account metadata state
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: '',
  });
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Logout all sessions state
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAccountInfo();
      if (res.success && res.account) {
        setAccount(res.account);
      }
    } catch (err) {
      console.error('Failed to load account details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  // Password criteria verification
  const newPass = passwordForm.newPassword;
  const hasMinLength = newPass.length >= 12;
  const hasUpper = /[A-Z]/.test(newPass);
  const hasLower = /[a-z]/.test(newPass);
  const hasNumber = /[0-9]/.test(newPass);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(newPass);
  const passwordsMatch = newPass && newPass === passwordForm.confirmPassword;
  const isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && passwordsMatch;

  // Handle email change
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    if (emailForm.newEmail.toLowerCase().trim() !== emailForm.confirmEmail.toLowerCase().trim()) {
      setEmailError('New email and confirm email do not match.');
      return;
    }

    setEmailLoading(true);
    try {
      const res = await adminService.changeEmail({
        newEmail: emailForm.newEmail.trim(),
        confirmEmail: emailForm.confirmEmail.trim(),
        currentPassword: emailForm.currentPassword,
      });

      if (res.success) {
        setEmailSuccess('Email updated successfully! Session invalidated. Redirecting to login...');
        setEmailForm({ newEmail: '', confirmEmail: '', currentPassword: '' });

        setTimeout(() => {
          logout();
          navigate('/admin/login', {
            state: { message: 'Email address updated. Please sign in with your new email.' },
          });
        }, 2200);
      }
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to update email address.');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!isPasswordValid) {
      setPasswordError('Please meet all required password criteria before updating.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await adminService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      if (res.success) {
        setPasswordSuccess('Password updated successfully! All active sessions terminated. Redirecting...');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

        setTimeout(() => {
          logout();
          navigate('/admin/login', {
            state: { message: 'Password updated successfully. Please log in with your new password.' },
          });
        }, 2200);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle logout all sessions
  const handleLogoutAll = async () => {
    if (!window.confirm('Are you sure you want to invalidate all active administrator sessions? You will be signed out.')) {
      return;
    }
    setLogoutAllLoading(true);
    try {
      await adminService.logoutAllSessions();
      logout();
      navigate('/admin/login', {
        state: { message: 'All active sessions have been terminated. Please log in again.' },
      });
    } catch (err) {
      alert('Failed to logout all sessions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLogoutAllLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
              Account & Security Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#191919] border border-[#D7AD55]/40 text-[#D7AD55] text-xs font-bold">
              Root Administrator
            </span>
          </div>
          <p className="text-xs text-[#A5A19A] mt-1">
            Manage your administrative login credentials, update your email address, and enforce high-grade security policies.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAccount}
          className="p-2.5 rounded-xl bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-xs font-bold text-[#A5A19A] hover:text-[#F5F2EA] self-start sm:self-auto transition-all"
          title="Refresh account details"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* SECTION 1: ACCOUNT INFORMATION DISPLAY */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#D7AD55] flex items-center space-x-2">
          <ShieldCheck size={16} />
          <span>Security Metadata & Session Info</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#090909] border border-[#292722]">
            <span className="text-[10px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Current Admin Email
            </span>
            <strong className="text-sm font-bold text-[#F5F2EA] truncate block mt-1">
              {account?.email || 'Loading...'}
            </strong>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090909] border border-[#292722]">
            <span className="text-[10px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Account Created
            </span>
            <span className="text-sm font-bold text-[#F5F2EA] block mt-1">
              {account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090909] border border-[#292722]">
            <span className="text-[10px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Last Password Change
            </span>
            <span className="text-sm font-bold text-[#D7AD55] block mt-1">
              {account?.lastPasswordChange
                ? new Date(account.lastPasswordChange).toLocaleDateString()
                : 'Initial Setup'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090909] border border-[#292722]">
            <span className="text-[10px] text-[#A5A19A] uppercase tracking-wider block font-semibold">
              Last Login Recorded
            </span>
            <span className="text-sm font-bold text-[#F5F2EA] block mt-1">
              {account?.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : 'Current Session'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-[#292722]">
          <span className="text-[#A5A19A] text-[11px]">
            Password hashes are never transmitted or exposed in frontend code.
          </span>
          <button
            type="button"
            onClick={handleLogoutAll}
            disabled={logoutAllLoading}
            className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-300 text-xs font-bold flex items-center space-x-1.5 transition-colors self-stretch sm:self-auto justify-center disabled:opacity-50"
          >
            <LogOut size={13} />
            <span>{logoutAllLoading ? 'Terminating...' : 'Terminate All Active Sessions'}</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN GRID FOR EMAIL & PASSWORD UPDATES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* SECTION 2: CHANGE ADMIN EMAIL */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-[#292722] space-y-5">
          <div className="pb-3 border-b border-[#292722]">
            <h2 className="text-base font-extrabold text-[#F5F2EA] flex items-center space-x-2">
              <Mail size={18} className="text-[#D7AD55]" />
              <span>Change Admin Email</span>
            </h2>
            <p className="text-xs text-[#A5A19A] mt-1">
              Update your primary login email address. You will be asked to sign in again.
            </p>
          </div>

          {emailSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{emailSuccess}</span>
            </div>
          )}

          {emailError && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{emailError}</span>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
            {/* Current Email (Read-only) */}
            <div className="space-y-1">
              <label className="font-semibold text-[#A5A19A] block">
                Current Registered Email (Read-Only)
              </label>
              <input
                type="text"
                readOnly
                value={account?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090909] border border-[#292722] text-[#A5A19A] cursor-not-allowed font-medium"
              />
            </div>

            {/* New Email */}
            <div className="space-y-1">
              <label className="font-semibold text-[#F5F2EA] block">
                New Email Address *
              </label>
              <input
                type="email"
                required
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                placeholder="newadmin@hilubricant.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
              />
            </div>

            {/* Confirm New Email */}
            <div className="space-y-1">
              <label className="font-semibold text-[#F5F2EA] block">
                Confirm New Email Address *
              </label>
              <input
                type="email"
                required
                value={emailForm.confirmEmail}
                onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
                placeholder="Re-enter new email address"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
              />
            </div>

            {/* Current Password Verification */}
            <div className="space-y-1">
              <label className="font-semibold text-[#F5F2EA] block">
                Current Password (Verification Required) *
              </label>
              <div className="relative">
                <input
                  type={showEmailPassword ? 'text' : 'password'}
                  required
                  value={emailForm.currentPassword}
                  onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                  placeholder="Enter current password to authorize"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPassword(!showEmailPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5A19A] hover:text-[#F5F2EA]"
                >
                  {showEmailPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-3 rounded-xl btn-gold text-xs font-bold transition-all shadow-gold-sm disabled:opacity-50"
              >
                {emailLoading ? 'Verifying & Updating Email...' : 'Update Admin Email'}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 3: CHANGE ADMIN PASSWORD */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#141414] border border-[#292722] space-y-5">
          <div className="pb-3 border-b border-[#292722]">
            <h2 className="text-base font-extrabold text-[#F5F2EA] flex items-center space-x-2">
              <Lock size={18} className="text-[#D7AD55]" />
              <span>Change Admin Password</span>
            </h2>
            <p className="text-xs text-[#A5A19A] mt-1">
              Update to a high-entropy password (min 12 characters with mixed complexity).
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="font-semibold text-[#F5F2EA] block">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5A19A] hover:text-[#F5F2EA]"
                >
                  {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="font-semibold text-[#F5F2EA] block">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Min 12 characters with upper, lower, number, special"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5A19A] hover:text-[#F5F2EA]"
                >
                  {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="font-semibold text-[#F5F2EA] block">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:outline-none focus:border-[#D7AD55]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5A19A] hover:text-[#F5F2EA]"
                >
                  {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Dynamic Password Policy Checklist */}
            <div className="p-3.5 rounded-2xl bg-[#090909] border border-[#292722] space-y-1.5 text-[11px]">
              <span className="font-bold text-[#A5A19A] uppercase tracking-wider block mb-1">
                Password Strength Checklist:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-400 font-bold' : 'text-[#A5A19A]'}`}>
                  <CheckCircle2 size={13} className={hasMinLength ? 'text-emerald-400' : 'text-[#292722]'} />
                  <span>At least 12 characters</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasUpper ? 'text-emerald-400 font-bold' : 'text-[#A5A19A]'}`}>
                  <CheckCircle2 size={13} className={hasUpper ? 'text-emerald-400' : 'text-[#292722]'} />
                  <span>Uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasLower ? 'text-emerald-400 font-bold' : 'text-[#A5A19A]'}`}>
                  <CheckCircle2 size={13} className={hasLower ? 'text-emerald-400' : 'text-[#292722]'} />
                  <span>Lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasNumber ? 'text-emerald-400 font-bold' : 'text-[#A5A19A]'}`}>
                  <CheckCircle2 size={13} className={hasNumber ? 'text-emerald-400' : 'text-[#292722]'} />
                  <span>Numeric number (0-9)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasSpecial ? 'text-emerald-400 font-bold' : 'text-[#A5A19A]'}`}>
                  <CheckCircle2 size={13} className={hasSpecial ? 'text-emerald-400' : 'text-[#292722]'} />
                  <span>Special symbol (!@#$)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${passwordsMatch ? 'text-emerald-400 font-bold' : 'text-[#A5A19A]'}`}>
                  <CheckCircle2 size={13} className={passwordsMatch ? 'text-emerald-400' : 'text-[#292722]'} />
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading || !isPasswordValid}
                className="w-full py-3 rounded-xl btn-gold text-xs font-bold transition-all shadow-gold-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Hashing & Updating Password...' : 'Update Admin Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
