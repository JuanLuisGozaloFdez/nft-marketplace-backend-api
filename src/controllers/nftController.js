const NFT = require('../models/NFT');
const { validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

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
