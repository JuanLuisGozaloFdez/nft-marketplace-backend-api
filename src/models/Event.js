const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  event_date: { type: Date, required: true },
  location: { type: String },
  total_capacity: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
