
export const providers = {
    "Binance": {
        "token": "BNB",
        "network": {
            "name": "Binance Smart Chain",
            "symbol": "BSC",
            "icon": "/img/coins/bsc.png"
        },
        "providers": {
            "mainet": "https://bsc-rpc.publicnode.com",
            "testnet": "https://bsc-testnet-rpc.publicnode.com",
            // "testnet": "https://data-seed-prebsc-1-s1.binance.org:8545"
        },
        "suportedTokens": [
            {
                "name": "Binance Smart Token",
                "symbol": "BNB",
                "default": true,
                "contract": {
                    "mainet": null,
                    "testnet": null
                }
            },
            {
                "name": "USD Tether",
                "symbol": "USDT",
                "default": false,
                "contract": {
                    "mainet": null,
                    "testnet": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
                }
            },
            {
                "name": "SttarPay Token",
                "symbol": "SPT",
                "default": false,
                "contract": {
                    "mainet": null,
                    "testnet": "0x42C1258E79a68769B3367138c8A9EA59FDaa2854"
                }
            }
        ]
    }
};
