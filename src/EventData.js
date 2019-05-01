import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import web3Handler from "./web3";

export default class EventData extends Component {
  
  state = {
    contractDataFetched: false,
    eventContract: null,
    eventName:"NONAME"
  };
 
  componentDidMount(){
    this.getContractData();
  }
  getContractData = async()=>{
    var compiledContract = require("./build/contracts/Event.json");   
    
    await this.setState({eventContract: new web3Handler.eth.Contract(
      compiledContract.abi, this.props.eventContractAddress
    )});
    //console.log(this.state.eventContract);

    await this.getEventName();

    this.setState({contractDataFetched: true});
  }

  getEventName =async ()=>{
      const eventName = await this.state.eventContract.methods.eventName().call();
      this.setState({eventName: eventName})
      console.log("Event name: "+this.state.eventName);
      return eventName;
  }

  render() {
    if(this.state.eventContract==null) return null;
    return (
      <Container>
        <h1>{this.state.eventName}</h1>
      </Container>
    );      
  }
}