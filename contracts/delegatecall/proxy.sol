//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Proxy {
    address public owner;
    address public implementation;

    constructor(address _implementation) {
        owner = msg.sender;
        implementation = _implementation;
    }

    mapping(address => uint256) public counts;

    function count() external {
        (bool success, ) = implementation.delegatecall(
            abi.encodeWithSignature("count()")
        );

        require(success, "failed");
    }

    function setImplementation(address _implementation) external {
        require(msg.sender == owner, "only owner");
        implementation = _implementation;
    }
}
