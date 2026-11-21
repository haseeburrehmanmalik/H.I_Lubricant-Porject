const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  converter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OilConverter',
    required: false,
  },
  isCustomOil: {
    type: Boolean,
    default: false,
  },
  converterNumber: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1,
  },
  unit: {
    type: String,
    default: 'L',
  },
  litres: {
    type: Number,
  },
  image: {
    type: String,
  },
  viscosity: {
    type: String,
  },
  volume: {
    type: String,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const trackingHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
      ],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    updatedBy: {
      type: String,
      default: 'System',
      trim: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      city: {
        type: String,
        default: 'Hyderabad',
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Complete address is required'],
        trim: true,
      },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Bank Transfer / WhatsApp', 'Store Pickup'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
      ],
      default: 'Pending',
      index: true,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    trackingHistory: [trackingHistorySchema],
    trackingNotes: {
      type: String,
      default: '',
      trim: true,
    },
    inventoryDeducted: {
      type: Boolean,
      default: true,
    },
    inventoryRestored: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ 'customer.name': 'text' });

module.exports = mongoose.model('Order', orderSchema);
