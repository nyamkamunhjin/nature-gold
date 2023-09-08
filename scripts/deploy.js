const { ethers, upgrades } = require("hardhat");

async function main() {
    // Get the contract owner
    const contractOwner = await ethers.getSigners();
    console.log(`Deploying contract from: ${contractOwner[0].address}`);
  
    // Hardhat helper to get the ethers contractFactory object
    const NatureGold = await ethers.getContractFactory('NatureGoldV3');
  
    // Deploy the contract
    console.log('Deploying NatureGold...');
    const natureGold = await NatureGold.deploy("0x0");
    await natureGold.deployed();
    console.log(`NatureGold deployed to: ${natureGold.address}`)

  const governance = await upgrades.deployProxy(await ethers.getContractFactory('Governance'), [natureGold.address]);
  await governance.deployed();
  console.log(`Governance deployed to: ${governance.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
