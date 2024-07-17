// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract WalletUtils {
    using Strings for uint256;

    event TransactionLogged(
        address indexed from,
        address indexed to,
        address indexed tokenContract,
        uint256 value,
        uint256 timestamp
    );

    function getTokenBalance(
        address walletAddress,
        address tokenContractAddress
    ) public view returns (uint256) {
        (bool success, bytes memory data) = tokenContractAddress.staticcall(
            abi.encodeWithSignature("balanceOf(address)", walletAddress)
        );
        require(success, "Token balance query failed");

        return abi.decode(data, (uint256));
    }

    function getTokenDetails(
        address tokenContractAddress
    )
        public
        view
        returns (
            string memory name,
            string memory symbol,
            uint8 decimals,
            string memory totalSupply
        )
    {
        name = _callStringFunction(tokenContractAddress, "name()");
        symbol = _callStringFunction(tokenContractAddress, "symbol()");
        decimals = _callUint8Function(tokenContractAddress, "decimals()");
        uint256 totalSupplyUint = _callUint256Function(
            tokenContractAddress,
            "totalSupply()"
        );
        totalSupply = totalSupplyUint.toString();
    }

    function _callStringFunction(
        address contractAddress,
        string memory functionSignature
    ) internal view returns (string memory) {
        (bool success, bytes memory data) = contractAddress.staticcall(
            abi.encodeWithSignature(functionSignature)
        );
        require(success, "Function call failed");
        return abi.decode(data, (string));
    }

    function _callUint8Function(
        address contractAddress,
        string memory functionSignature
    ) internal view returns (uint8) {
        (bool success, bytes memory data) = contractAddress.staticcall(
            abi.encodeWithSignature(functionSignature)
        );
        require(success, "Function call failed");
        return abi.decode(data, (uint8));
    }

    function _callUint256Function(
        address contractAddress,
        string memory functionSignature
    ) internal view returns (uint256) {
        (bool success, bytes memory data) = contractAddress.staticcall(
            abi.encodeWithSignature(functionSignature)
        );
        require(success, "Function call failed");
        return abi.decode(data, (uint256));
    }

    function logTransaction(
        address from,
        address to,
        address tokenContract,
        uint256 value
    ) public {
        emit TransactionLogged(from, to, tokenContract, value, block.timestamp);
    }

    
}
