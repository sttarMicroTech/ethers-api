import { ethers } from "ethers";

// Configure seu provedor
const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");

// Função para obter as transferências do último bloco para um contrato de token específico
async function getLastBlockTransfers(tokenContractAddress) {
    // Obter o número do último bloco
    const latestBlock = await provider.getBlockNumber();

    // Configurar o filtro para os eventos de Transferência do token
    const transferEventSignature = ethers.id("Transfer(address,address,uint256)");
    const filter = {
        address: tokenContractAddress,
        fromBlock: latestBlock,
        toBlock: latestBlock,
        topics: [transferEventSignature]
    };

    // Obter os logs dos eventos
    const logs = await provider.getLogs(filter);

    // Decodificar os logs
    const iface = new ethers.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 value)"
    ]);

    const transfers = logs.map(log => iface.parseLog(log));

    return transfers;
}

// Uso de exemplo
const tokenContractAddress = "0x42C1258E79a68769B3367138c8A9EA59FDaa2854";

setInterval(() => {
    getLastBlockTransfers(tokenContractAddress).then(transfers => {
        transfers.forEach(transfer => {
            console.log(`From: ${transfer.args.from}`);
            console.log(`To: ${transfer.args.to}`);
            console.log(`Value: ${transfer.args.value.toString()}`);
            console.log('---');
        });
    }).catch(error => {
        console.error("Erro ao obter transferências:", error);
    });
}, 3000)