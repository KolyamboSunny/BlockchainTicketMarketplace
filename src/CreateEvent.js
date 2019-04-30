import React, { Component } from "react";
import { Input, Container, Button } from 'semantic-ui-react';
import web3Handler from 'web3';

class CreateEvent extends Component {
  state = {
    eventName: "",
    message: ""
  };
  
  deploy = async (compiledContract, eventName) => {
    
    const accounts = await web3.eth.getAccounts();     
    
    const options = {      
      transactionConfirmationBlocks: 2,
    }

    const result = await new web3Handler.eth.Contract(
      compiledContract.abi
    )
      .deploy({ data: compiledContract.bytecode, arguments:[eventName] })
      .send({ gas: "2000000", from: accounts[0] });
          
    console.log("Contract deployed at: ", result.options.address);    
  };
  
  inputTextChanged = (e) => {
    this.setState({
      eventName: e.target.value
    });
  };
  createEventContract = () => {    
    const compiledEvent = require("./build/contracts/Event.json");   
    //const compiledTickets = require("./build/contracts/Tickets.json")
    deploy(compiledEvent,this.state.eventName);
  };

  

  

  render() {
    return (
      <Container>
        <h1>Create your own event</h1><br/>
        <Input focus onChange={this.inputTextChanged.bind(this)} placeholder='Event name:' />
        <Button color='green' onClick={this.createEventContract} >Create</Button>
      </Container>
    );
  }
}

export default CreateEvent;