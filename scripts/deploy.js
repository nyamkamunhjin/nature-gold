const { ethers, upgrades } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(`Deploying contract from: ${owner.address}`);

  const natureGold = await upgrades.deployProxy(await ethers.getContractFactory('NatureGold'));
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
