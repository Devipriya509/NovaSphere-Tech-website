const Blog = require('../models/Blog');

const getBlogs = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let blogs;

    if (search) {
      // Find using regex matches on title or content
      blogs = await Blog.findWithRegex('title', search, category ? { category } : {});
      if (blogs.length === 0) {
        blogs = await Blog.findWithRegex('content', search, category ? { category } : {});
      }
    } else if (category) {
      blogs = await Blog.find({ category });
    } else {
      blogs = await Blog.find();
    }

    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    next(err);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { views: (blog.views || 0) + 1 });

    res.status(200).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, slug, content, image, category, tags, readTime, author } = req.body;
    if (!title || !slug || !content || !image || !category) {
      return res.status(400).json({ success: false, message: 'Title, slug, content, image, and category are required' });
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      image,
      category,
      tags: tags || [],
      readTime: readTime || '5 mins',
      author: author || 'NovaSphere Editorial',
      views: 0,
      comments: []
    });

    res.status(201).json({ success: true, message: 'Blog post created successfully', blog });
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.status(200).json({ success: true, message: 'Blog post updated successfully', blog });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorName, content } = req.body;
    if (!authorName || !content) {
      return res.status(400).json({ success: false, message: 'Author name and comment content are required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const newComment = {
      _id: Math.random().toString(36).substr(2, 9),
      authorName,
      content,
      createdAt: new Date().toISOString()
    };

    const comments = blog.comments || [];
    comments.push(newComment);

    const updatedBlog = await Blog.findByIdAndUpdate(id, { comments });
    res.status(201).json({ success: true, message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment
};
