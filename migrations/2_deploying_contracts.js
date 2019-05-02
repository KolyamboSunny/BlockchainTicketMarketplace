const EventManager = artifacts.require('./contracts/EventManager.sol')
module.exports = function(deployer,network, accounts) {
    console.log(accounts[0])
    deployer.deploy(EventManager,{from: accounts[0]})
    //.then(()=> EventManager.deployed())   
}