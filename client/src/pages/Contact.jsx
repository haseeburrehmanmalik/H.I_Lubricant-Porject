import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email address, and message.');
      return;
    }

    setLoading(true);
    try {
      const response = await adminService.submitContactMessage(formData);
      if (response.success) {
        setSuccess(response.message || 'Your inquiry has been received! We will contact you shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setError(response.message || 'Failed to send message. Please try again or message on WhatsApp.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError(
        err.response?.data?.message ||
        'Could not submit inquiry right now. Please reach us directly on WhatsApp.'
      );
    } finally {
      setLoading(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/${(settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum H.I Lubricant! I have an inquiry regarding lubricants and pricing.')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D7AD55]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F2EA]">
          Contact & Visit H.I Lubricant
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A19A] leading-relaxed">
          Need an oil recommendation, bulk quote for your workshop, or directions to our Hyderabad shop? We are here to assist.
        </p>
      </div>

      {/* Grid: Contact Information & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Contact Info & WhatsApp & Map */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#141414] border border-[#292722] space-y-6">
            <h2 className="text-lg font-bold text-[#F5F2EA] pb-3 border-b border-[#292722]">
              Store Information
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#D7AD55] shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <strong className="text-[#F5F2EA] text-sm block mb-0.5">Store Address</strong>
                  <span className="text-[#A5A19A] leading-relaxed">
                    {settings.address || 'Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#D7AD55] shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <strong className="text-[#F5F2EA] text-sm block mb-0.5">Phone / WhatsApp</strong>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-[#D7AD55] hover:underline font-semibold text-xs"
                  >
                    {settings.phone || '+92 311 3728228'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#D7AD55] shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <strong className="text-[#F5F2EA] text-sm block mb-0.5">Email Support</strong>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-[#D7AD55] hover:underline text-xs"
                  >
                    {settings.email || 'malikimranali42@yahoo.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#D7AD55] shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <strong className="text-[#F5F2EA] text-sm block mb-0.5">Business Hours</strong>
                  <span className="text-[#A5A19A]">
                    {settings.businessHours || 'Monday – Saturday: 9:00 AM – 9:00 PM (Friday break: 1:00 PM – 2:30 PM)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Phone size={16} />
                <span>Chat Directly on WhatsApp: +92 311 3728228</span>
              </a>
            </div>
          </div>

          {/* Google Maps / Directions Embed Box */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-[#292722] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#F5F2EA]">Google Maps Directions</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Gari+Khata+Amma+Ayesha+Hospital+Hyderabad+Sindh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#D7AD55] hover:underline flex items-center space-x-1"
              >
                <span>Open in Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div className="w-full h-52 rounded-2xl bg-[#090909] border border-[#292722] overflow-hidden relative">
              <iframe
                title="H.I Lubricant Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                src="https://maps.google.com/maps?q=Amma%20Ayesha%20Hospital,%20Hyderabad,%20Sindh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right: Working Interactive Contact Form */}
        <div className="p-8 rounded-3xl bg-[#141414] border border-[#292722] space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F5F2EA]">Send Us a Message</h2>
            <p className="text-xs text-[#A5A19A]">
              Fill out this form and our team in Hyderabad will get back to you promptly.
            </p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A5A19A] block">
                Your Full Name <span className="text-[#D7AD55]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tariq Mehmood"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A5A19A] block">
                  Email Address <span className="text-[#D7AD55]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#A5A19A] block">Phone / WhatsApp</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0300-1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A5A19A] block">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Product Inquiry / Bulk Order / Viscosity Consultation"
                className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#A5A19A] block">
                Message <span className="text-[#D7AD55]">*</span>
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your inquiry, vehicle model, required oil grade, or quantity..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#191919] border border-[#292722] text-xs text-[#F5F2EA] placeholder-[#A5A19A] focus:outline-none focus:border-[#D7AD55]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center space-x-2 shadow-gold-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Message...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Message to H.I Lubricant</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
