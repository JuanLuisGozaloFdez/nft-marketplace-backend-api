const { validationResult } = require('express-validator');
const User = require('../models/User');
const RoleChangeAudit = require('../models/RoleChangeAudit');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { email: 1, username: 1, role: 1 }).lean();
    res.json(users.map((u) => ({ id: String(u._id), email: u.email, username: u.username, role: u.role || 'user' })));
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const { role, reason } = req.body;
    const allowed = ['admin','organizer','staff','user'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' });
    
    const targetUser = await User.findById(id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    
    const oldRole = targetUser.role || 'user';
    targetUser.role = role;
    await targetUser.save();
    
    // Log role change audit
    await RoleChangeAudit.create({
      userId: targetUser._id,
      oldRole,
      newRole: role,
      changedBy: req.user._id,
      changedByEmail: req.user.email,
      reason: reason || 'No reason provided',
    });
    
    res.json({ id: String(targetUser._id), role: targetUser.role });
  } catch (err) {
    next(err);
  }
};
