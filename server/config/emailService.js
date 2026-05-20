const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Shared HTML wrapper ──────────────────────────────────
const wrap = (body) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
    <div style="background:#7c3aed;padding:20px 30px;">
      <h1 style="color:#fff;margin:0;font-size:22px;">📅 BookMyEvent</h1>
    </div>
    <div style="padding:30px;">
      ${body}
    </div>
    <div style="background:#f3f4f6;padding:15px 30px;text-align:center;font-size:12px;color:#6b7280;">
      © ${new Date().getFullYear()} BookMyEvent. All rights reserved.
    </div>
  </div>
`;

// ─── 1. Booking Confirmation ──────────────────────────────
const sendBookingConfirmation = async (booking) => {
  const serviceLabel = booking.isMultiBooking
    ? booking.packages?.map((p) => p.service).join(", ")
    : booking.package?.service || "Service";

  const amountLabel =
    booking.paymentType === "advance"
      ? `₹${booking.advanceAmount} (Advance) — Remaining: ₹${booking.remainingAmount}`
      : `₹${booking.totalAmount || booking.package?.price || 0} (Full Payment)`;

  await transporter.sendMail({
    from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Booking Confirmed! 🎉",
    html: wrap(`
      <h2 style="color:#7c3aed;">Hi ${booking.name}! 👋</h2>
      <p>Your booking is <b style="color:#16a34a;">Confirmed ✅</b></p>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;">
        <tr><td style="padding:8px 0;color:#6b7280;">📅 Date</td><td><b>${booking.date}</b></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">📍 Venue</td><td><b>${booking.venue}</b></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">🎯 Service</td><td><b>${serviceLabel}</b></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">💰 Amount</td><td><b>${amountLabel}</b></td></tr>
      </table>
      <p style="margin-top:20px;">Thank you for choosing <b>BookMyEvent</b>! We'll make your event unforgettable 🎊</p>
    `),
  });
};

// ─── 2. Booking Cancellation ──────────────────────────────
const sendBookingCancellation = async ({ name, email, date, venue, refundAmount }) => {
  const refundLine =
    refundAmount > 0
      ? `<p>💰 <b>₹${refundAmount}</b> has been refunded to your wallet.</p>`
      : `<p>No refund applicable for this booking.</p>`;

  await transporter.sendMail({
    from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Booking Cancelled",
    html: wrap(`
      <h2 style="color:#7c3aed;">Hi ${name},</h2>
      <p>Your booking has been <b style="color:#dc2626;">Cancelled ❌</b></p>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;">
        <tr><td style="padding:8px 0;color:#6b7280;">📅 Date</td><td><b>${date}</b></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">📍 Venue</td><td><b>${venue}</b></td></tr>
      </table>
      ${refundLine}
      <p style="margin-top:20px;">If you have any questions, feel free to reach out to us.</p>
    `),
  });
};

// ─── 3. Forgot Password OTP ───────────────────────────────
const sendOTPEmail = async ({ name, email, otp }) => {
  await transporter.sendMail({
    from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP 🔐",
    html: wrap(`
      <h2 style="color:#7c3aed;">Hi ${name},</h2>
      <p>We received a request to reset your password. Use the OTP below:</p>
      <div style="text-align:center;margin:30px 0;">
        <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#7c3aed;">${otp}</span>
      </div>
      <p style="color:#6b7280;font-size:13px;">⏳ This OTP is valid for <b>10 minutes</b>.</p>
      <p style="color:#6b7280;font-size:13px;">If you didn't request this, please ignore this email.</p>
    `),
  });
};

// ─── 4. Custom Request — Quote Received ──────────────────
const sendQuoteReceived = async ({ name, email, eventCategory, quotedPrice, adminNote, requestId }) => {
  await transporter.sendMail({
    from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Quote Received for Your Event Request 💌",
    html: wrap(`
      <h2 style="color:#7c3aed;">Hi ${name},</h2>
      <p>Great news! We've reviewed your <b>${eventCategory}</b> event request and sent you a quote.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:15px;">
        <tr><td style="padding:8px 0;color:#6b7280;">💰 Quoted Price</td><td><b style="color:#16a34a;">₹${quotedPrice}</b></td></tr>
        ${adminNote ? `<tr><td style="padding:8px 0;color:#6b7280;">📝 Note</td><td>${adminNote}</td></tr>` : ""}
      </table>
      <p style="margin-top:20px;">Please login to your dashboard to <b>Accept or Decline</b> this quote.</p>
      <p style="color:#6b7280;font-size:13px;">Quote will expire if not responded to in time.</p>
    `),
  });
};

// ─── 5. Custom Request — Status Update ───────────────────
const sendCustomRequestStatusUpdate = async ({ name, email, eventCategory, status, adminNote }) => {
  const statusConfig = {
    reviewing: { label: "Under Review 🔍", color: "#d97706", msg: "Our team is reviewing your request. We'll get back to you soon." },
    rejected:  { label: "Rejected ❌",      color: "#dc2626", msg: "Unfortunately, we are unable to process your request at this time." },
    completed: { label: "Completed 🎊",     color: "#16a34a", msg: "Your event has been successfully completed. Thank you for choosing BookMyEvent!" },
  };

  const config = statusConfig[status];
  if (!config) return; // Only send for these 3 statuses

  await transporter.sendMail({
    from: `"BookMyEvent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Event Request is ${config.label}`,
    html: wrap(`
      <h2 style="color:#7c3aed;">Hi ${name},</h2>
      <p>Your <b>${eventCategory}</b> event request status has been updated to:</p>
      <p style="font-size:20px;font-weight:bold;color:${config.color};">${config.label}</p>
      <p>${config.msg}</p>
      ${adminNote ? `<p style="background:#f3f4f6;padding:12px;border-radius:6px;">📝 <b>Admin Note:</b> ${adminNote}</p>` : ""}
      <p style="margin-top:20px;">You can view your request details in your dashboard.</p>
    `),
  });
};

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation,
  sendOTPEmail,
  sendQuoteReceived,
  sendCustomRequestStatusUpdate,
};