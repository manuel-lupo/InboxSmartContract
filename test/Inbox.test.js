const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile')
let accounts;
let contract;
let senderAccount;
let contractAccount;
const INITIAL_MESSAGE = 'Hola primer contrato!'

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  contractAccount = accounts[0];
  senderAccount = accounts[1];

  contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE]})
    .send({ from: contractAccount, gas: '1000000'})
});

describe("Inbox", () => {
  it("test_contract_deployed", () => {
    const address = contract.options.address
    console.log(`Addres of deployed contract: ${address}`)
    assert.ok(address)
  });
  it("test_initial_message_ok", async () => {
    const message = await contract.methods.message().call();
    console.log(`Mensaje inicial: ${message}`);
    assert.equal(message, INITIAL_MESSAGE);
  })
  it('test_message_changes', async ()=> {
    const assert_msg_correct = async (expected_message) =>{
      assert.equal(await contract.methods.message().call(), expected_message);
    }
    let expected_message = INITIAL_MESSAGE
    assert_msg_correct(expected_message);
    console.log(`Mensaje inicial: ${expected_message}`)
    expected_message = 'Nuevo mensaje';
    await contract.methods.setMessage(expected_message).send({from: senderAccount}); //envia la transaccion que interactua con el contrato
    let actual_message = await contract.methods.message().call()
    console.log(`Mensaje actualizado: ${actual_message}`)
    assert_msg_correct(expected_message);
  })
});
