import Wallet from "../../../controllers/WalletController.js";
import Utils from "../../../utils/DefaultUtils.js";

var utils = new Utils();

export default async function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('tokenize-last-block', req.body).status) {
            res.json(utils.bodyValidation('tokenize-last-block', req.body));
            return;
        }

        var { tokenize } = req.query;
        var { network, schema } = req.body;

        var provider = new Wallet(network, schema);
        var wallet = await provider.GetTokenLastBlock(tokenize);
        return res.json({
            status: true,
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