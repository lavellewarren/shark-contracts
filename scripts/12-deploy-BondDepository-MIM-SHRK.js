const fs = require('fs');
const ShrkERC20 = require('../abi/SharkERC20Token.json');
const SharkTreasury = require('../abi/SharkTreasury.json');
const SharkBondingCalculator = require('../abi/SharkBondingCalculator.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
    console.log(`SHRK address: ${SHRK.address}`);

    const daoAddress = '0xFDdFA9B8b7B13983CC6b360Fa0d5864306e5faaD';

    const treasury = new ethers.Contract(SharkTreasury.address, SharkTreasury.abi, deployer);
    console.log(`SharkTreasury address: ${treasury.address}`);

    const bondCalculator = new ethers.Contract(SharkBondingCalculator.address, SharkBondingCalculator.abi, deployer);
    console.log(`SharkBondingCalculator address: ${bondCalculator.address}`);

    const _principle = '0x13C0D45756Ae530BaEaf18ae10A4F2B73557a19d';    // LP of DAI/SHRK

    const bondCalculatorAddress = bondCalculator.address;

    const contractFactory = await ethers.getContractFactory('SharkBondDepository');
    const contract = await contractFactory.deploy(
        SHRK.address,
        _principle,
        treasury.address,
        daoAddress,
        bondCalculatorAddress,
    );
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/SharkBondDepository-MIM-SHRK.json', JSON.stringify(data));

    console.log("Verify contract:");
    console.log(`npx hardhat verify --network rinkeby ${contract.address} ${SHRK.address} ${_principle} ${treasury.address} ${DAO.address} ${bondCalculatorAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
