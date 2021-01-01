console.log("1");
require("file-loader?name=../index.html!../index.html");
console.log("2");
const Web3 = require("web3");
console.log("3");
const truffleContract = require("truffle-contract");
console.log("4");
const $ = require("jquery");
console.log("5");
// Not to forget our built contract
const metaCoinJson = require("../../build/contracts/MetaCoin.json");
// Supports Metamask, and other wallets that provide / inject 'web3'.
if (typeof web3 !== 'undefined') {
    // Use the Mist/wallet/Metamask provider.
    window.web3 = new Web3(web3.currentProvider);
} else {
    // Your preferred fallback.
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); 
}
const MetaCoin = truffleContract(metaCoinJson);
MetaCoin.setProvider(web3.currentProvider);
window.addEventListener('load', function() {
    return web3.eth.getAccounts()
        .then(accounts => {
            if (accounts.length == 0) {
                $("#balance").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[0];
            console.log("Account:", window.account);
            return web3.eth.net.getId();
        })
        .then(network => {
            console.log("Network:", network.toString(10));
            return MetaCoin.deployed();
        })
        .then(deployed => deployed.getBalance.call(window.account))
        // Notice how the conversion to a string is done only when displaying.
        .then(balance => $("#balance").html(balance.toString(10)))
        // Never let an error go unlogged.
        .catch(console.error);
});
