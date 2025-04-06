// In browsers, use a <script> tag. In Node.js, uncomment the following line:
const xrpl = require('xrpl')
const client = new xrpl.Client(WS_URL)
// Wrap code in an async function so we can use await
async function main() {

    const cold_wallet = xrpl.Wallet.fromSeed('sEdVCMGRi9X6EchueWewoks35z1Pijh') //rDPSgbrVQcBgVRC2o5yp8b4ACFJFEFeobb
    const hot_wallet = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE') // rL1hZDZ3fdNTkYH2s8Nrx5d4xgf5nNyH99
    const third_wallet = xrpl.Wallet.fromSeed('sEdVMHNVSLtqKsjkQUQbMaHQchXcyGe') // rGDz6TqCLDcJPj2e5SKDwTGxFavEsYszx1

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
    // Configure issuer (cold address) settings ----------------------------------
    

  
    



    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect()
}

main()