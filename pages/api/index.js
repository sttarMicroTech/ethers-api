export default function(req, res){
    return res.json({
        status: true,
        message: "API is runnig",
        endpoints: [
            {
                "name": "Create Wallet",
                "method": "POST",
                "path": "/api/create-wallet"
            }
        ]
    });
}