const Web3 =require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const provider = new HDWalletProvider(
  "guilt orient elegant lady select spider over raise question member slide inquiry",
  "HTTP://127.0.0.1:8545"
);
const web3Handler = new Web3(provider,null, {transactionConfirmationBlocks: 1});
const deploy = async () => {
  const compiledManager = require("./build/contracts/EventManager.json");

  const accountToDeploy = (await web3Handler.eth.getAccounts())[0];     
    
  const menagerContract = new web3Handler.eth.Contract(compiledManager.abi);

  const result = await menagerContract.deploy({ data: compiledManager.bytecode})
    .send({ gas: "6721974", from: accountToDeploy });
      
  console.log("Deployed mananger contract at: "+result.options.address)
};

deploy();
