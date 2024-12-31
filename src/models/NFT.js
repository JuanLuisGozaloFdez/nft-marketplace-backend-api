const mongoose = require('mongoose');
const validator = require('validator');

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: [validator.isURL, 'Please provide a valid URL for the image']
  },
  tokenId: {
    type: String,
    required: [true, 'Token ID is required'],
    unique: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('NFT', NFTSchema);
