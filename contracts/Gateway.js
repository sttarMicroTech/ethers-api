
import { ethers } from "ethers";
import Wallet from "../controllers/WalletController.js";


// ABI do contrato
const abi = [
    "function createWallet() external",
    "function checkWallet(address walletAddress) external view returns (address, uint256, uint256[])",
    "function balanceWallet(address walletAddress) external view returns (uint256)",
    "function recordTransaction(address to, uint256 amount) external",
    "function transactionHistory(address walletAddress) external view returns (uint256[])",
    "function getTransactionValue(uint256 transactionId) external view returns (uint256)"
];

// Cotrato do gateway
const contractAddress = "0x156bc1d94e3cD324575E8a0248D21732a65F3b49";


class GatewayConntract {
    /**
     * Construdor do gateway de comunicação
     * com a blockchain
     * @param {Wallet()} Wallet - Carteira construida pelo provedor
     */
    constructor(Wallet){
        this.provider = Wallet;
        this.contract = new ethers.Contract(contractAddress, abi, Wallet);
    }

    /**
     * Cria uma nova carteira dentro da rede do cotrato.
     * @returns {Object} 
     */
    async CreateWallet(){
        const createWalletTx = await this.contract.createWallet();
        return await createWalletTx.wait();
    }

    async GetWalletData(address){
        return await this.contract.checkWallet(address);
    }
}

export default GatewayConntract;