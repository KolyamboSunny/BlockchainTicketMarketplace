import React, { Component } from "react";
import { Container, Button, List, Card, Label, Input, Header } from "semantic-ui-react";
import web3Handler from "./web3";

import EventEdit from "./EventEdit";

import EventManager,{getEventInstance,getTicketsInstance} from "./EventManager";

export default class MyTickets extends Component {
  
  state = {
    ticketsView:[],
    dataFetched:false,
    modalOpen: false,
    ticketPrice:0.5
  };
  componentDidMount(){
    this.getAllTickets();
  }
  getAllTickets = async()=>{
    this.setState({dataFetched: false});
    const currentAccount = (await web3Handler.eth.getAccounts())[0];
    const numEvents = await EventManager.methods.numberOfEvents().call();

    for(var eventId=0;eventId<numEvents;eventId++){
        const eventAddress = await EventManager.methods.eventList(eventId).call();
        const eventInstance = getEventInstance(eventAddress);
        const eventName = await eventInstance.methods.eventName().call();

        const ticketAddress = await eventInstance.methods.ticketStorage().call();
        const ticketInstance = getTicketsInstance(ticketAddress);
        console.log("my tickets: ")
        const userTickets = await ticketInstance.methods.ticketsOfOwner(currentAccount).call();
        
        console.log(userTickets)
        userTickets.forEach(async(ticketId) => {
          const ticketData = await ticketInstance.methods.TicketData(ticketId).call();
          console.log(ticketData['description']);
          const ticketRedeemed = await ticketInstance.methods.isRedeemed(ticketId).call();
          const ticketOnSale = await eventInstance.methods.ticketIsOnSale(ticketId).call();         
          var ticketPrice = 0;
          if(ticketOnSale)
            ticketPrice = web3Handler.utils.fromWei((await eventInstance.methods.getTicketPrice(ticketId).call()).toString(),"ether");
          this.state.ticketsView.push(
            <List.Item>
              <List.Content>
                <List.Header as='a'>{eventName}</List.Header>
                <List.Description as='a'>{ticketData['description']}</List.Description>
              </List.Content>
              <List.Content floated='right'>
                <Button toggle active={!ticketOnSale }onClick={e=>this.toggleSell(ticketId, ticketInstance,ticketOnSale,eventName,ticketData['description'])}>
                  {ticketOnSale? ticketPrice+" ETH":"Sell"}
                </Button>
                <Button negative>Redeem</Button>
              </List.Content>
            </List.Item>  
          );
        });
    }
    this.setState({dataFetched: true});
  }
  toggleSell = (ticketId, ticketPoolInstance,ticketOnSale,eventName,ticketDescription)=>{
    console.log("sell toggled")
    this.setState({modalOpen: true, 
      ticketId:ticketId, ticketPoolInstance:ticketPoolInstance, 
      ticketOnSale:ticketOnSale,eventName:eventName,
      ticketDescription:ticketDescription});
  }
  getEventName =async ()=>{
      const eventName = await this.state.eventContract.methods.eventName().call();            
      return eventName;
  }
  changePrice= (e) => {
    this.setState({
      ticketPrice: e.target.value
    });
  }
  submitPrice=async()=>{
    console.log(this.state.ticketId)
    const priceInEth = web3Handler.utils.toWei(this.state.ticketPrice,"ether");
    console.log(priceInEth)
    const currentAccount = (await web3Handler.eth.getAccounts())[0];
    this.state.ticketPoolInstance.methods.publishOnMarket(this.state.ticketId,priceInEth).send({from:currentAccount});
    this.setState({modalOpen:false});
  }
  cancelSell=async()=>{
    const currentAccount = (await web3Handler.eth.getAccounts())[0];
    this.state.ticketPoolInstance.methods.cancelMarketPosition(this.state.ticketId).send({from:currentAccount});
    this.setState({modalOpen:false});
  }
  render() {
    if (this.state.dataFetched &&this.state.ticketsView.length>0)
      return (
        <Container>
          {this.state.modalOpen?
            <Card>
              <Card.Content>
                <Card.Header>{this.state.ticketOnSale?"Change Price":"Sell"}</Card.Header>                          
                <Card.Description>
                  <h2>{this.state.eventName}</h2>
                  <p>{this.state.ticketDescription}</p>                
                </Card.Description>
              </Card.Content>
              <Card.Content>
                <Input placeholder="0.5 ETH" onChange={this.changePrice.bind(this)}/>
                <Button onClick={e=>this.setState({modalOpen: false})}>Return</Button>
                <Button onClick={e=>this.submitPrice()}>Set Price</Button>
                {this.state.ticketIsOnSale? <Button onClick={e=>this.cancelSell()}>Remove From Market</Button> :null}
              </Card.Content>            
            </Card>         
          :null}
          <List divided relaxed>
            {this.state.ticketsView}
          </List>
        </Container>
      ); 
    else
      return (
        <h1>Loading Data...</h1>
      );       
  }
}