const OilConverter = require('../models/OilConverter');

// @desc    Get all active/enabled oil converters (Customer Facing)
// @route   GET /api/oil-converters
// @access  Public
exports.getPublicConverters = async (req, res, next) => {
  try {
    // Ensure initial slots exist safely if database is empty
    await OilConverter.ensureTenSlots();

    const { search, brand } = req.query;
    const query = {
      isDeleted: { $ne: true },
      enabled: true,
    };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { brand: searchRegex }, { description: searchRegex }];
    }

    if (brand && brand !== 'all' && brand !== 'All') {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    const converters = await OilConverter.find(query)
      .populate('productId', 'name images price viscosity')
      .sort({ displayOrder: 1, converterNumber: 1 });

    res.status(200).json({
      success: true,
      count: converters.length,
      converters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single converter by ID or number
// @route   GET /api/oil-converters/:id
// @access  Public
exports.getConverterById = async (req, res, next) => {
  try {
    let converter;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      converter = await OilConverter.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).populate('productId');
    } else {
      const num = parseInt(req.params.id, 10);
      converter = await OilConverter.findOne({ converterNumber: num, isDeleted: { $ne: true } }).populate('productId');
    }

    if (!converter) {
      return res.status(404).json({
        success: false,
        message: 'Oil converter slot not found',
      });
    }

    res.status(200).json({
      success: true,
      converter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all converters for Admin Dashboard (with search, filter, sort)
// @route   GET /api/admin/oil-converters
// @access  Private/Admin
exports.getAdminConverters = async (req, res, next) => {
  try {
    // Ensure initial slots exist safely
    await OilConverter.ensureTenSlots();

    const { search, status, sort = 'number' } = req.query;
    const query = {
      isDeleted: { $ne: true },
    };

    if (status === 'active') {
      query.enabled = true;
    } else if (status === 'disabled') {
      query.enabled = false;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
      ];
    }

    let sortOption = { converterNumber: 1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'priceAsc') sortOption = { pricePerLitre: 1 };
    if (sort === 'priceDesc') sortOption = { pricePerLitre: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'number') sortOption = { converterNumber: 1 };

    const converters = await OilConverter.find(query)
      .populate('productId', 'name images price viscosity')
      .sort(sortOption);

    // Compute stats
    const totalCount = await OilConverter.countDocuments({ isDeleted: { $ne: true } });
    const activeCount = await OilConverter.countDocuments({ isDeleted: { $ne: true }, enabled: true });
    const disabledCount = totalCount - activeCount;

    res.status(200).json({
      success: true,
      count: converters.length,
      stats: {
        total: totalCount,
        active: activeCount,
        disabled: disabledCount,
      },
      converters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new oil converter (Unlimited)
// @route   POST /api/admin/oil-converters
// @access  Private/Admin
exports.createConverter = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      productId,
      pricePerLitre,
      unit = 'L',
      minimumQuantity = 0.5,
      maximumQuantity = 200,
      quantityIncrement = 0.1,
      availableLitres = 500,
      enabled = true,
      image,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Converter Name is required.',
      });
    }

    const parsedPrice = parseFloat(pricePerLitre);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid non-negative price per litre is required.',
      });
    }

    // Assign next available converter number automatically
    const nextNumber = await OilConverter.getNextConverterNumber();

    const newConverter = await OilConverter.create({
      converterNumber: nextNumber,
      name: name.trim(),
      description: description ? description.trim() : '',
      brand: brand ? brand.trim() : 'General Lubricants',
      productId: productId || null,
      pricePerLitre: parsedPrice,
      unit: unit === 'ml' ? 'ml' : 'L',
      minimumQuantity: Math.max(0.01, parseFloat(minimumQuantity) || 0.5),
      maximumQuantity: Math.max(1, parseFloat(maximumQuantity) || 200),
      quantityIncrement: Math.max(0.01, parseFloat(quantityIncrement) || 0.1),
      availableLitres: Math.max(0, parseFloat(availableLitres) || 0),
      enabled: Boolean(enabled),
      displayOrder: nextNumber,
      image: image || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    });

    res.status(201).json({
      success: true,
      message: `Converter #${newConverter.converterNumber} (${newConverter.name}) created successfully!`,
      converter: newConverter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific converter (Admin)
// @route   PUT /api/admin/oil-converters/:id
// @access  Private/Admin
exports.updateConverter = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      productId,
      pricePerLitre,
      unit,
      minimumQuantity,
      maximumQuantity,
      quantityIncrement,
      availableLitres,
      enabled,
      image,
      displayOrder,
    } = req.body;

    let converter = await OilConverter.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!converter) {
      const num = parseInt(req.params.id, 10);
      if (!isNaN(num)) {
        converter = await OilConverter.findOne({ converterNumber: num, isDeleted: { $ne: true } });
      }
    }

    if (!converter) {
      return res.status(404).json({
        success: false,
        message: 'Oil converter not found',
      });
    }

    if (name !== undefined) converter.name = name.trim();
    if (description !== undefined) converter.description = description.trim();
    if (brand !== undefined) converter.brand = brand.trim();
    if (productId !== undefined) converter.productId = productId || null;
    if (pricePerLitre !== undefined) {
      const parsedPrice = parseFloat(pricePerLitre);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid price per litre.',
        });
      }
      converter.pricePerLitre = parsedPrice;
    }
    if (unit !== undefined) converter.unit = unit;
    if (minimumQuantity !== undefined) converter.minimumQuantity = Math.max(0.01, parseFloat(minimumQuantity) || 0.5);
    if (maximumQuantity !== undefined) converter.maximumQuantity = Math.max(1, parseFloat(maximumQuantity) || 200);
    if (quantityIncrement !== undefined) converter.quantityIncrement = Math.max(0.01, parseFloat(quantityIncrement) || 0.1);
    if (availableLitres !== undefined) converter.availableLitres = Math.max(0, parseFloat(availableLitres) || 0);
    if (enabled !== undefined) converter.enabled = Boolean(enabled);
    if (image !== undefined) converter.image = image.trim();
    if (displayOrder !== undefined) converter.displayOrder = parseInt(displayOrder, 10) || converter.converterNumber;

    await converter.save();

    res.status(200).json({
      success: true,
      message: `Converter #${converter.converterNumber} (${converter.name}) updated successfully`,
      converter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or set enable/disable status for a converter (Admin)
// @route   PATCH /api/admin/oil-converters/:id/status
// @access  Private/Admin
exports.toggleConverterStatus = async (req, res, next) => {
  try {
    let converter = await OilConverter.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!converter) {
      const num = parseInt(req.params.id, 10);
      if (!isNaN(num)) {
        converter = await OilConverter.findOne({ converterNumber: num, isDeleted: { $ne: true } });
      }
    }

    if (!converter) {
      return res.status(404).json({
        success: false,
        message: 'Oil converter not found',
      });
    }

    if (req.body.enabled !== undefined) {
      converter.enabled = Boolean(req.body.enabled);
    } else {
      converter.enabled = !converter.enabled;
    }

    await converter.save();

    res.status(200).json({
      success: true,
      message: `Converter #${converter.converterNumber} is now ${converter.enabled ? 'ACTIVE' : 'DISABLED'}`,
      converter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Safe delete a converter (Soft Delete)
// @route   DELETE /api/admin/oil-converters/:id
// @access  Private/Admin
exports.deleteConverter = async (req, res, next) => {
  try {
    let converter = await OilConverter.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
    if (!converter) {
      const num = parseInt(req.params.id, 10);
      if (!isNaN(num)) {
        converter = await OilConverter.findOne({ converterNumber: num, isDeleted: { $ne: true } });
      }
    }

    if (!converter) {
      return res.status(404).json({
        success: false,
        message: 'Oil converter not found or already deleted.',
      });
    }

    // Safe deletion: mark isDeleted so historical orders remain valid
    converter.isDeleted = true;
    converter.enabled = false;
    await converter.save();

    res.status(200).json({
      success: true,
      message: `Converter #${converter.converterNumber} (${converter.name}) has been deleted successfully.`,
      deletedId: converter._id,
    });
  } catch (error) {
    next(error);
  }
};
