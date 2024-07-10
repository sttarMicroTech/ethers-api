import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default async function (req, res) {
    if (req.method == 'POST') {
        if(!utils.bodyValidation('get-balance', req.body).status){
            res.json(utils.bodyValidation('get-balance', req.body));
            return;
        }

        var { network, schema, wallet } = req.body;
        var provider = new Wallet(network, schema);
        var balance = await provider.getBalance(wallet);
        return res.json({
            status: true,
            message: 'Get balance with success!',
            result: balance
        })
    } else {
        return res.json({
            status: true,
            message: 'Only POST method is allowed',
            result: null
        })
    }
}