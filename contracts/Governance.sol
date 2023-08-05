// contracts/Governance.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract Governance is Governor, GovernorVotes {

    constructor(IVotes token) Governor("NatureGoldGovernance") GovernorVotes(token){
    }

}