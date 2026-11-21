const mongoose = require('mongoose');

const oilConverterSchema = new mongoose.Schema(
  {
    converterNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    brand: {
      type: String,
      default: 'General Lubricants',
      trim: true,
    },
    pricePerLitre: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    unit: {
      type: String,
      enum: ['L', 'ml'],
      default: 'L',
    },
    minimumQuantity: {
      type: Number,
      default: 0.5,
      min: 0.05,
    },
    maximumQuantity: {
      type: Number,
      default: 200,
      min: 1,
    },
    quantityIncrement: {
      type: Number,
      default: 0.1,
      min: 0.01,
    },
    availableLitres: {
      type: Number,
      default: 500,
      min: 0,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
oilConverterSchema.index({ converterNumber: 1 });
oilConverterSchema.index({ isDeleted: 1, enabled: 1, displayOrder: 1 });

// Helper to get next available converter number
oilConverterSchema.statics.getNextConverterNumber = async function () {
  const highest = await this.findOne().sort({ converterNumber: -1 }).select('converterNumber');
  return highest && highest.converterNumber ? highest.converterNumber + 1 : 1;
};

// Static method to ensure initial slots exist safely without overriding existing customized settings
oilConverterSchema.statics.ensureTenSlots = async function () {
  const count = await this.countDocuments();
  if (count > 0) {
    return; // Already initialized, preserve all existing records
  }

  const defaultSlots = [
    {
      converterNumber: 1,
      name: 'Caltex Open Oil',
      description: 'Authentic Caltex high-grade bulk motor oil measured by exact customer requirement.',
      brand: 'Caltex',
      pricePerLitre: 1850,
      availableLitres: 450,
      enabled: true,
      displayOrder: 1,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 2,
      name: 'PSO Open Oil',
      description: 'Pakistan State Oil genuine bulk motor oil for cars and commercial fleets.',
      brand: 'PSO',
      pricePerLitre: 1650,
      availableLitres: 600,
      enabled: true,
      displayOrder: 2,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 3,
      name: 'Shell Open Oil',
      description: 'Shell synthetic formula loose oil with active cleansing technology.',
      brand: 'Shell',
      pricePerLitre: 1950,
      availableLitres: 380,
      enabled: true,
      displayOrder: 3,
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 4,
      name: 'Honda Genuine Oil',
      description: 'Factory recommended Honda formulation for VTEC and i-VTEC engines.',
      brand: 'Honda',
      pricePerLitre: 2100,
      availableLitres: 300,
      enabled: true,
      displayOrder: 4,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 5,
      name: 'Blaze Synthetic Oil',
      description: 'Blaze premium heavy-duty lubricant for high temperature endurance.',
      brand: 'Blaze',
      pricePerLitre: 1750,
      availableLitres: 400,
      enabled: true,
      displayOrder: 5,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 6,
      name: 'Motorcycle 4T Oil',
      description: 'JASO MA2 compliant loose motorcycle oil for 70cc to 150cc bikes.',
      brand: 'Shell',
      pricePerLitre: 1900,
      availableLitres: 250,
      enabled: true,
      displayOrder: 6,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 7,
      name: 'Heavy Duty Diesel Engine Oil',
      description: 'High TBN commercial diesel engine oil for trucks, tractors, and generators.',
      brand: 'Caltex',
      pricePerLitre: 1600,
      availableLitres: 500,
      enabled: true,
      displayOrder: 7,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 8,
      name: 'Manual Gear & Differential Oil',
      description: 'Extreme pressure GL-4 / GL-5 transmission fluid for smooth gear shifts.',
      brand: 'PSO',
      pricePerLitre: 1450,
      availableLitres: 350,
      enabled: true,
      displayOrder: 8,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 9,
      name: 'Industrial Drum Oil',
      description: 'Wholesale drum quantity converter for industrial machinery and workshops.',
      brand: 'Blaze',
      pricePerLitre: 1300,
      availableLitres: 1200,
      enabled: true,
      displayOrder: 9,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    },
    {
      converterNumber: 10,
      name: 'Custom Fleet Oil Converter',
      description: 'Custom formulation converter tailored for Hyderabad fleet operators.',
      brand: 'H.I Custom',
      pricePerLitre: 1700,
      availableLitres: 800,
      enabled: true,
      displayOrder: 10,
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=600&q=80',
    },
  ];

  await this.insertMany(defaultSlots);
  console.log('[OilConverter] Initialized 10 default slots safely.');
};

const OilConverter = mongoose.model('OilConverter', oilConverterSchema);

module.exports = OilConverter;
