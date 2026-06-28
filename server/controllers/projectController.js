const Portfolio = require('../models/Portfolio');

const getProjects = async (req, res, next) => {
  try {
    const projects = await Portfolio.find();
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Portfolio.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, image, category, technologies, client, liveDemo, github } = req.body;
    if (!title || !description || !image || !category || !client) {
      return res.status(400).json({ success: false, message: 'Title, description, image, category, and client are required' });
    }

    const project = await Portfolio.create({
      title,
      description,
      image,
      category,
      technologies: technologies || [],
      client,
      liveDemo: liveDemo || '',
      github: github || ''
    });

    res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Portfolio.findByIdAndUpdate(id, req.body);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, message: 'Project updated successfully', project });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Portfolio.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
