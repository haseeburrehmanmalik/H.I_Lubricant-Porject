const Order = require('../models/Order');
const Product = require('../models/Product');
const OilConverter = require('../models/OilConverter');
const InventoryTransaction = require('../models/InventoryTransaction');
const Customer = require('../models/Customer');
const StoreSettings = require('../models/StoreSettings');

// Generate unique order number
const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  let unique = false;
  let orderNumber = '';

  while (!unique) {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    orderNumber = `HI-${year}-${randomCode}`;
    const existing = await Order.findOne({ orderNumber });
    if (!existing) unique = true;
  }
  return orderNumber;
};

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, notes, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full customer name, phone number, and delivery address',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty',
      });
    }

    // Fetch store settings for delivery fee
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = {
        standardDeliveryFee: 250,
        freeDeliveryThreshold: 8000,
        whatsappNumber: '+92 3113728228',
      };
    }

    // Verify each product on the server & recalculate totals securely
    let verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      if (item.isCustomOil) {
        // Find OilConverter slot
        let converter = null;
        if (item.converterId) {
          converter = await OilConverter.findById(item.converterId);
        }
        if (!converter && item.converterNumber) {
          converter = await OilConverter.findOne({ converterNumber: item.converterNumber });
        }

        if (!converter) {
          return res.status(404).json({
            success: false,
            message: `Oil Converter #${item.converterNumber || ''} (${item.name || 'Custom Oil'}) was not found.`,
          });
        }

        if (!converter.enabled) {
          return res.status(400).json({
            success: false,
            message: `Oil Converter "${converter.name}" is currently disabled.`,
          });
        }

        const litres = parseFloat(item.litres || item.quantity);
        if (isNaN(litres) || litres <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid quantity in litres for "${converter.name}".`,
          });
        }

        if (converter.availableLitres < litres) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${converter.name}". Only ${converter.availableLitres} Litres available.`,
          });
        }

        // Authoritative server calculation
        const itemSubtotal = Math.round(litres * converter.pricePerLitre);
        calculatedSubtotal += itemSubtotal;

        verifiedItems.push({
          isCustomOil: true,
          converter: converter._id,
          converterNumber: converter.converterNumber,
          name: converter.name,
          price: converter.pricePerLitre,
          quantity: litres,
          litres: litres,
          unit: item.unit || 'L',
          image: item.image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
          viscosity: converter.brand,
          volume: item.unit === 'ml' ? `${item.originalQuantity || Math.round(litres * 1000)} ml (${litres} L)` : `${litres} Litres`,
          subtotal: itemSubtotal,
        });
      } else {
        const product = await Product.findById(item.product || item._id);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.product || item._id} was not found`,
          });
        }

        if (!product.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product "${product.name}" is currently unavailable`,
          });
        }

        const qty = parseInt(item.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid quantity for product "${product.name}"`,
          });
        }

        if (product.stock < qty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
          });
        }

        const itemSubtotal = product.price * qty;
        calculatedSubtotal += itemSubtotal;

        verifiedItems.push({
          isCustomOil: false,
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          viscosity: product.viscosity,
          volume: product.volume,
          subtotal: itemSubtotal,
        });
      }
    }

    // Calculate delivery charges
    const deliveryCharges =
      calculatedSubtotal >= settings.freeDeliveryThreshold
        ? 0
        : settings.standardDeliveryFee;

    const discount = 0;
    const finalTotal = calculatedSubtotal + deliveryCharges - discount;

    const orderNumber = await generateOrderNumber();

    // Initial tracking event
    const initialTracking = [
      {
        status: 'Pending',
        notes: 'Order placed by customer via online portal. Awaiting store confirmation.',
        updatedBy: 'Customer (Online)',
        updatedAt: new Date(),
      },
    ];

    // Estimated delivery: default 2 business days
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 2);

    // Create the Order in MongoDB
    const order = await Order.create({
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        city: customer.city ? customer.city.trim() : 'Hyderabad',
        address: customer.address.trim(),
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      discount,
      deliveryCharges,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending',
      estimatedDeliveryDate: estimatedDate,
      trackingHistory: initialTracking,
      trackingNotes: 'Your order is being reviewed by H.I Lubricant dispatch team in Hyderabad.',
      inventoryDeducted: true,
      inventoryRestored: false,
      notes: notes || '',
    });

    // Deduct stock safely and record inventory transactions
    for (const item of verifiedItems) {
      if (item.isCustomOil && item.converter) {
        const converter = await OilConverter.findById(item.converter);
        if (converter) {
          converter.availableLitres = Math.max(0, converter.availableLitres - item.litres);
          await converter.save();
        }
      } else if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          const previousStock = product.stock;
          const newStock = Math.max(0, previousStock - item.quantity);
          product.stock = newStock;
          await product.save();

          await InventoryTransaction.create({
            product: product._id,
            productName: product.name,
            transactionType: 'sale',
            quantity: -item.quantity,
            previousStock,
            newStock,
            reference: order.orderNumber,
            notes: `Sold via Order #${order.orderNumber} to ${order.customer.name}`,
          });
        }
      }
    }

    // Update or create Customer record
    try {
      let existingCustomer = await Customer.findOne({ phone: order.customer.phone });
      if (existingCustomer) {
        existingCustomer.name = order.customer.name;
        existingCustomer.email = order.customer.email || existingCustomer.email;
        existingCustomer.address = order.customer.address;
        existingCustomer.city = order.customer.city;
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpent += finalTotal;
        existingCustomer.lastOrderDate = new Date();
        await existingCustomer.save();
      } else {
        await Customer.create({
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email,
          address: order.customer.address,
          city: order.customer.city,
          totalOrders: 1,
          totalSpent: finalTotal,
          lastOrderDate: new Date(),
        });
      }
    } catch (custErr) {
      console.warn('Customer upsert non-critical warning:', custErr.message);
    }

    // Construct formatted WhatsApp message
    const formattedPhone = (settings.whatsappNumber || '+923113728228').replace(/[^0-9]/g, '');
    let itemLines = verifiedItems
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.name}* (${it.viscosity}) x ${it.quantity} = Rs. ${it.subtotal.toLocaleString()}`
      )
      .join('\n');

    const whatsappMessage =
      `*Assalam-o-Alaikum H.I Lubricant!*\n\n` +
      `I have placed an order on your website.\n\n` +
      `*Order #:* ${order.orderNumber}\n` +
      `*Customer:* ${order.customer.name}\n` +
      `*Phone:* ${order.customer.phone}\n` +
      `*Address:* ${order.customer.address}, ${order.customer.city}\n\n` +
      `*Items Ordered:*\n${itemLines}\n\n` +
      `*Subtotal:* Rs. ${order.subtotal.toLocaleString()}\n` +
      `*Delivery:* ${order.deliveryCharges === 0 ? 'FREE' : 'Rs. ' + order.deliveryCharges.toLocaleString()}\n` +
      `*Total Amount:* Rs. ${order.total.toLocaleString()}\n` +
      `*Payment:* ${order.paymentMethod}\n` +
      (order.notes ? `*Notes:* ${order.notes}\n\n` : `\n`) +
      `Track online at: ${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order\n\n` +
      `Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and recorded in database',
      order,
      whatsappUrl,
      whatsappMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer Order Tracking with Server Verification
// @route   POST /api/orders/track
// @access  Public
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, verification } = req.body;

    if (!orderNumber || !orderNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Order ID (e.g. HI-2026-XXXXXX)',
      });
    }

    if (!verification || !verification.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the phone number or email associated with this order for security verification.',
      });
    }

    const cleanOrderNumber = orderNumber.trim();
    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${cleanOrderNumber}$`, 'i') },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found matching Order ID. Please check the ID and try again.',
      });
    }

    // Security Verification: Compare Phone or Email
    const cleanInput = verification.trim().toLowerCase();
    const inputDigits = cleanInput.replace(/\D/g, '');

    const storedPhone = (order.customer.phone || '').trim();
    const storedPhoneDigits = storedPhone.replace(/\D/g, '');
    const storedEmail = (order.customer.email || '').trim().toLowerCase();

    let isVerified = false;

    // Email exact match
    if (storedEmail && cleanInput === storedEmail) {
      isVerified = true;
    }

    // Phone match (comparing normalized digits)
    if (!isVerified && inputDigits.length >= 7 && storedPhoneDigits.length >= 7) {
      // Check if last 9 or 10 digits match (handling country code +92 vs 03xx)
      const inputTail = inputDigits.slice(-9);
      const storedTail = storedPhoneDigits.slice(-9);
      if (inputDigits === storedPhoneDigits || inputTail === storedTail) {
        isVerified = true;
      }
    }

    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Verification failed. The phone number or email does not match this Order ID.',
      });
    }

    // Return sanitized tracking payload
    res.status(200).json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        customer: {
          name: order.customer.name,
          city: order.customer.city,
          address: order.customer.address,
        },
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharges: order.deliveryCharges,
        discount: order.discount,
        total: order.total,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        trackingNotes: order.trackingNotes,
        trackingHistory: order.trackingHistory || [],
        notes: order.notes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by Order Number (Public verification / Success page lookup)
