const fs = require('fs');
const ShrkERC20 = require('../abi/SharkERC20Token.json');
const MultiSigWalletWithDailyLimit = require('../abi/MultiSigWalletWithDailyLimit.json');
const SharkTreasury = require('../abi/SharkTreasury.json');

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

    const _principle = '0x91203166358ac3a41610a7378dbb625851542b1e';    // LP of WETH/SHRK

    const _feed = '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e';     // Aggregator of WETH

    const contractFactory = await ethers.getContractFactory('EthBondDepository');
    const contract = await contractFactory.deploy(
        SHRK.address,
        _principle,
        treasury.address,
        DAO.address,
        _feed,
    );
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/EthBondDepository-AVAX.json', JSON.stringify(data));

    console.log("Verify contract:");
    console.log(`npx hardhat verify --network rinkeby ${contract.address} ${SHRK.address} ${_principle} ${treasury.address} ${DAO.address} ${_feed}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
