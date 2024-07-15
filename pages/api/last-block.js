import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default async function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('last-block', req.body).status) {
            res.json(utils.bodyValidation('last-block', req.body));
            return;
        }

        var { network, schema } = req.body;
        var provider = new Wallet(network, schema);
        var wallet = await provider.lastBlock();

        return res.json({
            status: true,
            message: "Last transactions from block",
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