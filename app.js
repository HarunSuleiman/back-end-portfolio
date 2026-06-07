
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
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
    console.log("REQUEST BODY:", req.body);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "harunsuleiman55@gmail.com",
      subject: "Portfolio Test",
      text: "Testing email",
    });

    console.log("EMAIL SENT:", info);

    res.status(200).json({
      success: true,
      info,
    });
  } catch (error) {
    console.error("FULL EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
