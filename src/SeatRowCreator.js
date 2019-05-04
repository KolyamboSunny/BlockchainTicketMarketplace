import React, { Component } from "react";
import { Input } from "semantic-ui-react";
import web3Handler from "./web3";

export default class SeatRowCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seats: [[]],
      tickets:[]
    }
    
    for(var rowId =1;rowId<=this.props.numRows;rowId++){
      let row=[]
      for(var seatId =1;seatId<=this.props.numSeats;seatId++){
        row.push("row "+ rowId+" seat "+seatId)        
      }
      this.state.seats.push(row)
    }
  }
  

  getRowOfSeats=(rowId)=>{
    let seats = []
    for (var seatId=0;seatId<this.props.numRows;seatId++)
      seats.push()
      
  };
  
  onPriceChange(seat) {
    if(this.state.tickets.indexOf(seat) > -1 ) {
      this.setState({
        seatAvailable: this.state.seatAvailable.concat(seat),
        seatReserved: this.state.seatReserved.filter(res => res != seat)
      })
    } else {
      this.setState({
        seatReserved: this.state.seatReserved.concat(seat),
        seatAvailable: this.state.seatAvailable.filter(res => res != seat)
      })
    }
  }
  
  render() {
    return (
      <div>
        <h1>Seat Reservation System</h1>
        <SeatGrid 
          seats = { this.state.seats }
          available = { this.state.seatAvailable }
          reserved = { this.state.seatReserved }
          onPriceChange = { this.onPriceChange.bind(this) }
          />
      </div>
    )
  }
}

class SeatGrid extends React.Component {
  render() {
    console.log(this.props.seats)
    return (
       <div>
        <h2></h2>
        <table>
          <tbody>
            {this.props.seats.map( row =>
              <tr>
                { row.map( seat =>
                  <td >
                    <Input placeholder="1 ETH" key={seat} label ={seat} onChange = {e => this.onPriceChange(seat)}></Input>
                    
                  </td>) }
              </tr>
            )}
          </tbody>
        </table>
       </div>
    )
  }
  
  onClickSeat(seat) {
    this.props.onClickData(seat);
  }
}

