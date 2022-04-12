const fs = require('fs');
const sShrkToken = require('../abi/sShrkToken.json');
const Staking = require('../abi/Staking.json');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
  console.log(`SHRK address: ${SHRK.address}`);

  const daiAddress = '';
  const _secondsNeededForQueue = 60;

  const contractFactory = await ethers.getContractFactory('Treasury');
  const contract = await contractFactory.deploy(SHRK.address, daiAddress, _secondsNeededForQueue);
  console.log(`Contract address: ${contract.address}`);

  const data = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json'))
  };
  fs.writeFileSync('abi/Treasury.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
