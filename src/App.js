import React, { Component } from "react";
import { Menu , Container } from 'semantic-ui-react';

import CreateEvent from "./CreateEvent";
import EventData from './EventData';

class App extends Component {
    state = {
        
      };
    
      handleMenuClick = (e, { name }) => this.setState({ activeItem: name })
      
      

      render() {
        const { activeItem } = this.state

        let body = null;
        if(activeItem==='createEvent')
          body=<CreateEvent />
        else if(activeItem==='eventlist')
          body=<EventData eventContractAddress="0xe7200EC658129cb25110ca7eDAe1e1E838c9e31F"/>
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

              View Event
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