// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SttarPayToken is ERC20 {
    address[] private wallets;
    mapping(address => bool) private isWallet;
    mapping(address => uint256) private balance;
    mapping(address => mapping(uint256 => WTransfer)) private transfers;

    struct WTransfer {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    event WalletCreated(address indexed wallet, uint256 timestamp);
    event TransferHistory(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    constructor() ERC20("SttarPay Token", "SPT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function createWallet() external {
        address wallet = address(uint160(uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)))));
        wallets.push(wallet);
        isWallet[wallet] = true;
        emit WalletCreated(wallet, block.timestamp);
    }

    function getWallets() external view returns (address[] memory) {
        return wallets;
    }

    function getBalance(address wallet) external view returns (uint256) {
        return balance[wallet];
    }

    function transferTo(address to, uint256 amount) external {
        require(balance[msg.sender] >= amount, "Insufficient balance");
        
        _transfer(msg.sender, to, amount);
        balance[msg.sender] -= amount;
        balance[to] += amount;

        transfers[msg.sender][block.timestamp] = WTransfer(msg.sender, to, amount, block.timestamp);
        emit TransferHistory(msg.sender, to, amount, block.timestamp);
    }

    function getTransferHistory(address wallet, uint256 timestamp) external view returns (address from, address to, uint256 amount, uint256 time) {
        WTransfer memory transfer = transfers[wallet][timestamp];
        return (transfer.from, transfer.to, transfer.amount, transfer.timestamp);
    }
}
