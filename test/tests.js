const Event = artifacts.require('Event')
const TicketPool = artifacts.require('Tickets')

const assert = require('assert')
const ganache = require("ganache-cli")
const Web3 = require("web3")
const provider = ganache.provider()
const web3 = new Web3(provider)

let organizer
let customers
let EventInstance
let TicketPoolInstance

let ticketIds =[]
let concertName ="Beyonce LIVE 2018"

contract('Wise Unicorn Testing', (accounts) => {
    beforeEach(async () => {
    
        //let accounts = await web3.eth.getAccounts()
       
        //the very first account will be organizer, everyone else are customers
        organizer = accounts[0];
        customers = accounts.slice(1)
        //console.log(organizer)
        // instantiating both contracts
        EventInstance = await Event.deployed({from:organizer})
        //EventInstance = await Event.new(concertName,{from:organizer});
        //console.log(EventInstance)
        TicketPoolInstance = await TicketPool.deployed(EventInstance.address,{from:organizer});
        //TicketPoolInstance = await TicketPool.new(EventInstance.address,{from:organizer});

        //linking Event with its TicketPool
        await EventInstance.linkTicketPool(TicketPool.address,{from:organizer})
    })

    it('Event organizer should be able to create tickets', async () => {
        //console.log(await TicketPoolInstance.deployed())
        const descriptionBase = 'seat '
        const numberOfTickets = 10
        var i=0
        
        for( i=0; i<numberOfTickets; i++){
            var description = descriptionBase.concat(i)            
            await TicketPoolInstance.addTicket(description,{from:organizer})
        }
        //check if the number of tickets matches the expected one
        actualNumberOfTickets = await TicketPoolInstance.numberOfTickets.call()
        assert.equal(actualNumberOfTickets, numberOfTickets)

        var i=0
        for( i=0; i<numberOfTickets; i++){
            var expectedDescription = descriptionBase.concat(i)
            var ticketId = await TicketPoolInstance.TicketIds(i)
            ticketIds.push(ticketId)
            var actualData = await TicketPoolInstance.TicketData(ticketId)
            assert.equal(actualData.description,expectedDescription)            
        }
    })
    it('Event organizer is unable to sell tickets unless the event is released', async () => {
        //assert the event has not been released yet
        let released = await EventInstance.released.call({from:customers[5]})        
        assert.equal(released, false)        
        //attempt to publish an event on market should not be successful
        try{
            await TocketPoolInstance.publishOnMarket.call(ticketIds[0],{from: customers[0]})
            assert(false)
        }catch(err){
            assert(err)
        }
    })
    it('Only the organizer is able to release an event', async () => {
        try{
            await EventInstance.release.call({from:customers[0]})
            assert(false)
        }catch(err){
            assert(err)
        }
        //assert the event has not been released 
        let released = await EventInstance.released.call({from:customers[5]})
        assert.equal(released, false)        
        //assert the event can be released by the owner
        await EventInstance.release.call({from:organizer})
        released = await EventInstance.released.call({from:customers[3]})
        assert.equal(released, true) 

    })
    it('Once the event is released tickets can be sold', async () => {
        var basePrice = 1000000000
        var numberOfTickets = await TicketPoolInstance.numberOfTickets.call()
        for( var i=0; i<numberOfTickets; i++){
            //only even tickets are published on the market
            if(i%2==0)
                await TicketPoolInstance.publishOnMarket.call(ticketIds[i],i*basePrice,{from:customers[0]})                
                                                
        }
        //assert all the tickets can be found at the market
        for( var i=0; i<numberOfTickets; i++){
            if(i%2==0){
                assert.equals(await EventInstance.ticketIsOnSale.call(ticketIds[i]),false)
                try{
                    var price = await EventInstance.getTicketPrice(ticketIds[i])
                    assert(false)
                }
                catch(err){
                    assert(err)
                }
            }
            else{
                assert.equals(await EventInstance.ticketIsOnSale.call(ticketIds[i]),true)
                var price = await EventInstance.getTicketPrice(ticketIds[i])
                assert.equals(price, i*basePrice)
            }            
        }                
    })
})