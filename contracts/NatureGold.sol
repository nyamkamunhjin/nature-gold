// contracts/NatureGold.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NatureGold is ERC20 {

    // Define the supply of NatureGold: 388,793,750
    uint256 constant initialSupply = 388793750 * (10**18);

    // Constructor will be called on contract creation
    constructor() ERC20("NatureGold", "NG") {
        _mint(msg.sender, initialSupply);
    }
}