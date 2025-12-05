const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// CORS
app.use(cors());
app.use(express.json());

// Debug
console.log("Backend starting...");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Verify login
try {
    transporter.verify();
    console.log("Email transporter is ready ✔️");
} catch (err) {
    console.log("Transporter verify error:", err);
}

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✔️");
});

// Contact route
app.post("/contact", (req, res) => {
  console.log("📩 /contact hit. Body:", req.body);

  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("EMAIL SEND ERROR:", err);
      return res.json({ message: "❌ Failed to send message" });
    }

    console.log("EMAIL SENT SUCCESSFULLY:", info.response);
    return res.json({ message: "✅ Message sent successfully!" });
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running and listening on http://localhost:5000");
});
