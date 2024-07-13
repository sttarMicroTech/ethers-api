import { ethers } from "ethers";

const tokenBalanceCheckerABI = [
    "function getTokenBalance(address walletAddress, address tokenContractAddress) view returns (uint256)",
    "function getTokenDetails(address tokenContractAddress) view returns (string memory, string memory, uint8, uint256)"
];

/**
 * contract V1: 0x024053B2c63d5f883d19806D809Ad2457D626416
 * contract V2: 0x148863b80D348e0740a6411D386635193Fea07Ff
 */

class WalletUtils {
    constructor(Wallet) {
        this.wallet = Wallet;
        this.tokenBalanceCheckerContract = new ethers.Contract("0x148863b80D348e0740a6411D386635193Fea07Ff", tokenBalanceCheckerABI, this.wallet);

    }

    async getTokenBalance(walletAddress, tokenContractAddress) {
        try {
            // Chame a função getTokenBalance do contrato
            const balance = await this.tokenBalanceCheckerContract.getTokenBalance(walletAddress, tokenContractAddress);
            var token = await this.getTokenDetails(tokenContractAddress);
            // console.log(`Saldo do token: ${balance.toString()}`);
            return {
                status: true,
                balance: balance.toString(),
                token: token
            }
        } catch (error) {
            return {
                status: false,
                balance: null
            }
        }
    }

    async getTokenDetails(tokenContractAddress) {
        try {
            // Chame a função getTokenDetails do contrato
            var [name, symbol, decimals, totalSupply] = await this.tokenBalanceCheckerContract.getTokenDetails(tokenContractAddress);
            totalSupply = BigInt(totalSupply).toString();

            return {
                status: true,
                name: name,
                symbol: symbol,
                totalSupply: totalSupply
            };
        } catch (error) {
            return {
                status: false,
                message: error.message
            }
        }
    }
}

export default WalletUtils;