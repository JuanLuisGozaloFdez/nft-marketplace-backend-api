const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: [true, 'NFT is required']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
