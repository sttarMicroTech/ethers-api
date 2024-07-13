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
        var { network, schema } = req.body;
        console.log({
            network, 
            schema,
            tokenize
        })
        var provider = new Wallet(network, schema);
        var wallet = await provider.GetTokenDetails(tokenize);
        return res.json({
            status: wallet.status,
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