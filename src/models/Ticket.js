const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true, index: true },
  ownerAddress: { type: String, required: true, index: true },
  eventId: { type: String, required: true },
  metadataURI: { type: String },
  used: { type: Boolean, default: false },
  usedAt: { type: Date },
  usedBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
