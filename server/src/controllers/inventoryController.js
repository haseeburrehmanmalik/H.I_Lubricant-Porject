const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');

// @desc    Get Inventory overview, stock levels, and metrics
// @route   GET /api/admin/inventory
// @access  Private/Admin
exports.getInventory = async (req, res, next) => {
  try {
    const { status, brand, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (brand && brand !== 'all') {
      query.brand = new RegExp(`^${brand}$`, 'i');
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { brand: regex }, { viscosity: regex }];
    }

    if (status === 'low') {
      query.$expr = {
        $and: [
          { $gt: ['$stock', 0] },
          { $lte: ['$stock', '$lowStockThreshold'] },
        ],
      };
    } else if (status === 'out') {
      query.stock = 0;
    } else if (status === 'in_stock') {
      query.$expr = { $gt: ['$stock', '$lowStockThreshold'] };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ stock: 1 }) // Show lowest stock first
      .skip(skip)
      .limit(limitNum)
      .select('name slug brand category viscosity volume stock lowStockThreshold price isActive images');

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust Product Stock (Restock or manual adjustment)
// @route   PATCH /api/admin/inventory/:productId
// @access  Private/Admin
exports.adjustStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { type = 'restock', quantity, notes } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid non-zero quantity to adjust',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    if (type === 'restock') {
      newStock = previousStock + Math.abs(qty);
    } else if (type === 'adjustment') {
      // qty can be positive or negative
      newStock = Math.max(0, previousStock + qty);
    } else if (type === 'set_exact') {
      newStock = Math.max(0, qty);
    }

    product.stock = newStock;
    await product.save();

    // Log transaction
    const transaction = await InventoryTransaction.create({
      product: product._id,
      productName: product.name,
      transactionType: type === 'restock' ? 'restock' : 'adjustment',
      quantity: newStock - previousStock,
      previousStock,
      newStock,
      reference: `Admin: ${req.user.name || 'Admin'}`,
      notes: notes || `Manual stock update via inventory control`,
    });

    res.status(200).json({
      success: true,
      message: `Stock for ${product.name} updated from ${previousStock} to ${newStock}`,
      product,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory Transaction History
// @route   GET /api/admin/inventory/transactions
// @access  Private/Admin
exports.getTransactions = async (req, res, next) => {
  try {
    const { productId, type, page = 1, limit = 20 } = req.query;

    const query = {};
    if (productId) query.product = productId;
    if (type && type !== 'all') query.transactionType = type;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await InventoryTransaction.countDocuments(query);
    const transactions = await InventoryTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('product', 'name brand viscosity images');

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};
