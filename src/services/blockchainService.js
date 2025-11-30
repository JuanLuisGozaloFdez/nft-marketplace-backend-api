const Web3 = require('web3');
const rateLimit = require('express-rate-limit');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');
const { BLOCKCHAIN_PROVIDER_URL, CONTRACT_ADDRESS } = require('../config');

class BlockchainService {
  constructor() {
    this.web3 = new Web3(BLOCKCHAIN_PROVIDER_URL);
    this.secretManager = new SecretManagerServiceClient();
    this.nft = null;
  }

  initRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
  }

  async getPrivateKey() {
    const [version] = await this.secretManager.accessSecretVersion({
      name: 'projects/your-project/secrets/blockchain-private-key/versions/latest'
    });
    return version.payload.data.toString('utf8');
  }

  async sendTransaction(to, value) {
    const privateKey = await this.getPrivateKey();
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    const tx = {
      to,
      value: this.web3.utils.toWei(value.toString(), 'ether'),
      gas: 21000
    };
    const signedTx = await account.signTransaction(tx);
    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  connectToBlockchain() {
    return this.web3;
  }

  loadNFTContract() {
    if (this.nft) return this.nft;
    const abiPath = path.resolve(__dirname, '../../..', 'nft-marketplace-smart-contracts/artifacts/contracts/NFT.sol/NFT.json');
    const json = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
    this.nft = new this.web3.eth.Contract(json.abi, CONTRACT_ADDRESS);
    return this.nft;
  }

  async mintNFT(to, ticketId, metadata) {
    const privateKey = await this.getPrivateKey();
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(account);
    const nft = this.loadNFTContract();
    const tx = nft.methods.mintWithMetadata(to, ticketId, metadata);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    return receipt;
  }

  async verifyMintTransaction(hash) {
    const receipt = await this.web3.eth.getTransactionReceipt(hash);
    return receipt && receipt.status;
  }

  async getTicketOwner(tokenId) {
    const nft = this.loadNFTContract();
    return nft.methods.ownerOf(tokenId).call();
  }

  async transferTicket(fromPrivateKey, to, tokenId) {
    const account = this.web3.eth.accounts.privateKeyToAccount(fromPrivateKey);
    this.web3.eth.accounts.wallet.add(account);
    const nft = this.loadNFTContract();
    const tx = nft.methods.transferFrom(account.address, to, tokenId);
    const gas = await tx.estimateGas({ from: account.address });
    const receipt = await tx.send({ from: account.address, gas });
    return receipt;
  }
}

module.exports = new BlockchainService();
