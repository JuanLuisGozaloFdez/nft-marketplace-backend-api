const Web3 = require('web3');
const { BLOCKCHAIN_PROVIDER_URL } = require('../config');

const web3 = new Web3(new Web3.providers.HttpProvider(BLOCKCHAIN_PROVIDER_URL));

exports.isValidAddress = (address) => {
  return web3.utils.isAddress(address);
};

exports.toWei = (amount, unit = 'ether') => {
  return web3.utils.toWei(amount.toString(), unit);
};

exports.fromWei = (amount, unit = 'ether') => {
  return web3.utils.fromWei(amount.toString(), unit);
};
