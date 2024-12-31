const { create } = require('ipfs-http-client');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

class IPFSService {
  constructor() {
    this.ipfs = create({ url: process.env.IPFS_URL });
  }

  initRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 50
    });
  }

  async uploadToIPFS(data) {
    if (!validator.isJSON(JSON.stringify(data))) {
      throw new Error('Invalid data format');
    }
    const result = await this.ipfs.add(JSON.stringify(data));
    return result.path;
  }

  async getFromIPFS(cid) {
    if (!validator.isHash(cid, 'sha256')) {
      throw new Error('Invalid CID format');
    }
    const stream = this.ipfs.cat(cid);
    let data = '';
    for await (const chunk of stream) {
      data += chunk.toString();
    }
    return JSON.parse(data);
  }
}

module.exports = new IPFSService();
