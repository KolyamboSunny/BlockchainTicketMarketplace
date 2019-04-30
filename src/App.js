import React, { Component } from "react";
import { Menu , Container } from 'semantic-ui-react';
import CreateEvent from "./CreateEvent";

class App extends Component {
    state = {
        
      };
    
      handleMenuClick = (e, { name }) => this.setState({ activeItem: name })
      
      

      render() {
        const { activeItem } = this.state
        let body = null;
        if(activeItem==='createEvent')
          body=<CreateEvent />
        else
          body = activeItem
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
              name='reviews' 
              active={activeItem === 'reviews'} 
              onClick={this.handleMenuClick}>

              Reviews
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