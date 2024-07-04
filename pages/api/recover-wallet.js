import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default function (req, res) {
    if (req.method == 'POST') {
        if(!utils.bodyValidation('recover-wallet', req.body).status){
            res.json(utils.bodyValidation('recover-wallet', req.body));
            return;
        }

        var { network, schema, pk } = req.body;
        var provider = new Wallet(network, schema);
        var wallet = provider.recoverWallet(pk);
        return res.json({
            status: true,
            message: 'Recover wallet with success!',
            result: wallet
        });
    } else {
        return res.json({
            status: true,
            message: 'Only POST method is allowed',
            result: null
        });
    }
}