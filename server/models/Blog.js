const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const CommentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, default: 'NovaSphere Editorial' },
  category: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: String, default: '5 mins' },
  views: { type: Number, default: 0 },
  comments: [CommentSchema]
}, { timestamps: true });

const BlogMongoose = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
module.exports = getModel('Blog', BlogMongoose);
