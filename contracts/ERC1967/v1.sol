//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ERC1967ImplementationV1 {
    mapping(address => uint256) public counts;

    function count() external {
        counts[msg.sender] += 1;
    }
}
