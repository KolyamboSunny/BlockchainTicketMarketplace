pragma solidity ^0.5.2;

import './Tickets.sol';

contract Event{
    string public eventName;
    
    bool public released = false;
    modifier eventReleased() {
        require(released == true,"Event has not yet been released");
        _;
    }
    modifier isOrganizer() {
        require(msg.sender == organizer || msg.sender == organizer_contract ,"Only event organizer allowed to do that");
        _;
    }
    modifier ticketOnSale(uint256 ticketId) {
        require(ticketIsOnSale(ticketId) == true,"Ticket is not on sale.");
        _;
    }
    
    Tickets public ticketStorage;
    mapping(uint256 => uint256) TicketPrices;
    
    address public organizer;
    address public organizer_contract;
    mapping(address => uint256) Balances;
    
    constructor (string memory _eventName, address _organizer) public{
        eventName = _eventName;
        organizer = _organizer;
        organizer_contract = msg.sender;
    }
    function linkTicketPool(address _ticketStorage) isOrganizer public{
        require(address(ticketStorage)==address(0), "Ticket storage was already linked.");
        ticketStorage = Tickets(_ticketStorage);
    }
    
    function release() isOrganizer public {
        require(released == false,"Event has already been released.");
        released = true;
    }
    
    
    function sellTicket(uint256 ticketId, uint256 price) eventReleased public{
        require(ticketIsOnSale(ticketId),"Contract does not have rights to sell a ticket");
        TicketPrices[ticketId] = price;
    }
    
    function ticketIsOnSale(uint256 ticketId) view public returns(bool){
        Tickets tickets = Tickets(ticketStorage);
        return tickets.getApproved(ticketId)==address(this);
    }
    function getTicketPrice(uint256 ticketId) view public ticketOnSale(ticketId) returns(uint256){                
        return TicketPrices[ticketId];
    }
    
    function buyTicket(uint256 ticketId) payable eventReleased ticketOnSale(ticketId) public{
        require( TicketPrices[ticketId] <= msg.value, "Not enough money.");
        //make the ticket owner address payable
        Tickets tickets = Tickets(ticketStorage);
        address seller = tickets.ownerOf(ticketId);
        Balances[seller] = msg.value;
        tickets.safeTransferFrom(seller, msg.sender, ticketId);
    }
    
    function getMyBalance() view public returns(uint256){
        return Balances[msg.sender];
    }
    
    function withdraw() public {
        uint256 toTransfer = Balances[msg.sender];
        Balances[msg.sender] =0;
        msg.sender.transfer(toTransfer);
    }
    
}

