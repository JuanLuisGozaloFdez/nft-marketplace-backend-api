const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const speakeasy = require('speakeasy');
const rateLimit = require('express-rate-limit');
const { generateToken } = require('../utils/jwtUtils');

// Implementar rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // limitar a 5 intentos de login por ventana por IP
});

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generar secreto para 2FA
    const secret = speakeasy.generateSecret();

    user = new User({ 
      username, 
      email, 
      password,
      twoFactorSecret: secret.base32
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      twoFactorSecret: secret.base32
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = [loginLimiter, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, token } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verificar 2FA si se proporciona token (modo flexible)
    if (token) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token
      });
      if (!verified) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }
    }

    const role = user.role || 'user';
    const jwtToken = generateToken(user.id, role);
    res.json({ token: jwtToken, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}];

exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select('_id email role username').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: String(user._id), email: user.email, role: user.role, username: user.username });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
