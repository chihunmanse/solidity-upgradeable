//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Version1 {
    bool public contractActive;

    constructor() {
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
}
