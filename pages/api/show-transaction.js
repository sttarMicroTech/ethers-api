import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('valid-address', req.body).status) {
            res.json(utils.bodyValidation('valid-address', req.body));
            return;
        }

        var { network, schema, hash } = req.body;
        var provider = new Wallet(network, schema);
        var wallet = provider.getTransaction(hash);

        return res.json({
            status: true,
            message: wallet ? 'Transaction get with success' : 'No transaction for this hash',
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