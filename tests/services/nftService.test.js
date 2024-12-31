const NFTService = require('../../services/nftService');
const NFT = require('../../models/NFT');
const ipfsService = require('../../services/ipfsService');

jest.mock('../../models/NFT');
jest.mock('../../services/ipfsService');

describe('NFTService', () => {
    let nftService;

    beforeEach(() => {
        nftService = new NFTService();
    });

    it('should create NFT successfully', async () => {
        const mockNFT = {
            save: jest.fn().mockResolvedValue({ _id: '123', name: 'Test NFT' })
        };
        NFT.mockImplementation(() => mockNFT);
        ipfsService.uploadToIPFS.mockResolvedValue('Qm123');

        const result = await nftService.createNFT('Test NFT', 'Description', 'https://example.com/image.jpg', '123', '456');

        expect(result._id).toBe('123');
        expect(result.name).toBe('Test NFT');
        expect(ipfsService.uploadToIPFS).toHaveBeenCalled();
    });

    it('should throw error for invalid input', async () => {
        await expect(nftService.createNFT('', '', 'not-a-url', '123', '456')).rejects.toThrow('Invalid input data');
    });
});
