//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ERC1967ImplementationV3 {
    mapping(address => uint256) public counts;

    function count() external {
        counts[msg.sender] += 3;
    }

    function upgradeTo(address _target) external {
        counts[_target] += 3;
    }
}
