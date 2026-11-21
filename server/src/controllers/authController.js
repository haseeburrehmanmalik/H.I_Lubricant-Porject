const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, tokenVersion = 0) => {
  return jwt.sign(
    { id, tokenVersion },
    process.env.JWT_SECRET || 'hilubricant_super_secure_jwt_secret_key_2026_prod',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently disabled. Please contact the administrator.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.tokenVersion || 0);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Logout
// @route   POST /api/admin/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Admin Profile / Password
// @route   PUT /api/admin/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;

    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match',
        });
      }
      if (req.body.newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Account & Security Information
// @route   GET /api/admin/settings/account
// @access  Private/Admin
exports.getAccountInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found',
      });
    }

    res.status(200).json({
      success: true,
      account: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || user.updatedAt,
        lastPasswordChange: user.lastPasswordChange || user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Admin Email
// @route   PUT /api/admin/settings/email
// @access  Private/Admin
exports.changeEmail = async (req, res, next) => {
  try {
    const { newEmail, confirmEmail, currentPassword } = req.body;

    if (!newEmail || !confirmEmail || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new email, confirm email, and current password.',
      });
    }

    const cleanNewEmail = newEmail.trim().toLowerCase();
    const cleanConfirmEmail = confirmEmail.trim().toLowerCase();

    if (cleanNewEmail !== cleanConfirmEmail) {
      return res.status(400).json({
        success: false,
        message: 'New email address and confirmation do not match.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(cleanNewEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email format (e.g. admin@hilubricant.com).',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found',
      });
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password verification failed. Please check your password.',
      });
    }

    if (user.email === cleanNewEmail) {
      return res.status(400).json({
        success: false,
        message: 'The new email is already your current registered email.',
      });
    }

    // Check if new email is already in use by another user
    const emailExists = await User.findOne({ email: cleanNewEmail, _id: { $ne: user._id } });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'This email address is already in use by another account.',
      });
    }

    // Update email and invalidate previous sessions
    user.email = cleanNewEmail;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email address updated successfully. Please log in with your new email address.',
      requiresRelogin: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Admin Password
// @route   PUT /api/admin/settings/password
// @access  Private/Admin
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your current password, new password, and confirmation.',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.',
      });
    }

    // Password requirements:
    // - Minimum 12 characters
    // - Require uppercase and lowercase letters
    // - Require at least one number
    // - Require at least one special character
    if (newPassword.length < 12) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 12 characters in length.',
      });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter (A-Z).',
      });
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one lowercase letter (a-z).',
      });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one numeric digit (0-9).',
      });
    }

    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    if (!specialCharRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one special character (!@#$%^&* etc.).',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found',
      });
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password verification failed. Please check your password.',
      });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre('save') hook
    user.lastPasswordChange = new Date();
    user.tokenVersion = (user.tokenVersion || 0) + 1; // Invalidate all existing sessions
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. All existing sessions have been terminated. Please log in with your new password.',
      requiresRelogin: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout All Sessions
// @route   POST /api/admin/settings/logout-all
// @access  Private/Admin
exports.logoutAllSessions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found',
      });
    }

    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'All active administrator sessions have been invalidated.',
      requiresRelogin: true,
    });
  } catch (error) {
    next(error);
  }
};
