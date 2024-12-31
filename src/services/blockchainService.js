const Web3 = require('web3');
const rateLimit = require('express-rate-limit');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

class BlockchainService {
  constructor() {
    this.web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER_URL);
    this.secretManager = new SecretManagerServiceClient();
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
}

module.exports = new BlockchainService();
