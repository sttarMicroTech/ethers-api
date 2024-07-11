// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TxGateway {
    mapping(address => bool) public contractInteractions;

    event ContractInteractionAdded(address indexed walletAddress, address indexed contractAddress);

    function getWalletInfo(address walletAddress) public view returns (address, uint256, uint256) {
        return (walletAddress, walletAddress.balance, block.number);
    }

    function getTokenName(address tokenAddress) public view returns (string memory) {
        (bool success, bytes memory data) = tokenAddress.staticcall(
            abi.encodeWithSignature("name()")
        );
        require(success, "Failed to get token name");
        return abi.decode(data, (string));
    }

    function addContractInteraction(address contractAddress) public {
        require(contractAddress != address(0), "Invalid contract address");
        require(msg.sender != contractAddress, "Cannot add own contract");

        contractInteractions[contractAddress] = true;
        emit ContractInteractionAdded(msg.sender, contractAddress);
    }

    function getContractInteractions(address walletAddress) public view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < block.number; i++) {
            address currentAddress = address(bytes20(keccak256(abi.encodePacked(walletAddress, i))));
            if (contractInteractions[currentAddress]) {
                count++;
            }
        }

        address[] memory result = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < block.number; i++) {
            address currentAddress = address(bytes20(keccak256(abi.encodePacked(walletAddress, i))));
            if (contractInteractions[currentAddress]) {
                result[index] = currentAddress;
                index++;
            }
        }

        return result;
    }
}
