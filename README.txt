Following the steps on Module 6 > Webpack build for Web everything works good until ./node_modules/.bin/webpack-cli --mode development .

After all this code, putting some console.log on Javascript file app/js/app.js, I could see that the problem is on app.js on require("web3"):

On my test:

*************************************************************************** On website console (I used firefox)
1 app.js:1:9
2 app.js:3:9
Uncaught ReferenceError: process is not defined
    <anonymous> webpack://test21/./node_modules/util/util.js?:109
    js http://127.0.0.1:8000/js/app.js:4755
    __webpack_require__ http://127.0.0.1:8000/js/app.js:6365
    <anonymous> webpack://test21/./node_modules/web3/node_modules/web3-core-requestmanager/lib/index.js?:20
    js http://127.0.0.1:8000/js/app.js:5688
    __webpack_require__ http://127.0.0.1:8000/js/app.js:6365
    [...]
***************************************************************************

I'm texting here the steps (in a new folder):

$ npm init -y

$ npm install truffle --save-dev

$ ./node_modules/.bin/truffle unbox metacoin

$ mkdir -p app/js
$ touch app/js/app.js
$ npm install create-html --save-dev
$ ./node_modules/.bin/create-html --title "Transfer MetaCoins" --script "js/app.js" --output app/index.html

$ nano app/index.html

---------------------------------------------------------------------------
<!doctype html>
<html lang="en" dir="ltr">
<head>
<title>Transfer MetaCoins</title>
<meta charset="utf-8">

</head>
<body>
<div>You have <span id="balance">Loading...</span> MetaCoins</div>
<div>
    Send <input name="amount" type="number" placeholder="0" /> MetaCoins
    to <input name="recipient" type="text" placeholder="0x001122334455667788990011223344556>    <button id="send">Now</button>.
</div>
<div id="status"></div>
<script src="js/app.js"></script>

</body>
</html>
---------------------------------------------------------------------------

$ npm install web3 truffle-contract jquery --save

***************************************************************************
npm WARN deprecated truffle-contract@4.0.31: WARNING: This package has been renamed to @truffle/contract.
npm WARN deprecated truffle-interface-adapter@0.2.5: WARNING: This package has been renamed 
to @truffle/interface-adapter.
npm WARN deprecated mkdirp-promise@5.0.1: This package is broken and no longer maintained. 'mkdirp' itself supports promises now, please switch to that.
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated multicodec@0.5.7: stable api reached

> bufferutil@4.0.2 install /home/vagrant/test17/test20/node_modules/bufferutil
> node-gyp-build


> keccak@3.0.1 install /home/vagrant/test17/test20/node_modules/keccak
> node-gyp-build || exit 0


> secp256k1@4.0.2 install /home/vagrant/test17/test20/node_modules/secp256k1
> node-gyp-build || exit 0


> utf-8-validate@5.0.3 install /home/vagrant/test17/test20/node_modules/utf-8-validate
> node-gyp-build


> websocket@1.0.29 install /home/vagrant/test17/test20/node_modules/websocket
> (node-gyp rebuild 2> builderror.log) || (exit 0)

make: Entering directory '/home/vagrant/test17/test20/node_modules/websocket/build'
  CXX(target) Release/obj.target/bufferutil/src/bufferutil.o
make: Leaving directory '/home/vagrant/test17/test20/node_modules/websocket/build'
npm WARN test20@1.0.0 No description
npm WARN test20@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

+ jquery@3.5.1
+ truffle-contract@4.0.31
+ web3@1.3.1
added 440 packages from 349 contributors and audited 587 packages in 78.656s

65 packages are looking for funding
  run `npm fund` for details

found 12 vulnerabilities (3 low, 9 high)
  run `npm audit fix` to fix them, or `npm audit` for details
***************************************************************************
  
$ touch ./app/js/app.js
$ nano ./app/js/app.js

---------------------------------------------------------------------------
const Web3 = require("web3");
const truffleContract = require("truffle-contract");
const $ = require("jquery");
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
---------------------------------------------------------------------------

$ npm install webpack webpack-cli --save-dev

***************************************************************************
npm WARN test20@1.0.0 No description
npm WARN test20@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

+ webpack-cli@4.3.1
+ webpack@5.11.1
added 96 packages from 89 contributors and audited 683 packages in 12.965s

74 packages are looking for funding
  run `npm fund` for details

found 12 vulnerabilities (3 low, 9 high)
  run `npm audit fix` to fix them, or `npm audit` for details
  ***************************************************************************
  
$ ./node_modules/.bin/truffle compile
  
$ nano webpack.config.js

---------------------------------------------------------------------------
module.exports = {
    entry: "./app/js/app.js",
    output: {
        path: __dirname + "/build/app/js",
        filename: "app.js"
    },
    module: {
        rules: []
    }
};
---------------------------------------------------------------------------

$ nano package.json

*************************************************************************** (my package has this result)
{
  "name": "test20",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"     
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "create-html": "^4.1.0",
    "truffle": "^5.1.59",
    "webpack": "^5.11.1",
    "webpack-cli": "^4.3.1"
  },
  "dependencies": {
    "jquery": "^3.5.1",
    "truffle-contract": "^4.0.31",
    "web3": "^1.3.1"
  }
}
***************************************************************************

$ ./node_modules/.bin/webpack-cli --mode development

*************************************************************************** =================================== BIG ERROR STARTS HERE =============================
ERROR in ./node_modules/xhr2-cookies/dist/xml-http-request.js 
24:10-24
Module not found: Error: Can't resolve 'url' in '/home/vagrant/test21/node_modules/xhr2-cookies/dist'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
[...]
webpack 5.11.1 compiled with 25 errors and 1 warning in 4567 ms
***************************************************************************

