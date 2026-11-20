const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');

// Helper to make slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Get all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      category,
      viscosity,
      minPrice,
      maxPrice,
      featured,
      inStock,
      sort,
      page = 1,
      limit = 12,
      all = false, // option for admin to fetch all without pagination
    } = req.query;

    const query = { isActive: true };

    // If admin is fetching, they can pass includeInactive=true
    if (req.query.includeInactive === 'true') {
      delete query.isActive;
    }

    // Search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { viscosity: searchRegex },
        { description: searchRegex },
      ];
    }

    // Filter by Brand
    if (brand && brand !== 'all') {
      const brandsList = Array.isArray(brand) ? brand : brand.split(',');
      query.brand = { $in: brandsList.map((b) => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    // Filter by Category
    if (category && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Filter by Viscosity
    if (viscosity && viscosity !== 'all') {
      query.viscosity = new RegExp(`^${viscosity.trim()}$`, 'i');
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by Stock
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'name_desc') sortOption = { name: -1 };
    else if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

    if (all === 'true') {
      const products = await Product.find(query).sort(sortOption);
      return res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:identifier
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    // Check if valid ObjectId or Slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch related products (same category or brand)
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [{ category: product.category }, { brand: product.brand }],
    })
      .limit(4)
      .select('name slug price images brand viscosity volume stock');

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      originalPrice,
      stock,
      lowStockThreshold,
      images,
      viscosity,
      volume,
      specifications,
      keyBenefits,
      featured,
      isActive,
    } = req.body;

    if (!name || !brand || !category || !description || price === undefined || !viscosity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, brand, category, description, price, viscosity',
      });
    }

    // Generate unique slug
    let baseSlug = slugify(`${brand}-${name}-${viscosity}`);
    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const productImages = Array.isArray(images) && images.length > 0 
      ? images 
      : ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'];

    const newProduct = await Product.create({
      name,
      slug,
      brand,
      category,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: stock ? Number(stock) : 0,
      lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : 5,
      images: productImages,
      viscosity,
      volume: volume || '4 Litres',
      specifications: specifications || {},
      keyBenefits: Array.isArray(keyBenefits) ? keyBenefits : [],
      featured: Boolean(featured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    // Record initial inventory transaction
    if (newProduct.stock > 0) {
      await InventoryTransaction.create({
        product: newProduct._id,
        productName: newProduct.name,
        transactionType: 'initial_seed',
        quantity: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reference: 'Product Initial Creation',
        notes: `Initial stock for ${newProduct.name}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const previousStock = product.stock;

    // Check if stock changed directly in update form
    if (req.body.stock !== undefined && Number(req.body.stock) !== previousStock) {
      const newStock = Number(req.body.stock);
      const diff = newStock - previousStock;
      await InventoryTransaction.create({
        product: product._id,
        productName: product.name,
        transactionType: 'adjustment',
        quantity: diff,
        previousStock,
        newStock,
        reference: `Admin Edit: ${req.user.name || 'Admin'}`,
        notes: `Stock updated directly in product edit modal (${previousStock} -> ${newStock})`,
      });
    }

    // Update slug if name or viscosity changed
    if (req.body.name && req.body.name !== product.name) {
      const baseSlug = slugify(`${req.body.brand || product.brand}-${req.body.name}-${req.body.viscosity || product.viscosity}`);
      let newSlug = baseSlug;
      let count = 1;
      while (await Product.findOne({ slug: newSlug, _id: { $ne: product._id } })) {
        newSlug = `${baseSlug}-${count++}`;
      }
      req.body.slug = newSlug;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image (Admin)
// @route   POST /api/admin/products/upload
// @access  Private/Admin
exports.uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};
