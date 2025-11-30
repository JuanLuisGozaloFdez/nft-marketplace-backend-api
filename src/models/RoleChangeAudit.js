const mongoose = require('mongoose');

const roleChangeAuditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  oldRole: { type: String },
  newRole: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  changedByEmail: { type: String },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RoleChangeAudit', roleChangeAuditSchema);
