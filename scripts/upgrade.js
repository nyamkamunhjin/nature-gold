// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "0x3f1FfeeAD1dD589Ce2594960435D5c3c8CBf15EC";

async function main() {


    const NatureGoldV2 = await ethers.getContractFactory("NatureGoldV2");
    console.log("Upgrading NatureGold...");

    await upgrades.forceImport(PROXY, NatureGoldV2, { kind: 'transparent' });
    const upgraded = await upgrades.upgradeProxy(PROXY, NatureGoldV2);

    console.log(await upgraded.address)
    console.log(await upgraded.deployed())

    console.log("NatureGold upgraded");
}

main();