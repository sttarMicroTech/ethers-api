import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('valid-address', req.body).status) {
            res.json(utils.bodyValidation('valid-address', req.body));
            return;
        }

        var { network, schema, wallet } = req.body;
        var provider = new Wallet(network, schema);
        var wallet = provider.addressIsValid(wallet);

        return res.json({
            status: true,
            message: wallet ? 'Address is a valid address!' : 'Address is a invalid address!',
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