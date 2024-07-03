import { createWallet } from "../../controllers/WalletController.js";

export default function(req, res){
    if(req.method == 'POST'){
        var wallet = createWallet();
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