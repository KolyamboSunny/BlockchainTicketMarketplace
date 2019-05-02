import React, { Component } from "react";
import { Container, Form, Icon, Input, Button, Label } from "semantic-ui-react";
import web3Handler from "./web3";

import {getEventInstance, getTicketsInstance} from "./EventManager";

export default class BuyTickets extends Component {
  
  state = {
    contractDataFetched: false,

    eventContract: null,
    ticketPool: null,

    eventName:"NONAME",
    numTickets: 0,

    numRows:0,
    numSeats:0,
    viewer: null
  };
 
  componentDidMount(){
    this.getContractData();
  }

  getContractData = async()=>{    
    const EventInstance = getEventInstance(this.props.eventToBuy);
    this.state.eventContract= EventInstance;

    const eventName = await this.state.eventContract.methods.eventName().call();
    const ticketAddress = await this.state.eventContract.methods.ticketStorage().call();

    this.setState({eventName: eventName});
    const TicketPool = getTicketsInstance(ticketAddress);
    this.state.ticketPool = TicketPool;
    const numTickets = web3Handler.utils.hexToNumber((await TicketPool.methods.numberOfTickets().call())['_hex']);
    this.setState({numTickets:numTickets});
    console.log(this.state.numTickets)

    this.setState({contractDataFetched: true});
  }
 
  render() {
    if(!this.state.contractDataFetched) return (<h1>Loading event {this.props.eventContractAddress} data...</h1>);
    return (
      <Container>
        <h1>{this.state.eventName}</h1>
        <p>{this.state.numTickets} tickets offered: </p>
        <SeatViewer eventInstance={this.state.eventContract} ticketPool={this.state.ticketPool}/>
      </Container>
    );      
  }
}
class SeatViewer extends Component {  
  state = {
    seats: [[]],
    ticketDataFetched: false
  }
  componentDidMount(){
    this.getTicketData();
  }
  getTicketData=async()=>{

    const numTickets = await this.props.ticketPool.methods.numberOfTickets().call();
    var maxRow=0; var maxSeat =0;
    for(var ticket_i=0;ticket_i<numTickets;ticket_i++){
      const ticketId = await this.props.ticketPool.methods.TicketIds(ticket_i).call();
      const ticketData = await this.props.ticketPool.methods.TicketData(ticketId).call();
      const ticketDescription = ticketData['description'];
      var row = ticketDescription.split(/ /g)[1]-1;;
      var seat = ticketDescription.split(/ /g)[3]-1;
      console.log(row+","+seat)

      if (row>=this.state.seats.length){
        var diff = row-this.state.seats.length;
        for(;diff>=0;diff--)
        this.state.seats.push([])
      }
      //console.log(this.state.seats[row])
      if (seat>=this.state.seats[row].length){
        var diff = seat-this.state.seats[row].length;
        for(;diff>=0;diff--)
          this.state.seats[row].push([])
      }
      this.state.seats[row][seat] = 
        <Seat description={ticketDescription} ticketId= {ticketId} eventInstance = {this.props.eventInstance}/>;      
    }
    this.setState({ticketDataFetched: true})
    //console.log(this.state.seats)
  }
  render() {    
    if (!this.state.ticketDataFetched) return(<h1>Loading tickets...</h1>);
    else
      return(
      <table border ="1">
        <tbody>
          {this.state.seats.map( row =>
            <tr>
              { row.map( seat =>
                <td >
                    {seat}                    
                </td>) }
            </tr>
          )}
        </tbody>
      </table>
      )
  }
}

class Seat extends Component {  
  state={
    seatDataFetched: false,
    view: null,
    ticketPrice: null
  } 
  componentDidMount(){
    this.getTicketData();
  }
  getTicketData=async()=>{
    const isOnSale = await this.props.eventInstance.methods.ticketIsOnSale(this.props.ticketId).call();
    if(!isOnSale)
      this.state.view= 
        <Button enabled ={false}>
          <p>{this.props.description}</p>
          <p>not on sale</p>
        </Button>
    else{
      this.state.ticketPrice = await this.props.eventInstance.methods.getTicketPrice(this.props.ticketId).call()
      const price = web3Handler.utils.fromWei(this.state.ticketPrice.toString(),"ether");
      this.state.view= 
        <Button enabled ={true} positive onClick={this.onBuyClick}>
          <p>{this.props.description}</p>
          <p>{price} ETH</p>
        </Button>
    }
    this.setState({seatDataFetched: true})
  }

  onBuyClick=async()=>{
    console.log("Buying ticket for "+web3Handler.utils.fromWei(this.state.ticketPrice.toString(),"ether"))
    const currentAccount = (await web3Handler.eth.getAccounts())[0];
    await this.props.eventInstance.methods.buyTicket(this.props.ticketId).send({from:currentAccount, value: this.state.ticketPrice})
  }
  render() {    
    if (!this.state.seatDataFetched) return(<p>Loading</p>);
    else
      return(
        <div>
          {this.state.view}
        </div>
      )
  }
}

