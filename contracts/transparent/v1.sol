//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TransparentImplementationV1 {
    mapping(uint256 => bool) initializes;
    mapping(address => uint256) public counts;

    function initialize(uint256 _count) external virtual {
        uint256 version = 1;
        require(!initializes[version], "already initialize");

        counts[msg.sender] = _count;
        initializes[version] = true;
    }

    function count() external virtual {
        counts[msg.sender] += 1;
    }
}
