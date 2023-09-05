// contracts/NatureGold.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./NatureGold.sol"; // code from previous implementation

contract NatureGoldV2 is NatureGold {

    mapping(address => uint256) public _buyBlock;
    
    mapping(address => bool) public _exempted;
    event Exempted(address _contract, bool status);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
    }

    function exemptAddress(address _contract, bool status) external onlyRole(MINTER_ROLE){
        require(!_exempted[_contract], "Already exempted!");

        _exempted[_contract] = status;
        emit Exempted(_contract, status);
    }

    /**
     * @dev Anti-bot transfer function.
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override nonReentrant {
        require(_buyBlock[sender] != block.number, "Bad bot!"); // Prevent transfers from addresses that made a purchase in this block
        
        if(sender == uniswapPair) {
            tradingBlock++;
        }

        if(tradingBlock < 20 && tx.gasprice > block.basefee && sender == uniswapPair){
            uint256 maxPremium = 3000000000;
            uint256 excessFee = tx.gasprice - block.basefee;

            require(excessFee < maxPremium, "Stop bribe!");
        }

        _buyBlock[recipient] = block.number; // Record the block number of the purchase for the recipient
        uint256 currentNonce = _getNonce();
        uint256 randomDelay = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), currentNonce)
            )
        ) % 15;

        uint256 adjustedAmount = amount;

        if (randomDelay > 0 && !_exempted[recipient] && !_exempted[sender]) {
            adjustedAmount = adjustedAmount - 1; // Apply a small reduction to the transferred amount
        }

        super._transfer(sender, recipient, adjustedAmount);
    }
}
