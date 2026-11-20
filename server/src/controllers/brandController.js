const Brand = require('../models/Brand');

const slugify = (text) => {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      brands,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Brand (Admin)
// @route   POST /api/admin/brands
// @access  Private/Admin
exports.createBrand = async (req, res, next) => {
  try {
    const { name, logo, description, origin } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }

    const slug = slugify(name);
    const existing = await Brand.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Brand already exists' });
    }

    const brand = await Brand.create({
      name,
      slug,
      logo,
      description,
      origin: origin || 'Global',
    });

    res.status(201).json({ success: true, brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Brand (Admin)
// @route   PUT /api/admin/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res, next) => {
  try {
    let brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    if (req.body.name && req.body.name !== brand.name) {
      req.body.slug = slugify(req.body.name);
    }

    brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Brand (Admin)
// @route   DELETE /api/admin/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};
