const Event = artifacts.require('./contracts/Event.sol')
const TicketPool = artifacts.require('./contracts/Tickets.sol')

const assert = require('assert')
const ganache = require("ganache-cli")
const Web3 = require("web3")
const provider = ganache.provider()
const web3 = new Web3(provider)

let organizer
let customers
let EventInstance
let TicketPoolInstance

contract('Wise Unicorn Testing', (accounts) => {
    beforeEach(async () => {
        let accounts = await web3.eth.getAccounts()
        console.log(accounts)
        //the very first account will be organizer, everyone else are customers
        organizer = accounts[0];
        customers = accounts.slice(1)

        EventInstance = await Event.deployed()
        TicketPoolInstance = await TicketPool.deployed()
    })

    it('Event organizer should be able to link the', async () => {
        await contractInstance.addTodo(web3.toHex('this is a short text'))
  
        const newAddedTodo = await contractInstance.todos(accounts[0], 0)
        const todoContent = web3.toUtf8(newAddedTodo[1])
        
        assert.equal(todoContent, 'this is a short text', 'The content of the new added todo is not correct')
     })
    
})