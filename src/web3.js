import Web3 from 'web3';

const web3Handler = new Web3(window.web3.currentProvider,null, {transactionConfirmationBlocks: 1});

export default web3Handler;