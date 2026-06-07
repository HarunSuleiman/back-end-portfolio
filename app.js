require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://harunsuleiman-portfolio.netlify.app",
    ],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);

// Configure transporter with explicit settings and IPv4
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4, // Force IPv4
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error.message);
  } else {
    console.log("SMTP Ready - Email service is working");
  }
});

app.get("/", (req, res) => {
  res.send("Portfolio Backend Running");
});

app.post("/contact", async (req, res) => {
  console.log("REQUEST BODY:", req.body);

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required",
    });
  }

  // Email content
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Portfolio Contact: ${subject || "No Subject"}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
    replyTo: email,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    res.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("EMAIL ERROR:", err.message);
    console.error("Full error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
