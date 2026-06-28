const Career = require('../models/Career');
const JobApplication = require('../models/JobApplication');

const getCareers = async (req, res, next) => {
  try {
    const jobs = await Career.find();
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};

const getCareerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Career.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

const createCareer = async (req, res, next) => {
  try {
    const { title, department, location, type, salary, description, requirements, responsibilities } = req.body;
    if (!title || !department || !location || !type || !salary || !description) {
      return res.status(400).json({ success: false, message: 'All main fields are required' });
    }

    const job = await Career.create({
      title,
      department,
      location,
      type,
      salary,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || []
    });

    res.status(201).json({ success: true, message: 'Job posting created successfully', job });
  } catch (err) {
    next(err);
  }
};

const updateCareer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Career.findByIdAndUpdate(id, req.body);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.status(200).json({ success: true, message: 'Job posting updated successfully', job });
  } catch (err) {
    next(err);
  }
};

const deleteCareer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Career.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.status(200).json({ success: true, message: 'Job posting deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const applyJob = async (req, res, next) => {
  try {
    const { careerId, jobTitle, name, email, phone, coverLetter, resume } = req.body;
    if (!careerId || !jobTitle || !name || !email || !phone || !resume) {
      return res.status(400).json({ success: false, message: 'Please provide all details and upload your resume' });
    }

    const application = await JobApplication.create({
      careerId,
      jobTitle,
      name,
      email,
      phone,
      coverLetter: coverLetter || '',
      resume, // Storing base64 resume or path
      status: 'Pending'
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully! Our HR team will contact you.', application });
  } catch (err) {
    next(err);
  }
};

const getJobApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Pending', 'Reviewed', 'Shortlisted', 'Rejected'
    if (!['Pending', 'Reviewed', 'Shortlisted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const app = await JobApplication.findByIdAndUpdate(id, { status });
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, message: `Application status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  applyJob,
  getJobApplications,
  updateApplicationStatus
};
