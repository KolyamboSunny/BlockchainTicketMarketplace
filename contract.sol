pragma solidity ^0.5.2;

import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';

contract Event is ERC721{
    string public eventName;
    address payable public organizer;
    
    struct Ticket{
        string eventName;
        
        //description can be a row-seat combination or anything else
        string description;
        
        uint256 currentPrice;
        bool redeemed;   
        bool onSale;
    }
    
    modifier onlyOrganizer() {
        require(msg.sender == organizer);
        _;
    }
    modifier ticketExists(uint256 ticketId) {
        require(_exists(ticketId) == true,"The specified ticket does not exist");
        _;
    }
    
    bool public released = false;
    mapping(uint256 => Ticket) public Tickets;
    uint256[] public TicketIds;
    
    constructor (string memory eventNameArg) public{
        eventName = eventNameArg;
        organizer = msg.sender;
    }
    
    function addTicket(string memory description, uint256 price ) public onlyOrganizer{
        require (released == false);
        require (msg.sender == organizer);
        uint256 ticketId = uint256(keccak256(abi.encode(description)));
        _mint(organizer,ticketId);
        Tickets[ticketId] = Ticket(eventName, description,price, false, true);
        TicketIds.push(ticketId);
    }
    
    function release() public onlyOrganizer{
        require (released == false);
        require (msg.sender == organizer);
        
        released = true;
    }
    
    function setPrice(uint256 ticketId, uint256 newPrice) ticketExists(ticketId) public {
        require (ownerOf(ticketId) == msg.sender, "Only the owner may change the ticket price");
        require( Tickets[ticketId].redeemed == false, "This ticket has already been used");
        
        Tickets[ticketId].currentPrice = newPrice;
        Tickets[ticketId].onSale = true;
    }
    
    function buyTicket(uint256 ticketId) payable ticketExists(ticketId) public{
        Ticket memory ticket =  Tickets[ticketId];
        require( ticket.onSale == true,"This ticket is not on sale");
        require( ticket.currentPrice <= msg.value, "Not enough money.");
        //make the ticket owner address payable
        address payable seller = address(uint160(ownerOf(ticketId)));
        //if could not the money to seller, give them to organizer
        bool transactionSuccessful = seller.send(msg.value);
        if(transactionSuccessful==false)
            organizer.send(msg.value);
        safeTransferFrom(seller, msg.sender, ticketId);
    }
}