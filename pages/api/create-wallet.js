import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('create-wallet', req.body).status) {
            res.json(utils.bodyValidation('create-wallet', req.body));
            return;
        }

        var { network, schema } = req.body;
        var provider = new Wallet(network, schema);
        var wallet = provider.createWallet();
        return res.json({
            status: true,
            message: 'Create wallet with success!',
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