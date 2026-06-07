
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
  // Force IPv4
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Add connection timeout and family
  connectionTimeout: 10000,
  socketTimeout: 10000,
  family: 4, // Force IPv4
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
    res.json({
      emailUser: process.env.EMAIL_USER,
      emailPassExists: !!process.env.EMAIL_PASS,
    });
  } catch (err) {
    console.log(err);
  }
});
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
