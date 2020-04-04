let Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider);
const approvalABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];

$(() => {

    web3.eth.requestAccounts().then((accounts) => {
        init(accounts[0]);
    }).catch((err) => {
        console.log(err);
        // some web3 objects don't have requestAccounts
        ethereum.enable().then((accounts) => {
            init(accounts[0]);
        }).catch((err) => {
            alert(e + err);
        });
    });

    function init(address) {
        web3.eth.getChainId().then((chainId) => {
            return chainId;
        }).then((chainId) => {
            $("#yourAddress").val(address);
            let contractObj = getContractObject(chainId);
            setBalances(address, contractObj);
            setOnClickActions(address, contractObj);
        }).catch((err) => {
            throw err;
        });
    }

    function setOnClickActions(address, contract) {
        $("#wrapButton").onclick(function() {
            let amount = web3.utils.toWei($("#wrapAmount").val());
            triggerWrap(amount, address, contract);
        });
        $("#unWrapButton").onclick(function() {
            let amount = web3.utils.toWei($("#unwrapAmount").val());
            triggerUnWrap(amount, address, contract);
        });
    }

    function getContractObject(chainId) {
        let contract = getContractByChainId(chainId);
        return new web3.eth.Contract(approvalABI, contract);
    }

    function getContractByChainId(chainId) {
        switch (chainId) {
            case 1:
                return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
            case 3:
                return "0x0a180a76e4466bf68a7f86fb029bed3cccfaaac5";
            case 4:
                return "0xc778417e063141139fce010982780140aa0cd5ab";
            case 42:
                return "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
            default:
                alert("network not supported!");
                return "";
        }
    }

    function triggerWrap(amount, address, contract) {
        contract.methods.deposit().send({ from: address, value: web3.utils.toWei(amount) }).then((receipt) => {
            alert("success: " + JSON.stringify(receipt));
        }).catch((err) => {
            alert("failed: " + JSON.stringify(err));
        });
    }

    function triggerUnWrap(amount, address, contract) {
        contract.methods.withdraw(web3.utils.toWei(amount)).send({ from: address }).then((receipt) => {
            alert("success: " + JSON.stringify(receipt));
        }).catch((err) => {
            alert("failed: " + JSON.stringify(err));
        });
    }

    function setBalances(address, contract) {
        setEthBalance(address);
        setWethBalance(address, contract);
    }

    function setWethBalance(address, contract) {
        contract.methods.balanceOf(address).call().then(function(balance) {
            $("#yourEthBalance").val(balance / 1e18 + "WETH");
        }).catch(function (err) {
            alert(err);
        })
    }

    function setEthBalance(address) {
        web3.eth.getBalance(address).then(function(balance) {
            $("#yourEthBalance").val(balance / 1e18 + "ETH");
        }).catch(function(err) {
            alert(err);
        });
    }

    function getQuery(chainId, address) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=txlist&address=" + address;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=txlist&address=" + address;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=txlist&address=" + address;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=txlist&address=" + address;
            default:
                return "";
        }
    }

    function getEtherScanPage(chainId) {
        switch (chainId) {
            case 1:
                return "https://etherscan.io/address/";
            case 3:
                return "https://ropsten.etherscan.io/address/";
            case 4:
                return "https://rinkeby.etherscan.io/address/";
            case 42:
                return "https://kovan.etherscan.io/address/";
            default:
                return "";
        }
    }

});

