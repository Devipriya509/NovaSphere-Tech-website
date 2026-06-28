const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const Career = require('../models/Career');
const Portfolio = require('../models/Portfolio');
const Testimonial = require('../models/Testimonial');

const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Appointment.countDocuments();
    const confirmedBookings = await Appointment.countDocuments({ status: 'Confirmed' });
    const pendingBookings = await Appointment.countDocuments({ status: 'Pending' });
    const cancelledBookings = await Appointment.countDocuments({ status: 'Cancelled' });
    const totalMessages = await Message.countDocuments();
    const totalJobs = await Career.countDocuments();
    const totalProjects = await Portfolio.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();

    // Financial estimations based on booked services
    const estimatedRevenue = confirmedBookings * 15000; // Mock average project value $15k
    const pendingRevenue = pendingBookings * 8500;

    // Fetch lists
    const allBookings = await Appointment.find();
    const allMessages = await Message.find();
    const allUsers = await User.find();

    // Generate recent activity timeline feed chronologically
    const activities = [];
    allUsers.forEach(u => {
      activities.push({
        id: `u-${u._id}`,
        type: 'registration',
        text: `New user registration: ${u.name} (${u.email})`,
        time: u.createdAt
      });
    });
    allBookings.forEach(b => {
      activities.push({
        id: `b-${b._id}`,
        type: 'booking',
        text: `Appointment requested by ${b.name} for "${b.service}"`,
        time: b.createdAt
      });
    });
    allMessages.forEach(m => {
      activities.push({
        id: `m-${m._id}`,
        type: 'message',
        text: `Contact request from ${m.name}: "${m.subject}"`,
        time: m.createdAt
      });
    });

    const recentActivity = activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    // Bookings count per month mock charts matching database count
    const bookingsByMonthChart = [
      { name: 'Jan', Bookings: 4 },
      { name: 'Feb', Bookings: 8 },
      { name: 'Mar', Bookings: 15 },
      { name: 'Apr', Bookings: 12 },
      { name: 'May', Bookings: 22 },
      { name: 'Jun', Bookings: totalBookings > 0 ? totalBookings + 5 : 18 }
    ];

    const serviceDistributionChart = [
      { name: 'AI Solutions', value: 35 },
      { name: 'Web Dev', value: 25 },
      { name: 'Cybersecurity', value: 15 },
      { name: 'Mobile Apps', value: 15 },
      { name: 'Cloud Services', value: 10 }
    ];

    res.status(200).json({
      success: true,
      analytics: {
        stats: {
          users: totalUsers,
          bookings: totalBookings,
          confirmedBookings,
          pendingBookings,
          cancelledBookings,
          revenue: estimatedRevenue,
          pendingRevenue,
          messages: totalMessages,
          jobs: totalJobs,
          projects: totalProjects,
          testimonials: totalTestimonials
        },
        recentActivity,
        charts: {
          bookingsByMonth: bookingsByMonthChart,
          serviceDistribution: serviceDistributionChart
        },
        usersList: allUsers.map(u => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          isBlocked: u.isBlocked || false,
          createdAt: u.createdAt
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminAnalytics
};
