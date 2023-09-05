// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "";

async function main() {

    const NatureGold = await ethers.getContractFactory("NatureGoldV2");
    console.log("Upgrading NatureGold...");
    await upgrades.upgradeProxy(PROXY, NatureGold);
    console.log("NatureGold upgraded");
}

main();