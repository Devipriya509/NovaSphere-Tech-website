const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({ success: true, results: { services: [], projects: [], blogs: [] } });
    }

    const regex = new RegExp(q.trim(), 'i');

    const services = await Service.find({
      $or: [
        { title: regex },
        { description: regex },
        { technologies: regex }
      ]
    }).limit(5);

    const projects = await Portfolio.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { technologies: regex }
      ]
    }).limit(5);

    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { content: regex },
        { category: regex }
      ]
    }).limit(5);

    res.status(200).json({
      success: true,
      results: {
        services,
        projects,
        blogs
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
