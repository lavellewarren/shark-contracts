const fs = require('fs');
const ShrkERC20 = require('../abi/SharkERC20Token.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
    console.log(`SHRK address: ${SHRK.address}`);

    const mimAddress = '0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C';
    const _secondsNeededForQueue = 60;

    const contractFactory = await ethers.getContractFactory('SharkTreasury');
    const contract = await contractFactory.deploy(SHRK.address, mimAddress, _secondsNeededForQueue);
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/SharkTreasury.json', JSON.stringify(data));

    console.log("Verify contract:");
    console.log(`npx hardhat verify --network rinkeby ${contract.address} ${SHRK.address} ${mimAddress} ${_secondsNeededForQueue}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
