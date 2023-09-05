// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "0x865CD704052f7aBE5e1F479B98B87D9C985d8528";

async function main() {


    const NatureGoldV2 = await ethers.getContractFactory("NatureGoldV2");
    console.log("Upgrading NatureGold...");
    await upgrades.forceImport(PROXY, NatureGoldV2, { kind: 'transparent' });
    console.log("NatureGold upgraded");
}

main();