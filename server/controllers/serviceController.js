const Service = require('../models/Service');

const getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, count: services.length, services });
  } catch (err) {
    next(err);
  }
};

const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
    const { title, slug, description, features, technologies, pricing, icon } = req.body;
    if (!title || !slug || !description || !pricing) {
      return res.status(400).json({ success: false, message: 'Title, slug, description, and pricing are required' });
    }

    const service = await Service.create({
      title,
      slug,
      description,
      features: features || [],
      technologies: technologies || [],
      pricing,
      icon: icon || 'Cpu'
    });

    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, message: 'Service updated successfully', service });
  } catch (err) {
    next(err);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
};
