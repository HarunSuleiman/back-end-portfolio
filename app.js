const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "portfolio_contact",
});

// CONNECT DATABASE
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }

  console.log("Connected to MySQL database!");
});

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "harunsuleiman55@gmail.com",
    pass: "kuau kyfa odfx seko",
  },
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Portfolio Backend Running");
});

// CONTACT API
app.post("/contact", (req, res) => {
  console.log(req.body);

  const { name, email, subject, message } = req.body;

  // SAVE TO MYSQL
  const sql = `
    INSERT INTO contacts(name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [name, email, subject, message],
    async (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Failed to save message",
        });
      }

      // EMAIL CONTENT
      const mailOptions = {
        from: email,

        to: "harunsuleiman55@gmail.com",

        subject: `Portfolio Contact: ${subject}`,

        html: `
          <h2>New Portfolio Contact Message</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Subject:</strong> ${subject}</p>

          <p><strong>Message:</strong></p>

          <p>${message}</p>
        `,
      };

      try {
        // SEND EMAIL
        await transporter.sendMail(mailOptions);

        res.json({
          message: "🎉 Message sent successfully!",
        });
      } catch (emailError) {
        console.log(emailError);

        res.status(500).json({
          error: "Email failed to send",
        });
      }
    },
  );
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
