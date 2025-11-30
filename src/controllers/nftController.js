const NFT = require('../models/NFT');
const { validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const blockchainService = require('../services/blockchainService');

exports.createNFT = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, image, tokenId } = req.body;
    
    // Sanitizar entradas
    const sanitizedName = sanitizeHtml(name);
    const sanitizedDescription = sanitizeHtml(description);

    const newNFT = new NFT({
      name: sanitizedName,
      description: sanitizedDescription,
      image,
      tokenId,
      owner: req.user.id,
    });

    const nft = await newNFT.save();
    res.json(nft);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Otros métodos del controlador...

exports.getNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find({ owner: req.user.id });
    res.json(nfts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNFT = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let nft = await NFT.findById(req.params.id);
    if (!nft) return res.status(404).json({ message: 'NFT not found' });

    if (nft.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description, image } = req.body;
    nft = await NFT.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true }
    );

    res.json(nft);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNFT = async (req, res) => {
  try {
    let nft = await NFT.findById(req.params.id);
    if (!nft) return res.status(404).json({ message: 'NFT not found' });

    if (nft.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await NFT.findByIdAndRemove(req.params.id);
    res.json({ message: 'NFT removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Mint NFT on-chain for a ticket
exports.adminMintNFT = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'organizer')) {
      return res.status(403).json({ message: 'Acceso restringido: requiere rol admin u organizer' });
    }
    const { to, ticketId, metadata } = req.body;
    if (!to || !ticketId) {
      return res.status(400).json({ message: 'to y ticketId son obligatorios' });
    }
    const receipt = await blockchainService.mintNFT(to, ticketId, metadata || {});
    return res.json({ txHash: receipt.transactionHash, status: receipt.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Blockchain mint error', error: String(error.message || error) });
  }
};

// Admin: Get NFT owner by tokenId
exports.adminGetOwner = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'organizer')) {
      return res.status(403).json({ message: 'Acceso restringido: requiere rol admin u organizer' });
    }
    const { tokenId } = req.params;
    if (!tokenId) return res.status(400).json({ message: 'tokenId es obligatorio' });
    const owner = await blockchainService.getTicketOwner(tokenId);
    return res.json({ tokenId, owner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Blockchain owner lookup error', error: String(error.message || error) });
  }
};
