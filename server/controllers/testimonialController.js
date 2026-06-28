const Testimonial = require('../models/Testimonial');

const getTestimonials = async (req, res, next) => {
  try {
    const list = await Testimonial.find();
    res.status(200).json({ success: true, count: list.length, testimonials: list });
  } catch (err) {
    next(err);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const { name, role, company, content, rating, avatar } = req.body;
    if (!name || !role || !company || !content) {
      return res.status(400).json({ success: false, message: 'Name, role, company, and content are required' });
    }

    const item = await Testimonial.create({
      name,
      role,
      company,
      content,
      rating: Number(rating) || 5,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    res.status(201).json({ success: true, message: 'Testimonial added successfully', testimonial: item });
  } catch (err) {
    next(err);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, company, content, rating, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (company) updateData.company = company;
    if (content) updateData.content = content;
    if (rating) updateData.rating = Number(rating);
    if (avatar) updateData.avatar = avatar;

    const item = await Testimonial.findByIdAndUpdate(id, updateData);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, message: 'Testimonial updated successfully', testimonial: item });
  } catch (err) {
    next(err);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Testimonial.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
