import Wallet from "../../../controllers/WalletController.js";
import Utils from "../../../utils/DefaultUtils.js";

var utils = new Utils();

export default async function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('create-wallet', req.body).status) {
            res.json(utils.bodyValidation('create-wallet', req.body));
            return;
        }

        var { tokenize } = req.query;
        var { network, schema, wallet } = req.body;

        var provider = new Wallet(network, schema);
        var wallet = await provider.GetTokenBalance(tokenize, wallet);
        return res.json({
            status: wallet.status,
            result: wallet
        });
    } else {
        return res.json({
            status: false,
            message: 'Only POST method is allowed',
            result: null
        });
    }
}