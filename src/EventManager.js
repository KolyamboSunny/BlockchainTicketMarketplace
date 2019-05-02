import web3Handler from "./web3";

const instanceAddress = "0x23e73B2909F3E54E18d91d7Db5aa278e97bB4e8b";
const compiledEventManager = require("./build/contracts/EventManager.json");
const contractInstance = new web3Handler.eth.Contract(compiledEventManager.abi, instanceAddress);


const compiledTicket = require("./build/contracts/Tickets.json");
const getTicketsInstance=(address)=>{ return new web3Handler.eth.Contract(compiledTicket.abi, address);}


const compiledEvent = require("./build/contracts/Event.json");
const getEventInstance=(address)=>{ return new web3Handler.eth.Contract(compiledEvent.abi, address);}

export {getTicketsInstance, getEventInstance};
export default contractInstance;
