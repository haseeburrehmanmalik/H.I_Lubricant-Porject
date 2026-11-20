import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
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
    announcement: '100% Original Genuine Engine Oils & Lubricants in Hyderabad.',
    businessHours: 'Monday – Saturday: 9:00 AM – 9:00 PM',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Could not load settings from server, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
