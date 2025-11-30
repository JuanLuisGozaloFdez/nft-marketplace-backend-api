require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  BLOCKCHAIN_PROVIDER_URL: process.env.BLOCKCHAIN_PROVIDER_URL,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
};
