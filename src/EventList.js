import React, { Component } from "react";
import { Container, Button, Card, CardGroup } from "semantic-ui-react";
import web3Handler from "./web3";

import EventEdit from "./EventEdit";

import EventManager from "./EventManager";


export default class EventList extends Component {
  
  state = {
    events:[],
    dataFetched:false,
    eventToEdit:""
  };
  componentDidMount(){
    this.getAllEvents();
  }
  getAllEvents = async()=>{
    this.setState({dataFetched: false});
    const currentAccount = (await web3Handler.eth.getAccounts())[0];
    const numEvents = await EventManager.methods.numberOfEvents().call();

    console.log("Number of events: "+numEvents);

    for(var eventId=0;eventId<numEvents;eventId++){
        const eventAddress = await EventManager.methods.eventList(eventId).call();
        console.log("Event #"+eventId+" at "+eventAddress)
        
        const compiledEvent = require("./build/contracts/Event.json");
        const eventInstance = new web3Handler.eth.Contract(compiledEvent.abi, eventAddress);

        const eventName = await eventInstance.methods.eventName().call();
        const eventOrganizer = await eventInstance.methods.organizer().call();
        const released = await eventInstance.methods.released().call()
        console.log("Name: "+eventName+" created by: "+eventOrganizer)

        if(released || currentAccount===eventOrganizer)
        this.state.events.push(
          <Card key={eventAddress}>
            <Card.Content>              
              <Card.Header>{eventName}</Card.Header>
              <Card.Meta style={{"wordWrap": "break-word"}}>by: {eventOrganizer}</Card.Meta>
              <Card.Description style={{"wordWrap": "break-word"}}>
                Address: {eventAddress}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {released? 
                <Button basic color='green' onClick = {e => this.onEventBuy(eventAddress)}>
                  Buy Tickets
                </Button>
              :null}
              {currentAccount===eventOrganizer && !released? 
                <Button basic color='grey' onClick = {e => this.onEventEdit(eventAddress)}>
                  Edit
                </Button>
              :null}
            </Card.Content>
          </Card>          
        );
    }
    this.setState({dataFetched: true});
  }
  onEventEdit = (address)=>{
    console.log("Event to edit: "+address)
    this.setState({eventToEdit: address})
  }
  getEventName =async ()=>{
      const eventName = await this.state.eventContract.methods.eventName().call();            
      return eventName;
  }
  onEventBuy = (eventAddress)=>{
    this.props.appBody(eventAddress)
  }

  render() {
    if (this.state.dataFetched )
      return (
        <Container>
          <CardGroup>
            {this.state.events}
          </CardGroup>
          {this.state.eventToEdit===""?null:<EventEdit eventContractAddress = {this.state.eventToEdit}/>}
        </Container>
      ); 
    else
      return (
        <h1>Loading Data...</h1>
      );
   
      
         
  }
}