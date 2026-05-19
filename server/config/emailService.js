const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (booking) => {
  await transporter.sendMail({
    from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Booking Confirmed! 🎉",
    html: ` 
      <h2>Hi ${booking.name}! 👋</h2>
      <p>Your booking is <b>confirmed</b> ✅</p>
      <hr/>
      <p><b>📅 Date:</b> ${booking.date}</p>
      <p><b>📍 Venue:</b> ${booking.venue}</p>
      <p><b>🎯 Service:</b> ${booking.package?.service || "Multiple Services"}</p>
      <p><b>💰 Amount:</b> ₹${booking.advanceAmount || booking.totalAmount}</p>
      <hr/>
      <p>Thank you for choosing <b>BookMyEvent</b>! 🎊</p>
    `,
  });
};

module.exports = { sendBookingConfirmation };