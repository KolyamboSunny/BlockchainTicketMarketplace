import React, { Component } from "react";
import { Input, Container, Button, Form, Icon } from 'semantic-ui-react';
import web3Handler from './web3';
import EventManager from './EventManager'

class CreateEvent extends Component {
  state = {
    eventName: "",
    status: "",
    eventContractAddress: ""
  };
  
  inputTextChanged = (e) => {
    this.setState({
      eventName: e.target.value
    });
  };
  createEventContract = async() => {   
    const currentAccount = (await web3Handler.eth.getAccounts())[0]; 
    this.setState({status:"creating"})
    
    try{
      const result = await EventManager.methods.addEvent(this.state.eventName)
        .send({ gas: "6721974", from: currentAccount });
      this.setState({status:"success"})
    } catch (err) {
      this.setState({ status: err.message });
    }
  };
  
  createTickets=(numRows,numSeats)=>{

  }


  render() {
    if(this.state.status!=="success")
      return (
        <Container>
          <Container>
          <h1>Create new event</h1><br/>
          <p>{this.state.status}</p>
          <br/>
          <Input focus onChange={this.inputTextChanged.bind(this)} placeholder='Event name:' />
          <br/>
          <Button color='green' onClick={this.createEventContract} >Create</Button>
          </Container>
        </Container>
      );
    else
      return (
        <Container>
          <h1>Create your own event</h1><br/>                
          <p>Event contract address: {this.state.eventContractAddress!=="" && this.state.status==="success"? this.state.eventContractAddress :null}</p> 
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <Input label="Rows" onChange={event => this.setState({ rows: event.target.value })}/>
            </Form.Field>
            <Form.Field>
              <Input label="Seats per Row"/>
            </Form.Field>                        
            <Button primary type="submit" loading={this.state.loading}>
              <Icon name="check" />
              Create tickets
            </Button>          
            </Form>
        </Container>
      );
  }
}
//        <EventData eventContractAddress={this.state.eventContractAddress}/> : null }
export default CreateEvent;