//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./v1.sol";

contract TransparentImplementationV2 is TransparentImplementationV1 {
    function initiallize(uint256 _count) external virtual override {
        uint256 version = 2;
        require(!initiallizes[version], "already initiallize");

        counts[msg.sender] = _count + 1;
        initiallizes[version] = true;
    }

    function count() external override {
        counts[msg.sender] += 2;
    }

    function admin() external view returns (address) {
        return msg.sender;
    }
}
