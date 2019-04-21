pragma solidity ^0.5.2;
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import './Event.sol';

contract Tickets is ERC721{
    //description can be a row-seat combination or anything else
    struct Ticket{
        string description;
        address redeemedBy;
    }
    
    Event public ParentEvent;
    
    uint public numberOfTickets=0;
    uint256[] public TicketIds;
    mapping( uint256 => Ticket) public TicketData;
    uint256[] public RedeemedTickets;
    
    constructor(Event _eventAddress) public{
        ParentEvent = _eventAddress;
    }
    
    function addTicket(string memory _description) public{
        require(ParentEvent.released() == false,"Unable to add any tickets once the event is published");
        require(msg.sender == ParentEvent.organizer(), "Only event organizer may add tickets.");        
        uint256 ticketId = uint256(keccak256(abi.encode(ParentEvent,_description)));
        
        TicketData[ticketId] = Ticket(_description, address(0));
        TicketIds.push(ticketId);
        _mint(address(ParentEvent.organizer()), ticketId);
        numberOfTickets += 1;
    }
    
    function publishOnMarket(uint256 ticketId, uint price) public{
        require (ownerOf(ticketId) == msg.sender, "Only the owner can send a ticket");
        require (isRedeemed(ticketId) == false, "Used ticket cannot be sold");
        approve(address(ParentEvent), ticketId);
        ParentEvent.sellTicket(ticketId, price);
    }
    
    function cancelMarketPosition(uint256 ticketId) public{
        require (ownerOf(ticketId) == msg.sender, "Only the owner can send a ticket");
        approve(address(0), ticketId);
    }
    
    function isRedeemed(uint256 ticketId) view public returns(bool){
        return TicketData[ticketId].redeemedBy != address(0);
    }
    
    function redeem(uint256 ticketId) public {
        require(msg.sender == ownerOf(ticketId), "Only ticket owner can redeem the ticket");
        require(getApproved(ticketId) == address(0), "Ticket should not be published on market");        
        require (isRedeemed(ticketId) == false, "Same ticket can not be used twice");
        safeTransferFrom(msg.sender, address(ParentEvent), ticketId);
        TicketData[ticketId].redeemedBy = msg.sender;
        RedeemedTickets.push(ticketId);
    }
}