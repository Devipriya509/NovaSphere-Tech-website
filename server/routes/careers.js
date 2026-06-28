const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  applyJob,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCareers);
router.get('/:id', getCareerById);
router.post('/:id/apply', applyJob);

// Admin-only career and application management
router.post('/', protect, adminOnly, createCareer);
router.put('/:id', protect, adminOnly, updateCareer);
router.delete('/:id', protect, adminOnly, deleteCareer);
router.get('/applications', protect, adminOnly, getJobApplications);
router.put('/applications/:id', protect, adminOnly, updateApplicationStatus);

module.exports = router;
