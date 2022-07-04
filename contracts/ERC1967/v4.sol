//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/StorageSlot.sol";

contract ERC1967ImplementationV4 {
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    mapping(address => uint256) public counts;

    function count() external {
        counts[msg.sender] += 3;
    }

    function storageTest(address _target) external {
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = _target;
    }

    function getAddress() external view returns (address target_) {
        target_ = StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }
}
