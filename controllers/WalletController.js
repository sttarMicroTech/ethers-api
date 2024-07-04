import { ethers } from "ethers";
import { providers } from "../providers/ServiceProviders";

class Wallet {
    /**
     * Construtor de serviços do sistema 
     * de carteiras seguras da rede
     * @param {string} network - Nome da rede que deseja utilizar [Binance, Arbitrium, Poligon...]
     * @param {string} schema - [testnet ou mainet]
     */
    constructor(network, schema = 'testnet'){
        var provider = providers[network];
        console.log(provider[schema]);
        this.wallet = new ethers.JsonRpcProvider(provider[schema]);
    }

    /**
     * Cria uma nova carteira dentro
     * da blockchain selecionada pelo provedor
     * @returns {Object}
     */
    createWallet() {
        return ethers.Wallet.createRandom(this.wallet);
    }
    
    /**
     * 
     * @param {string} pkOrMnemonic - Chave privada ou Mnemonica
     * @returns {Object} 
     */
    recoverWallet(pkOrMnemonic) {
        var myWallet = pkOrMnemonic.indexOf(" ") !== -1
            ? ethers.Wallet.fromPhrase(pkOrMnemonic, this.wallet)
            : new ethers.Wallet(pkOrMnemonic, this.wallet);
    
        return myWallet;
    }
    
    /**
     * Obtem o saldo a partir do endereço da
     * carteira dentro do provedor
     * @param {string} address - Endereço da carteira
     * @returns {Object}
     */
    async getBalance(address) {
        const balance = await this.wallet.getBalance(address);
        return {
            balanceInWei: balance,
            balanceInEth: ethers.formatEther(balance)
        }
    }
    
    /**
     * Verifica se uma carteira
     * é valida ou não
     * @param {string} address - endereço da carteira
     * @returns {Object}
     */
    addressIsValid(address) {
        return ethers.isAddress(address);
    }
    
    /**
     * Construtor de trasações entre carteiras 
     * da mesma rede do provedor.
     * @param {string} toWallet - endereço da carteira de envio
     * @param {float} amountInEth - quantidade a ser enviado  
     * @returns {Object}
     */
    async buildTransaction(toWallet, amountInEth) {
        const amount = ethers.parseEther(amountInEth);
    
        const tx = {
            to: toWallet,
            value: amount
        }
    
        const feeData = await provider.getFeeData();
        const txFee = 21000n * feeData.gasPrice;//default gas limit para transferências
    
        const balance = await provider.getBalance(myWallet.address);
        if (balance < (amount + txFee)) {
            return false;
        }
    
        return tx;
    }
    
    /**
     * Envia uma transação para outra 
     * carteira da mesma rede selecionada
     * @param {string} tx - Transação contruida pelo metodo buildTransaction()
     * @returns {Object}
     */
    sendTransaction(tx, pk) {
        var myWallet = this.recoverWallet(pk);
        return myWallet.sendTransaction(tx);
    }
    
    /**
     * Gera o comprovante de transação
     * @param {string} hash - ID ou Hash da transação
     * @returns {Object}
     */
    async getTransaction(hash) {
        return await this.wallet.getTransaction(hash);
    }
}

export default Wallet;