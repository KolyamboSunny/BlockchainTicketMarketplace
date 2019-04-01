const Event = artifacts.require('./contracts/Event.sol')
const TicketPool = artifacts.require('./contracts/Tickets.sol')
module.exports = function(deployer,network, accounts) {
    deployer.deploy(Event,"Beyonce",{from: accounts[0]})
    .then(()=> Event.deployed())
    .then(()=>deployer.deploy(TicketPool,Event.address,{from: accounts[0]}))    
}