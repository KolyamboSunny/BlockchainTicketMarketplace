import web3Handler from "./web3";

const instanceAddress = "0x9E63cf6aa8Be1EB8db5BEf34dBc08854a0C64561";
const compiledEventManager = require("./build/contracts/EventManager.json");
const contractInstance = new web3Handler.eth.Contract(compiledEventManager.abi, instanceAddress);


const compiledTicket = require("./build/contracts/Tickets.json");
const getTicketsInstance=(address)=>{ return new web3Handler.eth.Contract(compiledTicket.abi, address);}


const compiledEvent = require("./build/contracts/Event.json");
const getEventInstance=(address)=>{ return new web3Handler.eth.Contract(compiledEvent.abi, address);}

export {getTicketsInstance, getEventInstance};
export default contractInstance;
