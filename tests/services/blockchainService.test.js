const BlockchainService = require('../../services/blockchainService');
const Web3 = require('web3');

jest.mock('web3');

describe('BlockchainService', () => {
    let blockchainService;

    beforeEach(() => {
        blockchainService = new BlockchainService();
    });

    it('should initialize Web3 correctly', () => {
        expect(blockchainService.web3).toBeInstanceOf(Web3);
    });

    it('should send transaction correctly', async () => {
        const mockSendSignedTransaction = jest.fn().mockResolvedValue({ transactionHash: '0x123' });
        blockchainService.web3.eth.accounts.signTransaction = jest.fn().mockResolvedValue({ rawTransaction: '0xabc' });
        blockchainService.web3.eth.sendSignedTransaction = mockSendSignedTransaction;

        const result = await blockchainService.sendTransaction('0x456', 1);

        expect(result.transactionHash).toBe('0x123');
        expect(mockSendSignedTransaction).toHaveBeenCalledWith('0xabc');
    });
});
