//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract DelegateProxy {
    address public owner;
    address public implementation;

    constructor(address _implementation) {
        owner = msg.sender;
        implementation = _implementation;
    }

    mapping(address => uint256) public counts;
    address public second;

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

    function test(address _second) external {
        (bool success, ) = implementation.delegatecall(
            abi.encodeWithSignature("test(address)", _second)
        );

        require(success, "failed");
    }
}
