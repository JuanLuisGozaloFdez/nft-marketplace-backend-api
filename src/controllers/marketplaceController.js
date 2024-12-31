const Listing = require('../models/Listing');
const NFT = require('../models/NFT');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

exports.listNFT = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nftId, price } = req.body;
    const nft = await NFT.findById(nftId);

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (nft.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const newListing = new Listing({
      nft: nftId,
      seller: req.user.id,
      price,
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.buyNFT = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('nft');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot buy your own NFT' });
    }

    // Here you would typically interact with the blockchain to transfer the NFT
    // and handle the payment. This is a simplified version.

    const transaction = new Transaction({
      nft: listing.nft._id,
      seller: listing.seller,
      buyer: req.user.id,
      price: listing.price,
    });

    await transaction.save();

    // Update NFT owner
    listing.nft.owner = req.user.id;
    await listing.nft.save();

    // Remove listing
    await Listing.findByIdAndRemove(req.params.id);

    res.json({ message: 'NFT purchased successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
