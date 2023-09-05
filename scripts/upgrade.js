// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "0xB1631FB72d485f0EF54c2128e3e592B4FDc254Fa";

async function main() {

    const NatureGold = await ethers.getContractFactory("NatureGold");
    console.log("Upgrading NatureGold...");
    await upgrades.upgradeProxy(PROXY, NatureGold);
    console.log("NatureGold upgraded");
}

main();