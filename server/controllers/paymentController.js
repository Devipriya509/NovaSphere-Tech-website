const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment');

// ==========================================
// RAZORPAY CONFIGURATION
// Add your live or test API keys to server/.env:
// - RAZORPAY_KEY_ID
// - RAZORPAY_KEY_SECRET
// ==========================================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key'
});

const createOrder = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;
    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Booking ID and amount are required' });
    }

    const booking = await Appointment.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Appointment booking not found' });
    }

    // Convert INR to Paise (e.g. 500 INR = 50000 Paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingId
    };

    const order = await razorpay.orders.create(options);
    
    // Save order details to booking
    await Appointment.findByIdAndUpdate(bookingId, { 
      razorpayOrderId: order.id,
      amountPaid: amount
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id'
    });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ success: false, message: 'Verification arguments missing' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Set status to paid
      await Appointment.findByIdAndUpdate(bookingId, {
        paymentStatus: 'Paid',
        razorpayPaymentId: razorpay_payment_id
      });

      res.status(200).json({
        success: true,
        message: 'Payment captured and signature verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Signature signature mismatch. Verification failed.'
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
