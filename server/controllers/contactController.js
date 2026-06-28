const Message = require('../models/Message');
const Newsletter = require('../models/Newsletter');

const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All contact fields are required' });
    }

    const contactMsg = await Message.create({
      name,
      email,
      subject,
      message,
      isRead: false
    });

    res.status(201).json({ success: true, message: 'Your message has been sent successfully. We will get back to you soon!', contactMsg });
  } catch (err) {
    next(err);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
};

const toggleMessageReadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const msg = await Message.findByIdAndUpdate(id, { isRead });
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, message: 'Message read status updated' });
  } catch (err) {
    next(err);
  }
};

const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    const sub = await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Thank you for subscribing to our newsletter!', sub });
  } catch (err) {
    next(err);
  }
};

const getNewsletterSubscribers = async (req, res, next) => {
  try {
    const subs = await Newsletter.find();
    res.status(200).json({ success: true, count: subs.length, subscribers: subs });
  } catch (err) {
    next(err);
  }
};

const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const msg = await Message.findByIdAndDelete(id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
  toggleMessageReadStatus,
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteContactMessage
};
