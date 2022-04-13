const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const contractFactory = await ethers.getContractFactory('SharkERC20Token');
  const contract = await contractFactory.deploy();
  console.log(`Contract address: ${contract.address}`);

  const data = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json'))
  };
  fs.writeFileSync('abi/SharkERC20Token.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