// @route   GET /api/orders/lookup/:orderNumber
// @access  Public
exports.getOrderByOrderNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found with this order number',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const {
      search,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      page = 1,
      limit = 15,
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
        { 'customer.city': searchRegex },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages,
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (Admin)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, adminNotes, trackingNotes, estimatedDeliveryDate } =
      req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const previousStatus = order.orderStatus;
    const adminUser = req.user?.name || 'Administrator';

    if (status && status !== previousStatus) {
      order.orderStatus = status;

      // Append to tracking history
      const historyEntry = {
        status: status,
        notes:
          trackingNotes ||
          adminNotes ||
          `Order status updated from ${previousStatus} to ${status}`,
        updatedBy: adminUser,
        updatedAt: new Date(),
      };

      if (!order.trackingHistory) {
        order.trackingHistory = [];
      }
      order.trackingHistory.push(historyEntry);

      // Inventory restoration when Cancelled or Returned
      if (
        (status === 'Cancelled' || status === 'Returned') &&
        order.inventoryDeducted &&
        !order.inventoryRestored
      ) {
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            const previousStock = product.stock;
            const newStock = previousStock + item.quantity;
            product.stock = newStock;
            await product.save();

            await InventoryTransaction.create({
              product: product._id,
              productName: product.name,
              transactionType: 'cancellation_return',
              quantity: item.quantity,
              previousStock,
              newStock,
              reference: order.orderNumber,
              notes: `Stock restored upon ${status.toLowerCase()} of Order #${order.orderNumber}`,
            });
          }
        }
        order.inventoryRestored = true;
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    if (trackingNotes !== undefined) {
      order.trackingNotes = trackingNotes;
    }

    if (estimatedDeliveryDate !== undefined) {
      order.estimatedDeliveryDate = estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} updated successfully`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status (Admin)
// @route   PATCH /api/admin/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus || !['Unpaid', 'Paid'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status. Must be Unpaid or Paid.',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Payment status for Order #${order.orderNumber} updated to ${paymentStatus}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order tracking details (Admin)
// @route   PATCH /api/admin/orders/:id/tracking
// @access  Private/Admin
exports.updateTrackingDetails = async (req, res, next) => {
  try {
    const { estimatedDeliveryDate, trackingNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (estimatedDeliveryDate !== undefined) {
      order.estimatedDeliveryDate = estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null;
    }

    if (trackingNotes !== undefined) {
      order.trackingNotes = trackingNotes;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Tracking details for Order #${order.orderNumber} updated`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
