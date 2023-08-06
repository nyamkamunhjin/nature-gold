// contracts/NatureGold.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract NatureGoldUpgradeable is ERC20Upgradeable, AccessControlEnumerableUpgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Define the supply of NatureGold: 388,793,750
    uint256 constant INITIAL_SUPPLY = 388793750 * (10**18);

     function initialize() external initializer {
        __ERC20_init("NatureGold", "NG");
        __ERC20Permit_init("NatureGold");

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
     function mint(address to, uint256 amount) external {
        require(hasRole(MINTER_ROLE, msg.sender), "NatureGold: must have minter role to mint");
        _mint(to, amount);
    }
    

    // The following functions are overrides required by Solidity.

    function _mint(address to, uint256 amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._mint(to, amount);
    }
 
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._burn(account, amount);
    }
}
