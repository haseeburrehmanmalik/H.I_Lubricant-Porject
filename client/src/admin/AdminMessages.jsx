import React, { useState, useEffect } from 'react';
import { Mail, Clock, Phone, User, MessageSquare, RefreshCw } from 'lucide-react';
import { adminService } from '../services/adminService';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminService.getContactMessages();
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292722]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F5F2EA] tracking-tight">
            Customer Inquiries & Messages
          </h1>
          <p className="text-xs text-[#A5A19A] mt-1">
            Questions, quotes, and product consultations received from the online contact form ({messages.length} messages).
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="p-2 rounded-xl bg-[#141414] border border-[#292722] hover:border-[#D7AD55] text-[#A5A19A] hover:text-[#D7AD55]"
          title="Refresh Messages"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#A5A19A]">Loading customer messages...</div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="p-5 rounded-2xl bg-[#141414] border border-[#292722] space-y-3 transition-colors hover:border-[#D7AD55]/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#292722]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#191919] border border-[#292722] flex items-center justify-center text-[#D7AD55]">
                    <User size={15} />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#F5F2EA]">{msg.name}</span>
                    <span className="text-xs text-[#A5A19A] ml-2">({msg.email})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-[11px] text-[#A5A19A]">
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-[#D7AD55] font-semibold hover:underline flex items-center space-x-1"
                    >
                      <Phone size={12} />
                      <span>{msg.phone}</span>
                    </a>
                  )}
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {msg.subject && (
                <div className="text-xs font-bold text-[#F5F2EA]">
                  Subject: <span className="text-[#D7AD55]">{msg.subject}</span>
                </div>
              )}

              <p className="text-xs text-[#A5A19A] leading-relaxed bg-[#191919] p-3 rounded-xl border border-[#292722]">
                "{msg.message}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#141414] border border-[#292722] text-xs text-[#A5A19A]">
          No messages received yet. All new inquiries from customers will appear here.
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
