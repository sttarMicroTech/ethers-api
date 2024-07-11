import { ethers } from 'ethers';

const contractAddress = "0xEf80EBe7548efed4006BA6642e3002Cf0C5A5d7E";

class TxGatewayClient {
    constructor(Wallet) {
        this.provider = Wallet;
        this.contract = new ethers.Contract(contractAddress, [
            'function getWalletInfo(address walletAddress) view returns (address, uint256, uint256)',
            'function getTokenName(address tokenAddress) view returns (string)',
            'function getContractInteractions(address walletAddress) view returns (address[])'
        ], this.provider);
    }

    async getWalletInfo(walletAddress) {
        try {
            const info = await this.contract.getWalletInfo(walletAddress);
            return {
                walletAddress: info[0],
                balance: ethers.formatEther(info[1]), // Convert wei to ether
                blockNumber: info[2]
            };
        } catch (error) {
            console.error('Error getting wallet info:', error);
            return null;
        }
    }

    async getTokenName(tokenAddress) {
        try {
            const name = await this.contract.getTokenName(tokenAddress);
            return name;
        } catch (error) {
            console.error('Error getting token name:', error);
            return null;
        }
    }

    async getContractInteractions(walletAddress) {
        try {
            const contractAddresses = await this.contract.getContractInteractions(walletAddress);
            return contractAddresses;
        } catch (error) {
            console.error('Error getting contract interactions:', error);
            return [];
        }
    }
}

export default TxGatewayClient;