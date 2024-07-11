import { ethers } from "ethers";
import { providers } from "../providers/ServiceProviders.js";
// import GatewayConntract from "../contracts/Gateway.js";
import TxGatewayClient from "../contracts/TxGateway.js";

class Wallet {
    /**
     * Construtor de serviços do sistema 
     * de carteiras seguras da rede
     * @param {string} network - Nome da rede que deseja utilizar [Binance, Arbitrium, Poligon...]
     * @param {string} schema - [testnet ou mainet]
     */
    constructor(network, schema = 'testnet') {
        var provider = providers[network];
        this.wallet = new ethers.JsonRpcProvider(provider.providers[schema]);
        this.GatewayConntract = new TxGatewayClient(this.wallet);
        this.provider = provider;
    }

    /**
     * Cria uma nova carteira dentro
     * da blockchain selecionada pelo provedor
     * @returns {{provider: object, address: string, publicKey: string, fingerprint: string, parentFingerprint: string, mnemonic: {phrase: string, password: string, wordlist: {locale: string}, entropy: string }, chainCode: string, path: string, index: number, depth: number, pk: string}}
     */
    createWallet() {
        var createdWallet = ethers.Wallet.createRandom(this.wallet);
        createdWallet.pk = createdWallet.privateKey;
        return createdWallet;
    }

    /**
     * 
     * @param {string} pkOrMnemonic - Chave privada ou Mnemonica
     * @returns {{provider: object, address: string}} 
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
     * @returns {{balance: string, wallet: string, tokens: object}}
     */
    async getBalance(address) {

        const balance = await this.wallet.getBalance(address);
        var data = await this.GatewayConntract.getWalletInfo(address);
        // var conntracts = await this.GatewayConntract.getContractInteractions(address);
        // var data = await this.GatewayConntract.GetWalletData(address);
        // console.log(data);
        // const tokens = await this.getTokenBalance(address, 18);
        // const smartContracts = await this.getTokenContracts(address);


        return [
            {
                balance: ethers.formatEther(balance),
                provider: this.provider,
                data
            }
        ]
    }

    /**
     * Retora o saldo dos tokens disponiveis na 
     * carteira do provedor connstruido
     * @param {string} tokenAddress 
     * @param {int} decimals 
     * @returns {Oject}
     */
    async getTokenBalance(tokenAddress, decimals) {
        const tokenContract = new ethers.Contract(
            tokenAddress,
            [
                'function balanceOf(address owner) view returns (uint256)',
            ],
            this.wallet
        );
        const balance = await tokenContract.balanceOf(tokenAddress);
        return ethers.utils.formatUnits(balance, decimals);
    };


    /**
     * Lista de contratos da carteira
     * @param {string} walletAddress 
     * @returns {Object}
     */
    async getTokenContracts(walletAddress) {
        // ethers.zeroPadValue
        // Filtro para eventos de transferência ERC20 para a carteira específica
        const filter = {
            address: walletAddress, // null significa qualquer endereço de contrato
            topics: [
                ethers.id("Transfer(address,address,uint256)"), // Identificador do evento de transferência
                null,
                null// Filtra por destinatário
            ]
        };

        // Recupera logs de eventos
        const logs = await this.wallet.getLogs(filter);

        // Extrai e retorna os endereços dos contratos
        const tokenContracts = [...new Set(logs.map(log => log.address))];
        return {
            filter, tokenContracts
        };
    }

    /**
     * Verifica se uma carteira
     * é valida ou não
     * @param {string} address - endereço da carteira
     * @returns {boolean}
     */
    addressIsValid(address) {
        return ethers.isAddress(address);
    }

    /**
     * Construtor de trasações entre carteiras 
     * da mesma rede do provedor.
     * @param {string} toWallet - endereço da carteira de envio
     * @param {string} amountInEth - quantidade a ser enviado  
     * @param {string} pk - chave de assinatura privada
     * @returns {Promise<{to: string, value: bigint}>}
     */
    async buildTransaction(toWallet, amountInEth, pk) {
        const amount = ethers.parseEther(amountInEth);

        const tx = {
            to: toWallet,
            value: amount
        }

        const feeData = await this.wallet.getFeeData();
        const txFee = 21000n * feeData.gasPrice;//default gas limit para transferências
        var myWallet = this.recoverWallet(pk);
        const balance = await this.wallet.getBalance(myWallet.address);
        if (balance < (amount + txFee)) {
            return false;
        }

        return tx;
    }

    /**
     * Envia uma transação para outra 
     * carteira da mesma rede selecionada
     * @param {any} tx - Transação contruida pelo metodo buildTransaction()
     * @param {string} pk - Chave privada para assinar a trasação
     * @returns {Object}
     */
    async sendTransaction(tx, pk) {
        var myWallet = this.recoverWallet(pk);
        return await myWallet.sendTransaction(tx);
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