import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useSettings } from '../context/SettingsContext';

const AdminSettings = () => {
  const { refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    businessName: 'H.I Lubricant',
    tagline: 'POWER YOUR JOURNEY.',
    heroHeadline: 'Every Journey Deserves Better Oil.',
    phone: '+92 3113728228',
    whatsappNumber: '+92 3113728228',
    email: 'malikimranali42@yahoo.com',
    address: 'Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.',
    city: 'Hyderabad, Sindh',
    country: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    standardDeliveryFee: 250,
    freeDeliveryThreshold: 8000,
    businessHours: 'Monday – Saturday: 9:00 AM – 9:00 PM (Friday break: 1:00 PM – 2:30 PM)',
    announcement: '100% Original Genuine Engine Oils & Lubricants in Hyderabad.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminService.getSettings();
        if (res.success && res.settings) {
          setFormData(res.settings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(null);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        standardDeliveryFee: Number(formData.standardDeliveryFee),
        freeDeliveryThreshold: Number(formData.freeDeliveryThreshold),
      };

      const res = await adminService.updateSettings(payload);
      if (res.success) {
        setSuccess('Store configuration updated and persisted successfully in MongoDB!');
        refreshSettings();
      } else {
        setError(res.message || 'Failed to update store settings.');
      }
    } catch (err) {
      console.error('Settings update error:', err);
      setError(err.response?.data?.message || 'Server error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-[#A5A19A]">
        Loading settings from database...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[#292722] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Store & Business Configuration
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Manage H.I Lubricant business contact details, delivery fee thresholds, and WhatsApp integration.
          </p>
        </div>

        <Link
          to="/admin/settings/security"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#191919] border border-[#D7AD55]/40 hover:border-[#D7AD55] text-xs font-bold text-[#D7AD55] transition-all shadow-sm shrink-0"
        >
          <ShieldCheck size={16} />
          <span>Account & Security</span>
        </Link>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center space-x-3 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center space-x-3 text-red-300 text-xs font-semibold">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Business Branding */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <h2 className="text-sm font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
            <Sparkles size={16} className="text-[#D7AD55]" />
            <span>Store Identity & Taglines</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">Store Legal / Display Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">Official Brand Slogan</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#A5A19A]">Homepage Hero Headline</label>
              <input
                type="text"
                name="heroHeadline"
                value={formData.heroHeadline}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#A5A19A]">Top Announcement Bar Message</label>
              <input
                type="text"
                name="announcement"
                value={formData.announcement}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Location */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <h2 className="text-sm font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
            <Phone size={16} className="text-[#D7AD55]" />
            <span>Contact Information & WhatsApp</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">Official Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">WhatsApp Ordering Number</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#A5A19A]">Store Support Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#A5A19A]">Complete Physical Location</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              ></textarea>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[#A5A19A]">Business Operating Hours</label>
              <input
                type="text"
                name="businessHours"
                value={formData.businessHours}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#292722] space-y-4">
          <h2 className="text-sm font-bold text-[#F5F2EA] flex items-center space-x-2 pb-3 border-b border-[#292722]">
            <Truck size={16} className="text-[#D7AD55]" />
            <span>Delivery Charges & Currency Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                name="standardDeliveryFee"
                value={formData.standardDeliveryFee}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">Free Delivery Minimum (PKR)</label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                value={formData.freeDeliveryThreshold}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#A5A19A]">Currency Code</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl bg-[#191919] border border-[#292722] text-[#F5F2EA] focus:border-[#D7AD55] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl btn-gold text-xs font-bold flex items-center space-x-2 shadow-gold-sm disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving to Database...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
