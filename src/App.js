import React, { Component } from "react";
import { Menu , Container } from 'semantic-ui-react';

import CreateEvent from "./CreateEvent";
import MyTickets from './MyTickets';
import EventList from './EventList';

class App extends Component {
    state = {
        activeItem: "eventlist"
      };
    
      handleMenuClick = (e, { name }) => this.setState({ activeItem: name })
      
      

      render() {
        const { activeItem } = this.state

        let body = null;
        if(activeItem==='createEvent')
          body=<CreateEvent />
        else if(activeItem==='eventlist')
          body = <EventList/>
        else if(activeItem==='mytickets')
          body = <MyTickets/>
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
            {body}         
          </Container>
        </Container>
        );
      }
}

export default App;