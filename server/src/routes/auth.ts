import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { db } from '../database/init';
import { User } from '../types/database';

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Sorting Algorithms Learning Platform - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Sorting Algorithms Learning Platform</h2>
        <p>Hello! Thank you for registering on our sorting algorithms learning platform.</p>
        <p>Your verification code is:</p>
        <h1 style="color: #059669; font-size: 32px; text-align: center; padding: 20px; background-color: #f0fdf4; border-radius: 8px;">${code}</h1>
        <p>The verification code is valid for 10 minutes. Please complete the verification as soon as possible.</p>
        <p>If this was not your operation, please ignore this email.</p>
        <p>Best regards,<br>Sorting Algorithms Learning Platform Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Insert user
    const result = await db.run(
      'INSERT INTO users (email, password, username, verification_code, is_verified) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, username || null, verificationCode, false]
    );

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as unknown as User;
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as unknown as User;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check verification code
    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update user as verified
    await db.run('UPDATE users SET is_verified = true, verification_code = NULL WHERE id = ?', [user.id]);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]) as unknown as User;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();

    // Update verification code
    await db.run('UPDATE users SET verification_code = ? WHERE id = ?', [verificationCode, user.id]);

    // Send new verification email
    await sendVerificationEmail(email, verificationCode);

    res.json({ message: 'Verification code resent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

export { router as authRoutes }; 