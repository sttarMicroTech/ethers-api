import Wallet from "../controllers/WalletController.js";

var wallet = new Wallet('Binance', 'testnet');

(async () => {

    setInterval(async () => {
        var transaction = await wallet.GetTokenLastBlock('0x42C1258E79a68769B3367138c8A9EA59FDaa2854');
        console.log(transaction);
    }, 3000);
})();
// new Wallet

// new GatewayConntract();