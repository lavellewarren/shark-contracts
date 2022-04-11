const fs = require('fs');
const ShrkERC20 = require('../abi/ShrkERC20.json');
const Staking = require('../abi/Staking.json');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
  console.log(`SHRK address: ${SHRK.address}`);

  const staking = new ethers.Contract(Staking.address, Staking.abi, deployer);
  console.log(`Staking address: ${staking.address}`);

  const contractFactory = await ethers.getContractFactory('StakingHelper');
  const contract = await contractFactory.deploy(SHRK.address, staking.address);
  console.log(`Contract address: ${contract.address}`);

  const data = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json'))
  };
  fs.writeFileSync('abi/StakingHelper.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
