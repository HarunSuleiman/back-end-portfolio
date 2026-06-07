
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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP Ready");
  }
});

app.get("/", (req, res) => {
  res.send("Portfolio Backend Running");
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "harunsuleiman55@gmail.com",
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h2>New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      error: "Failed to send email",
    });
  }
});
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
