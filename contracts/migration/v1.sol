//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Version1 {
    address public owner;
    bool public contractActive;

    constructor() {
        owner = msg.sender;
        contractActive = true;
    }

    mapping(address => uint256) public counts;

    modifier whenContractActive() {
        require(contractActive, "contract unActive");
        _;
    }

    function count() external whenContractActive {
        counts[msg.sender] += 1;
    }

    function setContractActive(bool _contractActive) external {
        require(msg.sender == owner, "only owner");
        contractActive = _contractActive;
    }
}
