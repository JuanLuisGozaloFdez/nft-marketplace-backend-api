const Web3 = require('web3');
const { BLOCKCHAIN_PROVIDER_URL } = require('./index');

let web3;

const initWeb3 = () => {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(BLOCKCHAIN_PROVIDER_URL));
  }
  return web3;
};

module.exports = { initWeb3 };
