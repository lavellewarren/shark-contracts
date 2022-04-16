const fs = require('fs');
const sShrkERC20 = require('../abi/StakedShark.json');
const SharkStaking = require('../abi/SharkStaking.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const sSHRK = new ethers.Contract(sShrkERC20.address, sShrkERC20.abi, deployer);
    console.log(`sSHRK address: ${sSHRK.address}`);

    const staking = new ethers.Contract(SharkStaking.address, SharkStaking.abi, deployer);
    console.log(`SharkStaking address: ${staking.address}`);

    const contractFactory = await ethers.getContractFactory('StakingWarmup');
    const contract = await contractFactory.deploy(staking.address, sSHRK.address);
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/StakingWarmup.json', JSON.stringify(data));

    console.log("Verify contract:");
    console.log(`npx hardhat verify --network rinkeby ${contract.address} ${staking.address} ${sSHRK.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
