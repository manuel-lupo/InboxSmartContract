require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.INFURA_URL
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    const deployment_account = accounts[0];

    console.log(`Attempting to deploy from account ${deployment_account}`);

    const contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['First time deploying'] })
        .send({ gas: '1000000', from: deployment_account });

    console.log(`Contract deployed to: ${contract.options.address}`);
    provider.engine.stop()
};

deploy()