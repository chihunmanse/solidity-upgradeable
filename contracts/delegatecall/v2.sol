//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ImplementationV2 {
    address public owner;
    address public implementation;

    mapping(address => uint256) public counts;

    function count() external {
        counts[msg.sender] += 2;
    }
}
