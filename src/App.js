import './App.css';
import Web3 from 'web3';
import Transaction from './contract/abis/Transaction.json';
import { useState, useEffect, createRef } from 'react';

function App() {
  let textInput = createRef();
  const [account, setAccount] = useState('');
  const [transactionContract, setTransactionContract] = useState(null);

  useEffect(() => {
    async function setupWeb3() {
      await loadWeb3();
      await loadBlockchainData();
    }
    setupWeb3()
  });

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Transaction.networks[networkId];
    if (networkData) {
      const transactionContract = new web3.eth.Contract(Transaction.abi, networkData.address);
      setTransactionContract(transactionContract);
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }

  }

  function sendEtherAndGetItBack() {
    const web3 = window.web3;
    transactionContract.methods.sendEtherAndGetItBack(account)
      .send({ from: account, value: web3.utils.toWei(textInput.current.value, 'Ether') })
  }

  return (
    <div>
      <input ref={textInput} placeholder="Type how much ether to send" />
      <button onClick={sendEtherAndGetItBack}>Send</button>
    </div>
  );
}

export default App;
