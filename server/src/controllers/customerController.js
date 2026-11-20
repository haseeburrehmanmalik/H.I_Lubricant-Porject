const Customer = require('../models/Customer');
const Order = require('../models/Order');

// @desc    Get all customers with aggregated stats
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;

    const query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { phone: regex }, { email: regex }, { city: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ totalSpent: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer by ID with their complete order history
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Find all orders placed by this customer (matching phone or email)
    const orders = await Order.find({
      $or: [
        { 'customer.phone': customer.phone },
        ...(customer.email ? [{ 'customer.email': customer.email }] : []),
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customer,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
