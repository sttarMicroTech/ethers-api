import Wallet from "../../controllers/WalletController.js";
import Utils from "../../utils/DefaultUtils.js";

var utils = new Utils();

export default async function (req, res) {
    if (req.method == 'POST') {
        if (!utils.bodyValidation('send-transaction', req.body).status) {
            res.json(utils.bodyValidation('send-transaction', req.body));
            return;
        }

        var { network, schema, to, value, pk } = req.body;
        var provider = new Wallet(network, schema);
        var builded = await provider.buildTransaction(to, value, pk);

        if(!builded){
            return res.json({
                status: false,
                message: 'Innsuficient balance for this operation!',
                result: null
            });
        } 

        var sended = await provider.sendTransaction(builded, pk);

        return res.json({
            status: true,
            message: 'Transaction send with success',
            result: sended
        });
    } else {
        return res.json({
            status: true,
            message: 'Only POST method is allowed',
            result: null
        });
    }
}