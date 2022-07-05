//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract TransparentImplementationV1 {
    mapping(uint256 => bool) initiallizes;
    mapping(address => uint256) public counts;

    function initiallize(uint256 _count) external virtual {
        uint256 version = 1;
        require(!initiallizes[version], "already initiallize");

        counts[msg.sender] = _count;
        initiallizes[version] = true;
    }

    function count() external virtual {
        counts[msg.sender] += 1;
    }
}
