const Ticket = require('../models/Ticket');
const CheckinAudit = require('../models/CheckinAudit');
const { getTicketOwner } = require('../services/blockchainService');

exports.validateCheckin = async (req, res, next) => {
  try {
    const { tokenId, eventId } = req.body;
    if (!tokenId || !eventId) return res.status(400).json({ error: 'tokenId and eventId are required' });

    const onchainOwner = await getTicketOwner(tokenId);
    const ticket = await Ticket.findOne({ tokenId });

    // Initialize or update ticket record
    if (!ticket) {
      await Ticket.create({ tokenId, ownerAddress: onchainOwner, eventId });
    } else if (ticket.ownerAddress !== onchainOwner) {
      ticket.ownerAddress = onchainOwner;
      await ticket.save();
    }

    let result = 'SUCCESS';
    let message = 'Check-in validated';

    const updated = await Ticket.findOne({ tokenId });
    if (updated.used) {
      result = 'ALREADY_USED';
      message = 'Ticket was already used';
    }

    // Mark as used when valid and not used
    if (result === 'SUCCESS') {
      updated.used = true;
      updated.usedAt = new Date();
      updated.usedBy = req.user ? String(req.user._id) : undefined;
      await updated.save();
    }

    await CheckinAudit.create({
      tokenId,
      eventId,
      ownerAddress: onchainOwner,
      validatorUserId: req.user ? req.user._id : undefined,
      result,
      message,
    });

    return res.json({ tokenId, eventId, owner: onchainOwner, result, message });
  } catch (err) {
    await CheckinAudit.create({
      tokenId: req.body?.tokenId,
      eventId: req.body?.eventId,
      ownerAddress: 'unknown',
      validatorUserId: req.user ? req.user._id : undefined,
      result: 'ERROR',
      message: err.message,
    }).catch(() => {});
    next(err);
  }
};
const { validationResult } = require('express-validator')
const blockchainService = require('../services/blockchainService')
const Ticket = require('../models/Transaction')

exports.validateCheckin = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'organizer')) {
      return res.status(403).json({ message: 'Acceso restringido: requiere rol admin u organizer' })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { tokenId, expectedOwner } = req.body
    const owner = await blockchainService.getTicketOwner(tokenId)
    if (expectedOwner && owner.toLowerCase() !== expectedOwner.toLowerCase()) {
      return res.status(409).json({ ok: false, reason: 'owner-mismatch', owner })
    }

    // Marca el ticket como usado en la base si existiese (placeholder usando Transaction)
    await Ticket.updateOne({ nftTokenId: tokenId }, { $set: { status: 'used' } })

    return res.json({ ok: true, owner })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Error en validación de check-in', error: String(error.message || error) })
  }
}
