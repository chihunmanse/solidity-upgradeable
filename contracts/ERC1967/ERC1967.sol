// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1967 is ERC1967Proxy, Ownable {
    constructor(address _logic, bytes memory _data)
        payable
        ERC1967Proxy(_logic, _data)
    {}

    function upgradeTo(address newImplementation) external onlyOwner {
        _upgradeToAndCall(newImplementation, bytes(""), false);
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data)
        external
        payable
        onlyOwner
    {
        _upgradeToAndCall(newImplementation, data, true);
    }

    function implementation() external view returns (address) {
        return _implementation();
    }
}
