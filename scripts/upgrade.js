// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "";

async function main() {


    const NatureGoldV2 = await ethers.getContractFactory("NatureGoldV2");
    console.log("Upgrading NatureGold...");
    await upgrades.upgradeProxy(PROXY, NatureGoldV2);
    console.log("NatureGold upgraded");
}

main();