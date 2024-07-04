export default function(req, res){
    return res.json({
        status: true,
        message: "API is runnig",
        endpoints: [
            {
                "name": "Create Wallet",
                "method": "POST",
                "path": "/api/create-wallet"
            },
            {
                "name": "Get Balance",
                "method": "POST",
                "path": "/api/get-balance"
            },
            {
                "name": "Recover Wallet",
                "method": "POST",
                "path": "/api/recover-wallet"
            },
            {
                "name": "Send Transaction",
                "method": "POST",
                "path": "/api/send-transaction"
            },
            {
                "name": "Valid Address",
                "method": "POST",
                "path": "/api/valid-address"
            },
        ]
    });
}