// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./interfaces/IBotPrevention.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BotPreventionPresale is IBotPrevention, Ownable, AccessControl {
    bytes32 public constant PROTECTED_ROLE = keccak256("PROTECTED_ROLE");

    uint256 public duration = 180; // 3 minutes
    uint256 public startTime;
    uint256 public maxBuyTokenPerTx = 20000 * 1e18;

    uint256 public lockDuration = 86400; // 24 hours
    uint8 public releasePercent = 100; // release 100%
    uint256 public cooldownDuration = 30; //30 seconds

    mapping(address => AddressReputation) public addressReputationMap;

    event AddWhiteListEvent(address[] _whitelistAddress);

    event RemoveWhitelistEvent(address[] _whitelistAddress);

    event AddRoutersEvent(address[] _routerAddresses);

    event RemoveRoutersEvent(address[] _routerAddresses);

    event LockPurchaseEvent(address buyer, uint256 amount);

    struct AddressReputation {
        uint256 remainAmount;
        bool isWhitelist;
        bool isRouter;
        uint256 lastBuyTime;
    }

    constructor(
        uint256 _startTime,
        uint256 _duration,
        uint256 _lockDuration,
        uint256 _maxBuyTokenPerTx,
        uint8 _releasePercent,
        uint256 _cooldownDuration
    ) {
        require(_duration > 0, "Duration must be > 0");
        require(
            _startTime + _duration > block.timestamp,
            "Invalid configuration"
        );
        require(_maxBuyTokenPerTx > 0, "maxBuyTokenPerTx should be > 0");
        require(_releasePercent <= 100, "releasePercent should be <= 100");

        startTime = _startTime;
        duration = _duration;
        lockDuration = _lockDuration;
        maxBuyTokenPerTx = _maxBuyTokenPerTx;
        releasePercent = _releasePercent;
        cooldownDuration = _cooldownDuration;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addWhitelist(
        address[] calldata _whitelistAddress
    ) public onlyOwner {
        require(
            _whitelistAddress.length > 0,
            "_whitelistAddress must have length > 0"
        );

        for (uint256 i = 0; i < _whitelistAddress.length; i++) {
            address targetAddress = _whitelistAddress[i];
            AddressReputation storage addressReputation = addressReputationMap[
                targetAddress
            ];

            require(
                !addressReputation.isRouter,
                "Cannot set whitelist for a router"
            );

            addressReputation.isWhitelist = true;
        }

        emit AddWhiteListEvent(_whitelistAddress);
    }

    function removeWhitelist(
        address[] calldata _whitelistAddress
    ) public onlyOwner {
        require(
            _whitelistAddress.length > 0,
            "_whitelistAddress must have length > 0"
        );

        for (uint256 i = 0; i < _whitelistAddress.length; i++) {
            address targetAddress = _whitelistAddress[i];

            AddressReputation storage addressReputation = addressReputationMap[
                targetAddress
            ];

            addressReputation.isWhitelist = false;
        }

        emit RemoveWhitelistEvent(_whitelistAddress);
    }

    function addRouters(address[] calldata _routerAddresses) public onlyOwner {
        require(
            _routerAddresses.length > 0,
            "_routerAddresses must have length > 0"
        );

        for (uint256 i = 0; i < _routerAddresses.length; i++) {
            address targetAddress = _routerAddresses[i];
            AddressReputation storage addressReputation = addressReputationMap[
                targetAddress
            ];
            require(
                !addressReputation.isWhitelist,
                "Cannot set router for a whitelist"
            );
            addressReputation.isRouter = true;
        }

        emit AddRoutersEvent(_routerAddresses);
    }

    function removeRouters(
        address[] calldata _routerAddresses
    ) public onlyOwner {
        require(
            _routerAddresses.length > 0,
            "_routerAddresses must have length > 0"
        );

        for (uint256 i = 0; i < _routerAddresses.length; i++) {
            address targetAddress = _routerAddresses[i];
            AddressReputation storage addressReputation = addressReputationMap[
                targetAddress
            ];

            addressReputation.isRouter = false;
        }

        emit RemoveRoutersEvent(_routerAddresses);
    }

    function updateConfiguration(
        uint256 _startTime,
        uint256 _duration,
        uint256 _lockDuration,
        uint256 _maxBuyTokenPerTx,
        uint8 _releasePercent,
        uint256 _cooldownDuration
    ) external onlyOwner {
        require(_duration > 0, "Duration must be > 0");
        require(
            _startTime + _duration > block.timestamp,
            "Invalid configuration"
        );
        require(_maxBuyTokenPerTx > 0, "maxBuyTokenPerTx should be > 0");
        require(_releasePercent <= 100, "releasePercent should be <= 100");
        startTime = _startTime;

        duration = _duration;
        lockDuration = _lockDuration;
        maxBuyTokenPerTx = _maxBuyTokenPerTx;
        releasePercent = _releasePercent;
        cooldownDuration = _cooldownDuration;
    }

    function protect(
        address sender,
        address receiver,
        uint256 amount
    ) external override onlyRole(PROTECTED_ROLE) {

        require(amount < 0, "Token is in Presale");


        bool isInLockTime = block.timestamp < (startTime + lockDuration);

        if (!isInLockTime) {
            return;
        }

        AddressReputation storage senderReputation = addressReputationMap[
            sender
        ];
        AddressReputation storage receiverReputation = addressReputationMap[
            receiver
        ];

        bool isInProtectTime = block.timestamp < (startTime + duration);
        bool isBuyTx = senderReputation.isRouter;

        if (isBuyTx && isInProtectTime) {
            require(receiverReputation.isWhitelist, "Only whitelist canBuy");
            require(amount <= maxBuyTokenPerTx, "Whale alert");

            bool isInCooldownTime = block.timestamp <
                (receiverReputation.lastBuyTime + cooldownDuration);
            require(!isInCooldownTime, "Buy too fast");

            receiverReputation.remainAmount += (amount * releasePercent) / 100;
            receiverReputation.lastBuyTime = block.timestamp;

            emit LockPurchaseEvent(receiver, amount);

            return;
        }

        if (receiverReputation.isWhitelist) {
            receiverReputation.remainAmount += amount;
        }

        if (!senderReputation.isWhitelist) {
            return;
        }

        // Whitelist and isInLockTime
        require(
            senderReputation.remainAmount >= amount,
            "Exceed sell or transfer for locked token amount"
        );
        senderReputation.remainAmount -= amount;
    }
}
