const address = ""

const abi = [
    {
      "constant": true,
      "inputs": [],
      "name": "organizer",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x61203265"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "eventName",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x8043c9c0"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "released",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x96132521"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "ticketStorage",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0xa1b9f7b7"
    },
    {
      "inputs": [
        {
          "name": "_eventName",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_ticketStorage",
          "type": "address"
        }
      ],
      "name": "linkTicketPool",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xcb4d2178"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "release",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x86d1a69f"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "ticketId",
          "type": "uint256"
        },
        {
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "sellTicket",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x2a6c4c14"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "ticketId",
          "type": "uint256"
        }
      ],
      "name": "ticketIsOnSale",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x6777c5f2"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "ticketId",
          "type": "uint256"
        }
      ],
      "name": "buyTicket",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function",
      "signature": "0x67dd74ca"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "ticketId",
          "type": "uint256"
        }
      ],
      "name": "getMyBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x24cc8555"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x3ccfd60b"
    }
  ]

export default new web3.eth.Contract(abi, address);