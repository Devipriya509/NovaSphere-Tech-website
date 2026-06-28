const sendEmail = ({ to, subject, body }) => {
  const cleanBody = body.replace(/<[^>]*>/g, ''); // strip HTML tags
  console.log(`
┌──────────────────────────────────────────────────────────┐
│                     NOVASPHERE MAILBOX                   │
├──────────────────────────────────────────────────────────┤
│ To:      ${to.padEnd(46)}│
│ Subject: ${subject.padEnd(46)}│
├──────────────────────────────────────────────────────────┤
${cleanBody.split('\n').map(line => `│ ${line.substring(0, 52).padEnd(52)} │`).slice(0, 10).join('\n')}
└──────────────────────────────────────────────────────────┘
`);
};

const sendWelcomeEmail = (user) => {
  sendEmail({
    to: user.email,
    subject: 'Welcome to NovaSphere Technologies!',
    body: `Hello ${user.name},\nThank you for registering a profile at NovaSphere.\nExplore our enterprise solutions and schedule consultation.\nBest regards,\nNovaSphere Team`
  });
};

const sendBookingConfirmation = (booking) => {
  sendEmail({
    to: booking.email,
    subject: 'Appointment Booking Received',
    body: `Hello ${booking.name},\nWe received your booking request for "${booking.service}" on ${booking.date}.\nAn administrator will review and confirm shortly.\nReceipt slip can be downloaded from your profile dashboard.`
  });
};

const sendBookingStatusUpdate = (booking, status) => {
  sendEmail({
    to: booking.email,
    subject: `Appointment Status: ${status}`,
    body: `Hello ${booking.name},\nYour booking request for "${booking.service}" has been updated to: ${status.toUpperCase()}.\nDetails can be reviewed in your User Dashboard.\nThank you for choosing NovaSphere.`
  });
};

const sendPasswordResetCode = (email, code) => {
  sendEmail({
    to: email,
    subject: 'Password Reset Request',
    body: `Dear client,\nWe received a password reset request.\nYour confirmation code is: ${code}\nPlease enter this code on the reset page to confirm.\nIf you did not request this, ignore this mail.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate,
  sendPasswordResetCode
};