$ npm install file-loader --save-dev

***************************************************************************
npm WARN test20@1.0.0 No description
npm WARN test20@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

+ file-loader@6.2.0
added 5 packages from 7 contributors and audited 688 packages 
in 6.996s

75 packages are looking for funding
  run `npm fund` for details

found 12 vulnerabilities (3 low, 9 high)
  run `npm audit fix` to fix them, or `npm audit` for details
  ***************************************************************************
  
$ nano app/js/app.js

--------------------------------------------------------------------------- (add first line)
require("file-loader?name=../index.html!../index.html");
const Web3 = require("web3");
const truffleContract = require("truffle-contract");
const $ = require("jquery");
// Not to forget our built contract
[...]
---------------------------------------------------------------------------

$ ./node_modules/.bin/webpack-cli --mode development 

***************************************************************************
ERROR in ./node_modules/xhr2-cookies/dist/xml-http-request.js 
21:11-26
Module not found: Error: Can't resolve 'http' in '/home/vagrant/test17/test20/node_modules/xhr2-cookies/dist'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
        - add a fallback 'resolve.fallback: { "http": require.resolve("stream-http") }'
        - install 'stream-http'
If you don't want to include a polyfill, you can use an empty 
module like this:
        resolve.fallback: { "http": false }
 @ ./node_modules/xhr2-cookies/dist/index.js 6:9-38
 @ ./node_modules/web3/node_modules/web3-providers-http/lib/index.js 25:11-49
 @ ./node_modules/web3/node_modules/web3-core-requestmanager/lib/index.js 46:18-48
 @ ./node_modules/web3/node_modules/web3-core/lib/index.js 22:23-58
 @ ./node_modules/web3/lib/index.js 29:11-31
 @ ./app/js/app.js 2:13-28

ERROR in ./node_modules/xhr2-cookies/dist/xml-http-request.js 
22:12-28
Module not found: Error: Can't resolve 'https' in '/home/vagrant/test17/test20/node_modules/xhr2-cookies/dist'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
        - add a fallback 'resolve.fallback: { "https": require.resolve("https-browserify") }'
        - install 'https-browserify'
If you don't want to include a polyfill, you can use an empty 
module like this:
        resolve.fallback: { "https": false }
 @ ./node_modules/xhr2-cookies/dist/index.js 6:9-38
 @ ./node_modules/web3/node_modules/web3-providers-http/lib/index.js 25:11-49
 @ ./node_modules/web3/node_modules/web3-core-requestmanager/lib/index.js 46:18-48
 @ ./node_modules/web3/node_modules/web3-core/lib/index.js 22:23-58
 @ ./node_modules/web3/lib/index.js 29:11-31
 @ ./app/js/app.js 2:13-28

ERROR in ./node_modules/xhr2-cookies/dist/xml-http-request.js 
23:9-22
Module not found: Error: Can't resolve 'os' in '/home/vagrant/test17/test20/node_modules/xhr2-cookies/dist'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
        - add a fallback 'resolve.fallback: { "os": require.resolve("os-browserify/browser") }'
        - install 'os-browserify'
If you don't want to include a polyfill, you can use an empty 
module like this:
        resolve.fallback: { "os": false }
 @ ./node_modules/xhr2-cookies/dist/index.js 6:9-38
 @ ./node_modules/web3/node_modules/web3-providers-http/lib/index.js 25:11-49
 @ ./node_modules/web3/node_modules/web3-core-requestmanager/lib/index.js 46:18-48
 @ ./node_modules/web3/node_modules/web3-core/lib/index.js 22:23-58
 @ ./node_modules/web3/lib/index.js 29:11-31
 @ ./app/js/app.js 2:13-28

ERROR in ./node_modules/xhr2-cookies/dist/xml-http-request.js 
24:10-24
Module not found: Error: Can't resolve 'url' in '/home/vagrant/test17/test20/node_modules/xhr2-cookies/dist'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to:
        - add a fallback 'resolve.fallback: { "url": require.resolve("url/") }'
        - install 'url'
If you don't want to include a polyfill, you can use an empty 
module like this:
        resolve.fallback: { "url": false }
 @ ./node_modules/xhr2-cookies/dist/index.js 6:9-38
 @ ./node_modules/web3/node_modules/web3-providers-http/lib/index.js 25:11-49
 @ ./node_modules/web3/node_modules/web3-core-requestmanager/lib/index.js 46:18-48
 @ ./node_modules/web3/node_modules/web3-core/lib/index.js 22:23-58
 @ ./node_modules/web3/lib/index.js 29:11-31
 @ ./app/js/app.js 2:13-28

webpack 5.11.1 compiled with 25 errors and 1 warning in 5801 ms
[...]
***************************************************************************

 ##### In a new terminal #####
 
 $ npx http-server ./build/app/ -a 0.0.0.0 -p 8000 -c-1

***************************************************************************
Starting up http-server, serving ./dist/
Available on:
  http://127.0.0.1:8000      
  http://10.0.2.15:8000      
  http://172.28.128.3:8000   
Hit CTRL-C to stop the server
***************************************************************************

$ nano truffle-config.js

---------------------------------------------------------------------------
module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 500000 // Or any higher value that you deem necessary
        }
    }
};
---------------------------------------------------------------------------
##### In a new terminal #####
 
 $ ganache-cli --host 0.0.0.0

#### In the precious terminal ####

$ ./node_modules/.bin/truffle migrate

$ ./node_modules/.bin/webpack-cli --mode development
############################################################################################################# MY TEST

app.js:

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
