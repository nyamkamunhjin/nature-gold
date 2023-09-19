const { ethers, upgrades } = require("hardhat");
const dayjs = require('dayjs')

const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)
dayjs.utc()


console.log(1695136164,
  3 * 60, 24 * 60 * 60,
  ethers.utils.parseUnits("20000", 18),
  100,
  30)

const PROTECTED_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROTECTED_ROLE"));


async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  console.log("Account balance:", (await owner.getBalance()).toString());

  let natureGold;
  let bp;
  let governance;

  const deploy = async () => {
    // -- Token
    const BotPrevention = await ethers.getContractFactory("BotPrevention");

    console.log("==> begin / deploy: bot prevention");

    bp = await BotPrevention.deploy(
      1695136164,
      3 * 60, 24 * 60 * 60,
      ethers.utils.parseUnits("20000", 18),
      100,
      30);

    await bp.deployed();

    console.log("==> end / deploy: bot prevention");

  };


  const botPreventionConfig = async () => {
    await (await bp.connect(owner).grantRole(PROTECTED_ROLE, natureGold.address)).wait();
  };

  const consoleAddresses = async () => {
    console.table({
      bp: bp.address,
    });
  };



  await deploy();
  await consoleAddresses();
  await botPreventionConfig();
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
