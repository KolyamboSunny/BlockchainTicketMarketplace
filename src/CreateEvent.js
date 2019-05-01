import React, { Component } from "react";
import { Input, Container, Button } from 'semantic-ui-react';
import web3Handler from './web3';
import EventData from './EventData'

class CreateEvent extends Component {
  state = {
    eventName: "",
    status: "",
    eventContractAddress: "",
    ticketContractAddress: "",

  };
  
  deploy = async (eventName) => {
    const accounts = await web3Handler.eth.getAccounts();     
    
    //deploying event contract
    const compiledEvent = require("./build/contracts/Event.json");
    const EventContract = new web3Handler.eth.Contract(compiledEvent.abi);

    const eventResult = await EventContract.deploy({ data: compiledEvent.bytecode, arguments:[eventName] })
      .send({ gas: "6721974", from: accounts[0] });

    console.log("Deployed event contract at: "+eventResult.options.address)
    this.setState({eventContractAddress: eventResult.options.address})

    //deploying ticket pool
    const compiledTickets = require("./build/contracts/Tickets.json")
    const TicketContract = new web3Handler.eth.Contract(compiledTickets.abi);

    const ticketResult = await TicketContract.deploy({ data: compiledTickets.bytecode, arguments:[this.state.eventContractAddress]})
      .send({ gas: "6721974", from: accounts[0] }); 

    console.log("Deployed ticket pool contract at: "+ticketResult.options.address)
    this.setState({ticketContractAddress: ticketResult.options.address})

    //link ticket pool to event
    const EventInstance = await new web3Handler.eth.Contract(compiledEvent.abi,this.state.eventContractAddress)
    await EventInstance.methods.linkTicketPool(this.state.ticketContractAddress)
      .send({gas:"6721974", from: accounts[0]})

    const linkedPool = await EventInstance.methods.ticketStorage().call()
    console.log("Event was linked to: "+linkedPool)
    const assert = require('assert')
    if (linkedPool === this.state.ticketContractAddress){
      console.log("Ticket pool successfully linked")
      this.setState({status:"success"})
    }
    else{
      console.log("Linked pool result: "+linkedPool)
      console.log("Ticket pool was not linked: "+linkedPool+" VS "+this.state.ticketContractAddress)
      this.setState({status:"failed"})
    }
  };
  
  inputTextChanged = (e) => {
    this.setState({
      eventName: e.target.value
    });
  };
  createEventContract = () => {    
    this.deploy(this.state.eventName);
    this.setState({status:"creating"})
  };

  

  

  render() {
    if(this.state.eventContractAddress!=="")
    return (
      <Container>
        <h1>Create your own event</h1><br/>
        <Input focus onChange={this.inputTextChanged.bind(this)} placeholder='Event name:' />
        <br/>
        <Button color='green' onClick={this.createEventContract} >Create</Button>
      </Container>
    );
    else
    return (
      <Container>
        <h1>Create your own event</h1><br/>
        <Input focus onChange={this.inputTextChanged.bind(this)} placeholder='Event name:' />
        <br/>
        <Button color='green' onClick={this.createEventContract} >Create</Button>
      </Container>
    );
  }
}
//        <EventData eventContractAddress={this.state.eventContractAddress}/> : null }
export default CreateEvent;