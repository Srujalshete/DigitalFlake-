const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Login handler
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to check if the admin exists with the provided email
    const [result] = await db
      .promise()
      .query("SELECT * FROM admin WHERE email = ?", [email]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = result[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a JWT token if the email and password match
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and a success message
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Register handler
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const [existingAdmin] = await db
      .promise()
      .query("SELECT * FROM admin WHERE email = ?", [email]);

    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const [result] = await db
      .promise()
      .query("INSERT INTO admin (email, password) VALUES (?, ?)", [
        email,
        hashedPassword,
      ]);

    // Optionally, you can generate a JWT token for the new admin (if you want to log them in immediately)
    const token = jwt.sign(
      { id: result.insertId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return a success response with the token
    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password Handler
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the email exists in the Admin table
    const [admin] = await db
      .promise()
      .query("SELECT * FROM Admin WHERE email = ?", [email]);

    if (admin.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminDetails = admin[0];

    // Generate a secure random token using the crypto module
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store the reset token and its expiration time in the database
    await db
      .promise()
      .query(
        "UPDATE Admin SET reset_token = ?, reset_token_expiration = ? WHERE id = ?",
        [resetToken, resetTokenExpiration, adminDetails.id]
      );

    // Send reset email to the user with the reset link containing the token
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const resetLink = `${process.env.Vite_APP_API_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error sending email", error: error.message });
      }
      res.status(200).json({ message: "Password reset link sent to email" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Handler
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Check if token and new password are provided
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    // Check if the token exists in the Admin table
    const [admin] = await db
      .promise()
      .query("SELECT * FROM Admin WHERE reset_token = ?", [token]);

    if (admin.length === 0) {
      return res.status(404).json({ message: "Invalid token" });
    }

    const adminDetails = admin[0];

    // Check if the token has expired
    if (new Date() > new Date(adminDetails.reset_token_expiration)) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the reset token in the database
    await db
      .promise()
      .query(
        "UPDATE Admin SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?",
        [hashedPassword, adminDetails.id]
      );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login, register, forgotPassword, resetPassword };
