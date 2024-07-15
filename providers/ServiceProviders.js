
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
        "scans": {
            "testnet": "https://testnet.bscscan.com",
            "mainet": "https://bscscan.com"
        },
        "suportedTokens": [
            {
                "id": 1,
                "name": "Binance Smart Token",
                "symbol": "BNB",
                "default": true,
                "asset": "/img/coins/bsc.png",
                "contract": {
                    "mainet": null,
                    "testnet": null
                }
            },
            {
                "id": 2,
                "name": "USD Tether",
                "symbol": "USDT",
                "default": false,
                "asset": "/img/coins/usdt.png",
                "contract": {
                    "mainet": null,
                    "testnet": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
                }
            },
            {
                "id": 3,
                "name": "SttarPay Token",
                "symbol": "SPT",
                "default": false,
                "asset": "/img/coins/spt.png",
                "contract": {
                    "mainet": null,
                    "testnet": "0x42C1258E79a68769B3367138c8A9EA59FDaa2854"
                }
            },
            {
                "id": 4,
                "name": "Pancake Swap Token",
                "symbol": "CAKE",
                "default": false,
                "asset": "/img/coins/cake.png",
                "contract": {
                    "mainet": null,
                    "testnet": "0x5b403E0f6686725171c2Baa7A0b7cD4253B0bc57"
                }
            },
            {
                "id": 5,
                "name": "Binance USD",
                "symbol": "BUSD",
                "default": false,
                "asset": "/img/coins/busd.png",
                "contract": {
                    "mainet": null,
                    "testnet": "0x2ebE70929bC7D930248040f54135dA12f458690C"
                }
            }
        ]
    }
};
