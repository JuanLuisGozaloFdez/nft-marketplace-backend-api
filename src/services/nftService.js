const rateLimit = require('express-rate-limit');
const validator = require('validator');
const NFT = require('../models/NFT');
const ipfsService = require('./ipfsService');

class NFTService {
  initRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 50
    });
  }

  async createNFT(name, description, image, tokenId, ownerId) {
    if (!validator.isLength(name, { min: 1, max: 100 }) ||
        !validator.isLength(description, { min: 1, max: 1000 }) ||
        !validator.isURL(image) ||
        !validator.isAlphanumeric(tokenId) ||
        !validator.isMongoId(ownerId)) {
      throw new Error('Invalid input data');
    }

    const metadata = { name, description, image };
    const ipfsCid = await ipfsService.uploadToIPFS(metadata);

    const nft = new NFT({
      name,
      description,
      image,
      tokenId,
      owner: ownerId,
      metadataUri: `ipfs://${ipfsCid}`
    });

    return nft.save();
  }

  async getNFTsByOwner(ownerId) {
    if (!validator.isMongoId(ownerId)) {
      throw new Error('Invalid owner ID');
    }
    return NFT.find({ owner: ownerId });
  }
}

module.exports = new NFTService();
