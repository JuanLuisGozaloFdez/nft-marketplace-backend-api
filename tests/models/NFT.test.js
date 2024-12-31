const mongoose = require('mongoose');
const NFT = require('../../models/NFT');

describe('NFT Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it('create & save NFT successfully', async () => {
        const validNFT = new NFT({
            name: 'Test NFT',
            description: 'This is a test NFT',
            image: 'https://example.com/image.jpg',
            tokenId: '123456',
            owner: mongoose.Types.ObjectId()
        });
        const savedNFT = await validNFT.save();
        expect(savedNFT._id).toBeDefined();
        expect(savedNFT.name).toBe(validNFT.name);
        expect(savedNFT.tokenId).toBe(validNFT.tokenId);
    });

    it('create NFT with invalid image URL fails', async () => {
        const nftWithInvalidImage = new NFT({
            name: 'Invalid NFT',
            description: 'This NFT has an invalid image URL',
            image: 'not-a-url',
            tokenId: '789012',
            owner: mongoose.Types.ObjectId()
        });
        let err;
        try {
            await nftWithInvalidImage.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});
