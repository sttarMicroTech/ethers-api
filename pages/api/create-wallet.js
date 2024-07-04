import Wallet from "../../controllers/WalletController.js";

export default function(req, res){
    if(req.method == 'POST'){
        console.log(req.body);
        var { network, schema} = req.body;
        var provider = new Wallet(network, schema);
        var wallet = provider.createWallet();
        return res.json({
            status: true,
            message: 'Create wallet with success!',
            result: wallet
        })
    } else {
        return res.json({
            status: true,
            message: 'Only POST method is allowed',
            result: null
        })
    }
}