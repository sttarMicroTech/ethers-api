import { ethers } from "ethers";

const tokenBalanceCheckerABI = [
    "function getTokenBalance(address walletAddress, address tokenContractAddress) view returns (uint256)",
    "function getTokenDetails(address tokenContractAddress) view returns (string memory, string memory, uint8, uint256)"
];

const erc20ABI = [
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function transfer(address to, uint256 value) returns (bool)"
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
            var balance = await this.tokenBalanceCheckerContract.getTokenBalance(walletAddress, tokenContractAddress);
            var token = await this.getTokenDetails(tokenContractAddress);
            // console.log(`Saldo do token: ${balance.toString()}`);
            balance = ethers.formatUnits(balance, parseInt(token.decimals) ?? 18);

            return {
                status: true,
                balance: balance,
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
            decimals = BigInt(decimals).toString();

            console.log({
                name, symbol, decimals, totalSupply
            })

            return {
                status: true,
                name: name,
                symbol: symbol,
                totalSupply: totalSupply,
                decimals: decimals
            };
        } catch (error) {
            return {
                status: false,
                message: error.message
            }
        }
    }

    async getTokenTransfers(walletAddress) {
        try {

            const startBlock = 0; // Bloco inicial (0 para o bloco gênesis)
            const endBlock = await this.wallet.getBlockNumber(); // Bloco mais recente
            const blockStep = 50000; // Tamanho do intervalo de blocos

            const transfersFrom = [];
            const transfersTo = [];

            for (let fromBlock = startBlock; fromBlock <= endBlock; fromBlock += blockStep) {
                const toBlock = Math.min(fromBlock + blockStep - 1, endBlock);

                // Defina o filtro para os eventos de transferência envolvendo o walletAddress
                const filterFrom = this.tokenContract.filters.Transfer(walletAddress, null);
                const filterTo = this.tokenContract.filters.Transfer(null, walletAddress);

                // Obtenha os logs dos eventos em intervalos menores
                const logsFrom = await this.wallet.getLogs({
                    fromBlock,
                    toBlock,
                    ...filterFrom
                });

                const logsTo = await this.wallet.getLogs({
                    fromBlock,
                    toBlock,
                    ...filterTo
                });

                // Parse os logs para obter as transferências
                transfersFrom.push(...logsFrom.map(log => this.tokenContract.interface.parseLog(log)));
                transfersTo.push(...logsTo.map(log => this.tokenContract.interface.parseLog(log)));
            }


            return {
                status: true,
                transfers: {
                    sended: transfersFrom,
                    recived: transfersTo
                }
            }
            // console.log(`Transferências de ${walletAddress}:`, transfersFrom);
            // console.log(`Transferências para ${walletAddress}:`, transfersTo);
        } catch (error) {
            // console.error(`Erro ao obter transferências do token: ${error}`);
            return {
                status: false,
                message: error.message,
                transfers: {
                    sended: null,
                    recived: null
                }
            }
        }
    }

    async sendToken(toAddress, value, privateKey, tokenContractAddress) {
        try {
            var tokenContract = new ethers.Contract(tokenContractAddress, erc20ABI, this.wallet);

            var details = await this.getTokenDetails(tokenContractAddress);

            // value = ethers.parseEther(value).toString();
            value = ethers.parseUnits(value, details.decimals).toString();
            // Crie um wallet a partir da chave privada
            const wallet = new ethers.Wallet(privateKey, this.wallet);

            // Conecte o contrato do token com a wallet
            const tokenWithSigner = tokenContract.connect(wallet);

            // Envie a transação
            const tx = await tokenWithSigner.transfer(toAddress, value);
            // console.log(`Transação enviada: ${tx.hash}`);

            // Espere a transação ser confirmada
            const receipt = await tx.wait();

            if (receipt.status === 1) {
                // console.log(`Transação completada com sucesso: ${tx.hash}`);
                return { hash: tx.hash, status: "success", transaction: tx, receipt: receipt };
            } else {
                // console.log(`Transação falhou: ${tx.hash}`);
                return { hash: tx.hash, status: "error", transaction: tx, receipt: receipt };
            }
        } catch (error) {
            // console.error(`Erro ao enviar o token: ${error}`);
            return { status: "error", error: error.message };
        }
    }
}

export default WalletUtils;