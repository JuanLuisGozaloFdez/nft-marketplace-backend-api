const mongoose = require('mongoose');

const checkinAuditSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, index: true },
  eventId: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  validatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  result: { type: String, enum: ['SUCCESS', 'ALREADY_USED', 'NOT_OWNER', 'ERROR'], required: true },
  message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CheckinAudit', checkinAuditSchema);
