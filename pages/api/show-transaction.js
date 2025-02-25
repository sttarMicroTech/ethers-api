import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default async function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('show-transaction', req.body).status) {
            res.json(utils.bodyValidation('show-transaction', req.body));
            return;
        }

        var { network, schema, hash } = req.body;
        var provider = new Wallet(network, schema);
        var wallet = await provider.getTransaction(hash);

        return res.json({
            status: true,
            message: wallet ? 'Transaction get with success' : 'No transaction for this hash',
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