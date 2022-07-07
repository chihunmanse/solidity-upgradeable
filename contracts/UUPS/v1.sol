// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract UUPSImplementationV1 is UUPSUpgradeable, OwnableUpgradeable {
    mapping(address => uint256) public counts;

    function initialize(uint256 _count) public virtual initializer {
        __Ownable_init();

        counts[msg.sender] = _count;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function count() external virtual {
        counts[msg.sender] += 1;
    }
}
