//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

interface IVersion1 {
    function counts(address) external view returns (uint256);
}

contract Version2 {
    address public owner;
    IVersion1 public version1;
    bool public contractActive;

    constructor(IVersion1 _version1) {
        owner = msg.sender;
        version1 = _version1;
        contractActive = true;
    }

    mapping(address => uint256) public counts;
    mapping(address => bool) private v1Counts;

    modifier whenContractActive() {
        require(contractActive, "contract unActive");
        _;
    }

    function count() external whenContractActive {
        if (!v1Counts[msg.sender]) {
            v1Counts[msg.sender] = true;
            uint256 v1Count = version1.counts(msg.sender);
            counts[msg.sender] += v1Count;
        }
        counts[msg.sender] += 2;
    }

    function setContractActive(bool _contractActive) external {
        require(msg.sender == owner, "only owner");
        contractActive = _contractActive;
    }
}
