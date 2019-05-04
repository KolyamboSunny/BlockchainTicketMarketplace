
pragma solidity ^0.5.2;

import './Tickets.sol';
import './Event.sol';

contract EventManager{
    


    Event[] public eventList;
    mapping(address => Event[]) public userEvents;
    mapping(address => int) public numUserEvents;
    uint public numberOfEvents=0;
        

    function addEvent(string memory eventName) public {
        Event newEvent = new Event(eventName, msg.sender);
        Tickets ticketPool = new Tickets(newEvent);
        newEvent.linkTicketPool(address(ticketPool));
        eventList.push(newEvent);
        numberOfEvents+=1;
    }
    
}

