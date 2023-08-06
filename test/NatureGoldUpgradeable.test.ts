import { expect } from 'chai';
import "@openzeppelin/hardhat-upgrades"
import { ethers, upgrades } from "hardhat";

describe('NatureGoldUpgradeable', function () {
  before(async function () {
    this.natureGoldUpgradeableContract = await ethers.getContractFactory('NatureGoldUpgradeable');
  });

  beforeEach(async function () {
    this.natureGoldUpgradeable = await upgrades.deployProxy(this.natureGold, [], {
      initializer: "initialize",
      kind: "transparent"
    });
    await this.natureGoldUpgradeable.waitForDeployment();

    const signers = await ethers.getSigners();

    this.ownerAddress = await signers[0].getAddress();
    this.recipientAddress = await signers[1].getAddress();

    this.signerContract = this.natureGold.connect(signers[1]);
  });

  // Test cases
  it('Has a correct token name', async function () {
    expect(await this.natureGold.name()).to.exist;
    expect(await this.natureGold.name()).to.equal('NatureGold');
  });

});