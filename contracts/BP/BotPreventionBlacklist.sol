// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "./interfaces/IBotPrevention.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BotPreventionBlacklist is IBotPrevention, Ownable, AccessControl {
    bytes32 private constant PROTECTED_ROLE = keccak256("PROTECTED_ROLE");

    mapping(address => bool) public isBlacklist;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    event AddBlackListEvent(address[] _blacklistAddress);

    event RemoveBlacklistEvent(address[] _blacklistAddress);

    function addBlacklist(
        address[] calldata _blacklistAddress
    ) external onlyOwner {
        require(_blacklistAddress.length > 0, "length > 0");
        for (uint256 i = 0; i < _blacklistAddress.length; i++) {
            isBlacklist[_blacklistAddress[i]] = true;
        }

        emit AddBlackListEvent(_blacklistAddress);
    }

    function removeBlacklist(
        address[] calldata _blacklistAddress
    ) external onlyOwner {
        require(_blacklistAddress.length > 0, "length > 0");
        for (uint256 i = 0; i < _blacklistAddress.length; i++) {
            isBlacklist[_blacklistAddress[i]] = false;
        }

        emit RemoveBlacklistEvent(_blacklistAddress);
    }

    function protect(
        address sender,
        address receiver,
        uint256 /* amount */
    ) external view override onlyRole(PROTECTED_ROLE) {
        require(
            !isBlacklist[sender] && !isBlacklist[receiver],
            "BL - contact us"
        );
    }
}
