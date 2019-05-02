import React, { Component } from "react";
import { Menu , Container } from 'semantic-ui-react';

import CreateEvent from "./CreateEvent";
import EventEdit from './EventEdit';
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
         // body=<EventEdit eventContractAddress="0xe7200EC658129cb25110ca7eDAe1e1E838c9e31F"/>
       // else if(activeItem==='eventlist')
        //body = activeItem

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
              name='upcomingEvents'
              active={activeItem === 'upcomingEvents'}
              onClick={this.handleMenuClick}
            >
              Upcoming Events
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