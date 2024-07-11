import Wallet from "../controllers/WalletController.js";

var wallet = new Wallet('Binance', 'testnet');

(async () => {

    var balance = await wallet.getBalance('0xC1932CA23A90f025F5630EeE04b4B148CA47c177');

    console.log(balance);
})();
// new Wallet

// new GatewayConntract();