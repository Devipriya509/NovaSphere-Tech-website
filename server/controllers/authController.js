const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail, sendPasswordResetCode } = require('../config/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'novasphere_secret_key', {
    expiresIn: '30d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      notifications: [{
        id: 'welcome',
        title: 'Welcome to NovaSphere!',
        message: 'Thank you for creating an account with NovaSphere Technologies. Check out our services and book an appointment today.',
        read: false,
        createdAt: new Date().toISOString()
      }]
    });

    sendWelcomeEmail(user);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        savedProjects: [],
        savedServices: []
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        savedProjects: user.savedProjects || [],
        savedServices: user.savedServices || []
      }
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // Generate a mock reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    
    // In a real app we would send this via email. We will store a temp variable on User or log it.
    // For local database simplicity, we will save this reset token on the user document.
    await User.findByIdAndUpdate(user._id, { resetToken });

    console.log(`[PASS RESET] Reset PIN for ${email} is: ${resetToken}`);
    sendPasswordResetCode(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Reset instructions sent to your email (simulated). Check your server logs or write in your reset code.',
      resetToken
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.resetToken !== resetCode) {
      return res.status(400).json({ success: false, message: 'Invalid reset code or email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: null // Clear reset token
    });

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        savedProjects: user.savedProjects || [],
        savedServices: user.savedServices || [],
        notifications: user.notifications || []
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please enter current and new passwords' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

const toggleSaveProject = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const user = await User.findById(req.user._id);
    let savedProjects = user.savedProjects || [];

    if (savedProjects.includes(projectId)) {
      savedProjects = savedProjects.filter(id => id !== projectId);
    } else {
      savedProjects.push(projectId);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { savedProjects });
    res.status(200).json({ success: true, savedProjects: updatedUser.savedProjects });
  } catch (err) {
    next(err);
  }
};

const clearNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const notifications = (user.notifications || []).map(notif => {
      if (notif.id === id) notif.read = true;
      return notif;
    });

    await User.findByIdAndUpdate(req.user._id, { notifications });
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const toggleBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot block your own admin account.' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isBlocked = !user.isBlocked;
    await User.findByIdAndUpdate(id, { isBlocked });
    res.status(200).json({ success: true, message: `User account has been ${isBlocked ? 'suspended' : 're-activated'}.` });
  } catch (err) {
    next(err);
  }
};

const updateUserByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(id, updateData);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User details updated successfully' });
  } catch (err) {
    next(err);
  }
};

const toggleSaveService = async (req, res, next) => {
  try {
    const { serviceId } = req.body;
    const user = await User.findById(req.user._id);
    let savedServices = user.savedServices || [];

    if (savedServices.includes(serviceId)) {
      savedServices = savedServices.filter(id => id !== serviceId);
    } else {
      savedServices.push(serviceId);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { savedServices }, { new: true });
    res.status(200).json({ success: true, savedServices: updatedUser.savedServices });
  } catch (err) {
    next(err);
  }
};

const deleteMyAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ success: true, message: 'Your account has been deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  toggleSaveProject,
  clearNotification,
  deleteUser,
  toggleBlockUser,
  updateUserByAdmin,
  toggleSaveService,
  deleteMyAccount
};
