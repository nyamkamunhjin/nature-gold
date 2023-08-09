const { expect } = require('chai');
const { ethers, upgrades } = require("hardhat");

describe('NatureGold', function () {
  beforeEach(async function () {
    this.natureGold = await upgrades.deployProxy(await ethers.getContractFactory('NatureGold'));
    await this.natureGold.deployed();

    [this.owner, ...users] = await ethers.getSigners();
    this.recipient = users[1];

    this.signerContract = this.natureGold.connect(this.recipient);
  });

  // Test cases

  it('Has a correct token name', async function () {
    expect(await this.natureGold.name()).to.exist;
    expect(await this.natureGold.name()).to.equal('NatureGold');
  });

  it('Has a correct token symbol', async function () {
    expect(await this.natureGold.symbol()).to.exist;
    expect(await this.natureGold.symbol()).to.equal('NG');
  });

  it('Has a correct decimal', async function () {
    expect((await this.natureGold.decimals()).toString()).to.equal('18');
  })

  it('Has a correct initial total supply', async function () {
    const expectedSupply = ethers.utils.parseUnits('388793750', this.decimals);
    expect((await this.natureGold.totalSupply()).toString()).to.equal(expectedSupply);
  });

  it('Is able to query account balances', async function () {
    const ownerBalance = await this.natureGold.balanceOf(this.owner.address);
    expect(await this.natureGold.balanceOf(this.owner.address)).to.equal(ownerBalance);
  });

  it('Transfers the right amount of tokens to/from an account', async function () {
    const transferAmount = 1000;
    await expect(this.natureGold.transfer(this.recipient.address, transferAmount)).to.changeTokenBalances(
        this.natureGold,
        [this.owner.address, this.recipient.address],
        [-transferAmount, transferAmount]
      );
  });

  it('Emits a transfer event with the right arguments', async function () {
    const transferAmount = 100000;
    await expect(this.natureGold.transfer(this.recipient.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Transfer")
        .withArgs(this.owner.address, this.recipient.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
  });

  it('Allows for allowance approvals and queries', async function () {
    const approveAmount = 10000;
    await this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(approveAmount.toString(), this.decimals));
    expect((await this.natureGold.allowance(this.recipient.address, this.owner.address))).to.equal(ethers.utils.parseUnits(approveAmount.toString(), this.decimals));
  });

  it('Emits an approval event with the right arguments', async function () {
    const approveAmount = 10000;
    await expect(this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(approveAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Approval")
        .withArgs(this.recipient.address, this.owner.address, ethers.utils.parseUnits(approveAmount.toString(), this.decimals))
  }); 

  it('Allows an approved spender to transfer from owner', async function () {
    const transferAmount = 10000;
    await this.natureGold.transfer(this.recipient.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.natureGold.transferFrom(this.recipient.address, this.owner.address, transferAmount)).to.changeTokenBalances(
        this.natureGold,
        [this.owner.address, this.recipient.address],
        [transferAmount, -transferAmount]
      );
  });

  it('Emits a transfer event with the right arguments when conducting an approved transfer', async function () {
    const transferAmount = 10000;
    await this.natureGold.transfer(this.recipient.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.natureGold.transferFrom(this.recipient.address, this.owner.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Transfer")
        .withArgs(this.recipient.address, this.owner.address, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
  });

  it('Allows allowance to be increased and queried', async function () {
    const initialAmount = 100;
    const incrementAmount = 10000;
    await this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
    const previousAllowance = await this.natureGold.allowance(this.recipient.address, this.owner.address);
    await this.signerContract.increaseAllowance(this.owner.address, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals));
    const expectedAllowance = ethers.BigNumber.from(previousAllowance).add(ethers.BigNumber.from(ethers.utils.parseUnits(incrementAmount.toString(), this.decimals)))
    expect((await this.natureGold.allowance(this.recipient.address, this.owner.address))).to.equal(expectedAllowance);
  });

  it('Emits approval event when alllowance is increased', async function () {
    const incrementAmount = 10000;
    await expect(this.signerContract.increaseAllowance(this.owner.address, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Approval")
        .withArgs(this.recipient.address, this.owner.address, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals))
  });

  it('Allows allowance to be decreased and queried', async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
    const previousAllowance = await this.natureGold.allowance(this.recipient.address, this.owner.address);
    await this.signerContract.decreaseAllowance(this.owner.address, ethers.utils.parseUnits(decrementAmount.toString(), this.decimals));
    const expectedAllowance = ethers.BigNumber.from(previousAllowance).sub(ethers.BigNumber.from(ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
    expect((await this.natureGold.allowance(this.recipient.address, this.owner.address))).to.equal(expectedAllowance);
  });

  it('Emits approval event when alllowance is decreased', async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await this.signerContract.approve(this.owner.address, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
    const expectedAllowance = ethers.BigNumber.from(ethers.utils.parseUnits(initialAmount.toString(), this.decimals)).sub(ethers.BigNumber.from(ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
    await expect(this.signerContract.decreaseAllowance(this.owner.address, ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Approval")
        .withArgs(this.recipient.address, this.owner.address, expectedAllowance)
  });

});