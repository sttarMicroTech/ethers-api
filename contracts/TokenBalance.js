import { ethers }  from "ethers";

// Definir o ABI do contrato
const abi = [
    // "function addTokenContract(address _tokenContract)",
    // "function getTokenContracts() view returns (address[])",
    // "function getBalances(address wallet) view returns (address[] memory, uint256[] memory)"
    "function getBalance(address wallet) view returns (string)"
];

// Endereço do contrato implantado na Ethereum
const contractAddress = "0x3B367B7de3dd378950e81a39816539aBe5b6129b";

async function main() {
    // Conectar ao provedor Ethereum
    const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");

    // Conectar à instância do contrato
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Endereço da carteira que você quer verificar
    const walletAddress = "0x4Ed889d527Da70DC669114779EF7278bef5072a2";

    try {
        var token = await contract.getBalance(walletAddress);
        console.log(token);
        // Obter a lista de contratos de tokens e seus saldos
        // const [tokens, balances] = await contract.getBalance(walletAddress);
        // console.log(tokens, balances);
        // // Formatar e exibir os resultados
        // tokens.forEach((token, index) => {
        //     console.log(`Token: ${token}, Balance: ${ethers.utils.formatUnits(balances[index], 18)}`);
        // });
    } catch (error) {
        console.error("Erro ao obter os saldos dos tokens:", error);
    }
}

main();
