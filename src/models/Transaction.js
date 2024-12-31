const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
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
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  transactionHash: {
    type: String,
    required: [true, 'Transaction hash is required'],
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
