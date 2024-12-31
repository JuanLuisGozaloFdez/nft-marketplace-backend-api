const rateLimit = require('express-rate-limit');
const validator = require('validator');
const Listing = require('../models/Listing');
const NFT = require('../models/NFT');

class MarketplaceService {
  initRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
  }

  async createListing(nftId, price, sellerId) {
    if (!validator.isMongoId(nftId) || !validator.isFloat(price.toString()) || !validator.isMongoId(sellerId)) {
      throw new Error('Invalid input data');
    }

    const nft = await NFT.findById(nftId);
    if (!nft || nft.owner.toString() !== sellerId) {
      throw new Error('NFT not found or not owned by seller');
    }

    const listing = new Listing({
      nft: nftId,
      seller: sellerId,
      price
    });

    return listing.save();
  }

  async buyNFT(listingId, buyerId) {
    if (!validator.isMongoId(listingId) || !validator.isMongoId(buyerId)) {
      throw new Error('Invalid input data');
    }

    const listing = await Listing.findById(listingId).populate('nft');
    if (!listing || listing.status !== 'active') {
      throw new Error('Listing not found or not active');
    }

    listing.status = 'sold';
    listing.nft.owner = buyerId;

    await listing.save();
    await listing.nft.save();

    return listing;
  }
}

module.exports = new MarketplaceService();
