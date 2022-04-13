const fs = require('fs');
const SharkStaking = require('../abi/SharkStaking.json');
const Distributor = require('../abi/Distributor.json');
const StakingWarmup = require('../abi/StakingWarmup.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const staking = new ethers.Contract(SharkStaking.address, SharkStaking.abi, deployer);
    console.log(`SharkStaking address: ${staking.address}`);

    const stakingDistributor = new ethers.Contract(Distributor.address, Distributor.abi, deployer);
    console.log(`Distributor address: ${stakingDistributor.address}`);

    const warmup = new ethers.Contract(StakingWarmup.address, StakingWarmup.abi, deployer);
    console.log(`StakingWarmup address: ${warmup.address}`);

    let tx = await staking.setContract(0, stakingDistributor.address);
    await tx.wait();
    console.log(tx);
    
    tx = await staking.setContract(1, warmup.address);
    await tx.wait();  
    console.log(tx);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
