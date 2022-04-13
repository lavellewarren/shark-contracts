const fs = require('fs');
const ShrkERC20 = require('../abi/SharkERC20Token.json');
const MultiSigWalletWithDailyLimit = require('../abi/MultiSigWalletWithDailyLimit.json');
const SharkTreasury = require('../abi/SharkTreasury.json');
const SharkBondingCalculator = require('../abi/SharkBondingCalculator.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
    console.log(`SHRK address: ${SHRK.address}`);

    const DAO = new ethers.Contract(MultiSigWalletWithDailyLimit.address, MultiSigWalletWithDailyLimit.abi, deployer);
    console.log(`DAO address: ${DAO.address}`);

    const treasury = new ethers.Contract(SharkTreasury.address, SharkTreasury.abi, deployer);
    console.log(`SharkTreasury address: ${treasury.address}`);

    const bondCalculator = new ethers.Contract(SharkBondingCalculator.address, SharkBondingCalculator.abi, deployer);
    console.log(`SharkBondingCalculator address: ${bondCalculator.address}`);

    const _principle = '';

    const contractFactory = await ethers.getContractFactory('SharkBondDepository');
    const contract = await contractFactory.deploy(
        SHRK.address,
        _principle,
        treasury.address,
        DAO.address,
        bondCalculator.address,
    );
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/SharkBondDepository.json', JSON.stringify(data));
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
