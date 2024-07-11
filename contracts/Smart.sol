// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract PaymentGateway {
    struct Wallet {
        address owner;
        uint256 balance;
        uint256[] transactions;
        mapping(address => bool) hasToken;
    }

    mapping(address => Wallet) private wallets;
    mapping(uint256 => uint256) private transactionValues;
    uint256 private transactionCounter;
    address[] private tokenContracts;

    event WalletCreated(address indexed owner);
    event BalanceUpdated(address indexed owner, uint256 newBalance);
    event TransactionRecorded(address indexed from, address indexed to, uint256 amount);
    event TokenAdded(address indexed tokenContract);

    // Função para criar uma nova "carteira"
    function createWallet() external {
        require(wallets[msg.sender].owner == address(0), "Wallet already exists");
        Wallet storage newWallet = wallets[msg.sender];
        newWallet.owner = msg.sender;
        newWallet.balance = 0;
        emit WalletCreated(msg.sender);
    }

    // Função para checar as informações de uma "carteira"
    function checkWallet(address walletAddress) external view returns (address owner, uint256 balance, uint256[] memory transactions) {
        Wallet storage wallet = wallets[walletAddress];
        require(wallet.owner != address(0), "Wallet does not exist");
        return (wallet.owner, wallet.balance, wallet.transactions);
    }

    // Função para obter o balanço de uma "carteira"
    function balanceWallet(address walletAddress) external view returns (uint256) {
        Wallet storage wallet = wallets[walletAddress];
        require(wallet.owner != address(0), "Wallet does not exist");
        return wallet.balance;
    }

    // Função para registrar uma transação
    function recordTransaction(address to, uint256 amount) external {
        Wallet storage fromWallet = wallets[msg.sender];
        Wallet storage toWallet = wallets[to];
        
        require(fromWallet.owner != address(0), "Sender wallet does not exist");
        require(toWallet.owner != address(0), "Recipient wallet does not exist");
        require(fromWallet.balance >= amount, "Insufficient balance");

        fromWallet.balance -= amount;
        toWallet.balance += amount;

        transactionCounter++;
        fromWallet.transactions.push(transactionCounter);
        toWallet.transactions.push(transactionCounter);
        transactionValues[transactionCounter] = amount;

        emit BalanceUpdated(msg.sender, fromWallet.balance);
        emit BalanceUpdated(to, toWallet.balance);
        emit TransactionRecorded(msg.sender, to, amount);
    }

    // Função para obter o histórico de transações de uma "carteira"
    function transactionHistory(address walletAddress) external view returns (uint256[] memory) {
        Wallet storage wallet = wallets[walletAddress];
        require(wallet.owner != address(0), "Wallet does not exist");
        return wallet.transactions;
    }

    // Função para obter o valor de uma transação
    function getTransactionValue(uint256 transactionId) external view returns (uint256) {
        return transactionValues[transactionId];
    }

    // Função para adicionar um novo contrato de token à lista
    function addTokenContract(address tokenContract) external {
        require(!wallets[msg.sender].hasToken[tokenContract], "Token contract already added");
        tokenContracts.push(tokenContract);
        wallets[msg.sender].hasToken[tokenContract] = true;
        emit TokenAdded(tokenContract);
    }

    // Função para obter a lista de tokens e seus balanços de uma carteira
    function getTokenBalances(address walletAddress) external view returns (address[] memory, uint256[] memory) {
        uint256 tokenCount = tokenContracts.length;
        uint256[] memory balances = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            balances[i] = IERC20(tokenContracts[i]).balanceOf(walletAddress);
        }
        return (tokenContracts, balances);
    }
}
