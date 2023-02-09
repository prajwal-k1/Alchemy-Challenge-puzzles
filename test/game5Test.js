const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    let wallet = ethers.Wallet.createRandom();
    while ((await wallet.getAddress()) >= threshold) {
      wallet = ethers.Wallet.createRandom();
    }

    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: await wallet.getAddress(),
      value: ethers.utils.parseEther("10")
    })

    const providerWallet = wallet.connect(ethers.provider);
    await game.connect(providerWallet).win();

    // good luck

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
