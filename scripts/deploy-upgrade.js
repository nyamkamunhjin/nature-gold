// scripts/interact.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    // const [owner] = await ethers.getSigners();
    // console.log(`Deploying contract from: ${owner.address}`);
  
    // const natureGold = await upgrades.deployProxy(await ethers.getContractFactory('NatureGold'));
    // await natureGold.deployed();
    // console.log(`NatureGold deployed to: ${natureGold.address}`)
  
    // const governance = await upgrades.deployProxy(await ethers.getContractFactory('Governance'), [natureGold.address]);
    // await governance.deployed();
    // console.log(`Governance deployed to: ${governance.address}`)

    const NatureGoldV2 = await ethers.getContractFactory("NatureGoldV2");
    console.log("Upgrading NatureGold to V2...");

    const PROXY = '0x3262CFa5cAcBBe0579945ac470fC6a9Ab3f188B6'

    upgrades.forceImport(PROXY, NatureGoldV2);
    const upgraded = await upgrades.upgradeProxy(PROXY, NatureGoldV2);

    console.log(await upgraded.address)
    console.log(await upgraded.deployed())

    console.log("NatureGold upgraded");
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });