import React, { Component } from "react";
import { Container, Form, Icon, Input, Button, Label } from "semantic-ui-react";
import web3Handler from "./web3";

import { getTicketsInstance} from "./EventManager";

export default class EventEdit extends Component {
  
  state = {
    contractDataFetched: false,
    eventContract: null,

    eventName:"NONAME",
    prevRows:0,
    prevSeats:0,
    numRows:0,
    numSeats:0,
    viewer: null
  };
 
  componentDidMount(){
    this.getContractData();
  }

  getContractData = async()=>{
    var compiledContract = require("./build/contracts/Event.json");   
    const EventInstance = await new web3Handler.eth.Contract(compiledContract.abi, this.props.eventContractAddress);
    this.setState({eventContract: EventInstance});

    const eventName = await this.state.eventContract.methods.eventName().call();

    this.setState({eventName: eventName});

    this.setState({contractDataFetched: true});
  }

  getSeatViever=()=>{    
    if (this.state.numRows>0&& this.state.numSeats>0){
      this.setState({ prevSeats: this.state.numSeats, prevRows: this.state.numRows});
      this.state.viewer =
        <div>
          <SeatRowViewer numRows={this.state.numRows} numSeats={this.state.numSeats}/>
          <Button primary type="submit" loading={this.state.loading} onClick={e => this.createTickets()}>
            <Icon name="check" />
            Create tickets and publish event
          </Button>          
        </div>
      
    }
    else
      return null;
  }
  createTickets=async()=>{  
    console.log("Creating tickets: "+this.state.numRows+","+this.state.numSeats)
    const currentAccount = (await web3Handler.eth.getAccounts())[0];
    const ticketAddress = await this.state.eventContract.methods.ticketStorage().call();
    console.log("Tickets address: "+ticketAddress)
    const TicketInstance = getTicketsInstance(ticketAddress);
    await TicketInstance.methods.createDefaultTickets(this.state.numRows,this.state.numSeats).send({gas: "6721974",from:currentAccount});
    console.log("Tickets created")
    await this.state.eventContract.methods.release().send({gas: "6721974",from:currentAccount});
  }
  render() {
    if(this.state.eventContract==null) return (<h1>Loading event {this.props.eventContractAddress} data...</h1>);
    return (
      <Container>
        <h1>{this.state.eventName}</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <Input label="Number of Rows" onChange={event => {
                this.setState({ numRows: event.target.value});
                this.setState({viewer: this.getSeatViever()});
              }}/>
            </Form.Field>
            <Form.Field>
              <Input label="Seats per Row" onChange={event => {

                this.setState({ numSeats: event.target.value});
                this.setState({viewer: this.getSeatViever()});
              }}/>
            </Form.Field>                 
            {this.state.numRows!=this.state.prevRows || this.state.numSeats!=this.state.prevSeats ? this.getSeatViever():this.state.viewer}
          </Form>
      </Container>
    );      
  }
}
class SeatRowViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seats: [[]]
    }
    
    for(var rowId =1;rowId<=this.props.numRows;rowId++){
      let row=[]
      for(var seatId =1;seatId<=this.props.numSeats;seatId++){
        row.push("row "+ rowId+" seat "+seatId)        
      }
      this.state.seats.push(row)
    }
  }
  render() {
    return (
      <Container>        
        <SeatGrid 
          seats = { this.state.seats }
        />
      </Container>
    )
  }
}

class SeatGrid extends React.Component {
  render() {
    console.log(this.props.seats)
    return (
       <div>
        <h2></h2>
        <table border ="1">
          <tbody>
            {this.props.seats.map( row =>
              <tr>
                { row.map( seat =>
                  <td >
                    <Icon name="square full"/>
                    <Label>{seat}</Label>
                    
                  </td>) }
              </tr>
            )}
          </tbody>
        </table>
       </div>
    )
  }
}

