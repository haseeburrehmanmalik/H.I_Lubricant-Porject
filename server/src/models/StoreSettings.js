const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'H.I Lubricant',
    },
    tagline: {
      type: String,
      default: 'POWER YOUR JOURNEY.',
    },
    heroHeadline: {
      type: String,
      default: 'Every Journey Deserves Better Oil.',
    },
    phone: {
      type: String,
      default: '+92 3113728228',
    },
    whatsappNumber: {
      type: String,
      default: '+92 3113728228',
    },
    email: {
      type: String,
      default: 'malikimranali42@yahoo.com',
    },
    address: {
      type: String,
      default: 'Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.',
    },
    city: {
      type: String,
      default: 'Hyderabad, Sindh',
    },
    country: {
      type: String,
      default: 'Pakistan',
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    currencySymbol: {
      type: String,
      default: 'Rs.',
    },
    standardDeliveryFee: {
      type: Number,
      default: 250,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 8000,
    },
    businessHours: {
      type: String,
      default: 'Monday – Saturday: 9:00 AM – 9:00 PM (Friday break: 1:00 PM – 2:30 PM)',
    },
    announcement: {
      type: String,
      default: 'Authorized Dealer of 100% Genuine Automotive Lubricants in Hyderabad.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
