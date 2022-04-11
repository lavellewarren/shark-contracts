require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

const { privateKey_1 } = require('./data/privatekey')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.7.5",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // hardhat: {
    //   accounts: accounts('localhost'),
    // },
    localhost: {
      url: 'http://localhost:8545',
      accounts: [`0x${privateKey_1}`],
    },
    avax: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: [`0x${privateKey_1}`],
      live: true,
    },
    testavax: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [`0x${privateKey_1}`],
      live: true,
    },
  },
  mocha: {
    timeout: 300000
  }
};
