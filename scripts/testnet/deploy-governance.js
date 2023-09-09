const { ethers, upgrades } = require("hardhat");
const dayjs = require('dayjs')

const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)
dayjs.utc()

console.log(dayjs().utc().isUTC())

const PROTECTED_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROTECTED_ROLE"));


async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("Account balance:", (await owner.getBalance()).toString());

  let natureGold;
  let bp;
  let governance;

  const deploy = async (address) => {
    // -- Token
    const Governance = await ethers.getContractFactory("Governance");

    console.log("--> begin / deploy: nature gold governance");

    governance = await Governance.deploy(address);


    await governance.deployed()

    console.log("--> end / deploy: nature gold governance");

  };




  const consoleAddresses = async () => {
    console.table({
      governance: governance.address
    });
  };

  await deploy('0xE1bD2742E1C5B36C6F19e624465DEb16D1E752a7');
  await consoleAddresses();
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
