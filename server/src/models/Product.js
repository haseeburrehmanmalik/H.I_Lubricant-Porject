const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price in PKR is required'],
      min: [0, 'Price must be non-negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be non-negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Product must have at least one image',
      },
    },
    viscosity: {
      type: String,
      required: [true, 'Viscosity grade is required'],
      trim: true,
      index: true,
    },
    volume: {
      type: String,
      default: '4 Litres',
      trim: true,
    },
    specifications: {
      apiRating: { type: String, default: 'API SN/CF' },
      baseOil: { type: String, default: 'Fully Synthetic' },
      vehicleType: { type: String, default: 'Passenger Car' },
      density: { type: String, default: '' },
    },
    keyBenefits: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text', viscosity: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
