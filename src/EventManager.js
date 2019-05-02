import web3Handler from "./web3";

const instanceAddress = "0x41d6653a9Bd6C5320340BE6b18023413Bced8cCe";
const compiledEventManager = require("./build/contracts/EventManager.json");
const contractInstance = new web3Handler.eth.Contract(compiledEventManager.abi, instanceAddress);

export default contractInstance;