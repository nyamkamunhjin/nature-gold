const { expect } = require('chai');
const { ethers } = require("hardhat");

describe('NatureGold', function () {
  before(async function () {
    this.natureGoldContract = await ethers.getContractFactory('NatureGold');
  });

  beforeEach(async function () {
    this.natureGold = await this.natureGoldContract.deploy();
    await this.natureGold.deployed();

    const signers = await ethers.getSigners();

    this.ownerAddress = signers[0].address;
    this.recipientAddress = signers[1].address;

    this.signerContract = this.natureGold.connect(signers[1]);
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
    const ownerBalance = await this.natureGold.balanceOf(this.ownerAddress);
    expect(await this.natureGold.balanceOf(this.ownerAddress)).to.equal(ownerBalance);
  });

  it('Transfers the right amount of tokens to/from an account', async function () {
    const transferAmount = 1000;
    await expect(this.natureGold.transfer(this.recipientAddress, transferAmount)).to.changeTokenBalances(
        this.natureGold,
        [this.ownerAddress, this.recipientAddress],
        [-transferAmount, transferAmount]
      );
  });

  it('Emits a transfer event with the right arguments', async function () {
    const transferAmount = 100000;
    await expect(this.natureGold.transfer(this.recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Transfer")
        .withArgs(this.ownerAddress, this.recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
  });

  it('Allows for allowance approvals and queries', async function () {
    const approveAmount = 10000;
    await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(approveAmount.toString(), this.decimals));
    expect((await this.natureGold.allowance(this.recipientAddress, this.ownerAddress))).to.equal(ethers.utils.parseUnits(approveAmount.toString(), this.decimals));
  });

  it('Emits an approval event with the right arguments', async function () {
    const approveAmount = 10000;
    await expect(this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(approveAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Approval")
        .withArgs(this.recipientAddress, this.ownerAddress, ethers.utils.parseUnits(approveAmount.toString(), this.decimals))
  }); 

  it('Allows an approved spender to transfer from owner', async function () {
    const transferAmount = 10000;
    await this.natureGold.transfer(this.recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.natureGold.transferFrom(this.recipientAddress, this.ownerAddress, transferAmount)).to.changeTokenBalances(
        this.natureGold,
        [this.ownerAddress, this.recipientAddress],
        [transferAmount, -transferAmount]
      );
  });

  it('Emits a transfer event with the right arguments when conducting an approved transfer', async function () {
    const transferAmount = 10000;
    await this.natureGold.transfer(this.recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
    await expect(this.natureGold.transferFrom(this.recipientAddress, this.ownerAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Transfer")
        .withArgs(this.recipientAddress, this.ownerAddress, ethers.utils.parseUnits(transferAmount.toString(), this.decimals))
  });

  it('Allows allowance to be increased and queried', async function () {
    const initialAmount = 100;
    const incrementAmount = 10000;
    await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
    const previousAllowance = await this.natureGold.allowance(this.recipientAddress, this.ownerAddress);
    await this.signerContract.increaseAllowance(this.ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals));
    const expectedAllowance = ethers.BigNumber.from(previousAllowance).add(ethers.BigNumber.from(ethers.utils.parseUnits(incrementAmount.toString(), this.decimals)))
    expect((await this.natureGold.allowance(this.recipientAddress, this.ownerAddress))).to.equal(expectedAllowance);
  });

  it('Emits approval event when alllowance is increased', async function () {
    const incrementAmount = 10000;
    await expect(this.signerContract.increaseAllowance(this.ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Approval")
        .withArgs(this.recipientAddress, this.ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), this.decimals))
  });

  it('Allows allowance to be decreased and queried', async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
    const previousAllowance = await this.natureGold.allowance(this.recipientAddress, this.ownerAddress);
    await this.signerContract.decreaseAllowance(this.ownerAddress, ethers.utils.parseUnits(decrementAmount.toString(), this.decimals));
    const expectedAllowance = ethers.BigNumber.from(previousAllowance).sub(ethers.BigNumber.from(ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
    expect((await this.natureGold.allowance(this.recipientAddress, this.ownerAddress))).to.equal(expectedAllowance);
  });

  it('Emits approval event when alllowance is decreased', async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await this.signerContract.approve(this.ownerAddress, ethers.utils.parseUnits(initialAmount.toString(), this.decimals))
    const expectedAllowance = ethers.BigNumber.from(ethers.utils.parseUnits(initialAmount.toString(), this.decimals)).sub(ethers.BigNumber.from(ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
    await expect(this.signerContract.decreaseAllowance(this.ownerAddress, ethers.utils.parseUnits(decrementAmount.toString(), this.decimals)))
        .to.emit(this.natureGold, "Approval")
        .withArgs(this.recipientAddress, this.ownerAddress, expectedAllowance)
  });

});