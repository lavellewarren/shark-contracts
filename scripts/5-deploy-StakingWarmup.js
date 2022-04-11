const fs = require('fs');
const sShrkToken = require('../abi/sShrkToken.json');
const Staking = require('../abi/Staking.json');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const sSHRK = new ethers.Contract(sShrkToken.address, sShrkToken.abi, deployer);
  console.log(`sSHRK address: ${sSHRK.address}`);

  const staking = new ethers.Contract(Staking.address, Staking.abi, deployer);
  console.log(`Staking address: ${staking.address}`);

  const contractFactory = await ethers.getContractFactory('StakingWarmup');
  const contract = await contractFactory.deploy(staking.address, sSHRK.address);
  console.log(`Contract address: ${contract.address}`);

  const data = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json'))
  };
  fs.writeFileSync('abi/StakingWarmup.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
