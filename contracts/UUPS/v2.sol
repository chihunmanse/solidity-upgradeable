// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./v1.sol";

contract UUPSImplementationV2 is UUPSImplementationV1 {
    function V2initialize(uint256 _count) public reinitializer(2) {
        __Ownable_init();

        counts[msg.sender] = _count;
    }

    function count() external virtual override {
        counts[msg.sender] += 2;
    }
}
