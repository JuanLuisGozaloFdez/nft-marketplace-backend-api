const { validationResult } = require('express-validator');
const Event = require('../models/Event');

exports.list = async (req, res) => {
  const events = await Event.find().sort({ event_date: 1 }).lean();
  res.json(events.map((e) => ({
    id: String(e._id),
    name: e.name,
    description: e.description,
    event_date: e.event_date,
    location: e.location,
    total_capacity: e.total_capacity,
    status: e.status,
  })));
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, event_date, location, total_capacity, status } = req.body;
  const ev = await Event.create({ name, description, event_date, location, total_capacity, status });
  res.status(201).json({ id: String(ev._id) });
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const { name, description, event_date, location, total_capacity, status } = req.body;
  const ev = await Event.findByIdAndUpdate(id, { name, description, event_date, location, total_capacity, status }, { new: true });
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json({ id: String(ev._id) });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const ev = await Event.findByIdAndDelete(id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json({ ok: true });
};
