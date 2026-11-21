const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const InventoryTransaction = require('../models/InventoryTransaction');

// @desc    Get real-time dashboard summary metrics from MongoDB
// @route   GET /api/admin/dashboard/summary
// @access  Private/Admin
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const allProductsCount = await Product.countDocuments();

    // Low stock count (stock <= lowStockThreshold or stock <= 5)
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      isActive: true,
    });

    const outOfStockProducts = await Product.countDocuments({
      stock: 0,
      isActive: true,
    });

    // Orders counts by status across the 9 stages
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const packedOrders = await Order.countDocuments({ orderStatus: 'Packed' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const outForDeliveryOrders = await Order.countDocuments({ orderStatus: 'Out for Delivery' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const returnedOrders = await Order.countDocuments({ orderStatus: 'Returned' });

    // Total Revenue from valid active/fulfilled orders (excluding Cancelled & Returned)
    const revenueAggregation = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
        },
      },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Total Customers
    const totalCustomers = await Customer.countDocuments();

    res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        allProductsCount,
        lowStockProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        processingOrders,
        packedOrders,
        shippedOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        totalRevenue,
        totalCustomers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Sales Chart data aggregated by day/month from MongoDB
// @route   GET /api/admin/dashboard/sales
// @access  Private/Admin
exports.getSalesChart = async (req, res, next) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 14,
      },
    ]);

    const formatted = salesData.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.orderCount,
    }));

    res.status(200).json({
      success: true,
      sales: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent orders & low stock alert products for dashboard
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private/Admin
exports.getRecentActivity = async (req, res, next) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('orderNumber customer total orderStatus createdAt paymentMethod');

    const lowStockAlerts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      isActive: true,
    })
      .sort({ stock: 1 })
      .limit(6)
      .select('name brand viscosity stock lowStockThreshold price images');

    const recentTransactions = await InventoryTransaction.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      recentOrders,
      lowStockAlerts,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};
