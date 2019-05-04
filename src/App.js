import React, { Component } from "react";
import { Menu , Container } from 'semantic-ui-react';

import CreateEvent from "./CreateEvent";
import MyTickets from './MyTickets';
import EventList from './EventList';
import BuyTickets from './BuyTickets';

class App extends Component {
    state = {
        activeItem: "eventlist",
        eventToBuy: "",
        body:[null]
      };
    
      handleMenuClick = (e, { name }) => this.setState({ activeItem: name})
      buyTickets =(eventAddress) => this.setState({activeItem:"buyTickets", eventToBuy: eventAddress })
      

      render() {
        const { activeItem } = this.state        
       
        if(activeItem==='createEvent')
          this.state.body[0]=<CreateEvent />
        else if(activeItem==='eventlist')
          this.state.body[0] = <EventList appBody={this.buyTickets}/>
        else if(activeItem==='mytickets')
          this.state.body[0] = <MyTickets/>
          else if(activeItem==='buyTickets')
          this.state.body[0] = <BuyTickets eventToBuy={this.state.eventToBuy}/>

        return (
            <Container>
          <Menu>
            <Menu.Item
              name='createEvent'
              active={activeItem === 'createEvent'}
              onClick={this.handleMenuClick}
            >
              Create Event
            </Menu.Item>
    
            <Menu.Item 
              name='eventlist' 
              active={activeItem === 'eventlist'} 
              onClick={this.handleMenuClick}>

              Event List
            </Menu.Item>
    
            <Menu.Item
              name='mytickets'
              active={activeItem === 'mytickets'}
              onClick={this.handleMenuClick}
            >
              My Tickets
            </Menu.Item>
          </Menu>
          <Container>
            {this.state.body[0]}         
          </Container>
        </Container>
        );
      }
}

export default App;