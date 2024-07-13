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
        var { network, schema, pk, to, value} = req.body;

        var provider = new Wallet(network, schema);
        var { address } = provider.recoverWallet(pk);

        var wallet = await provider.SendToken(to, value, pk, tokenize);
        return res.json({
            status: wallet.status,
            result: wallet,
            address: address
        });
    } else {
        return res.json({
            status: false,
            message: 'Only POST method is allowed',
            result: null,
            address: null
        });
    }
}