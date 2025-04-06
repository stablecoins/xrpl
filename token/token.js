// In browsers, use a <script> tag. In Node.js, uncomment the following line:
const xrpl = require('xrpl')

// Wrap code in an async function so we can use await
async function main() {

    const cold_wallet = xrpl.Wallet.fromSeed('sEdVCMGRi9X6EchueWewoks35z1Pijh')
    const hot_wallet = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE')

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
    // Configure issuer (cold address) settings ----------------------------------
    const cold_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": cold_wallet.address,
        "TransferRate": 0,
        "RequireAuth": false,
        "TickSize": 5,
        "Domain": "737461626C65636F696E2E6F7267", // "stablecoin.org"
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
        // Using tf flags, we can enable more flags in one transaction
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
            xrpl.AccountSetTfFlags.tfRequireDestTag)
    }
    const cst_prepared = await client.autofill(cold_settings_tx)
    const cst_signed = cold_wallet.sign(cst_prepared)
    console.log("Sending cold address AccountSet transaction...")
    const cst_result = await client.submitAndWait(cst_signed.tx_blob)
    if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${cst_result}`
    }
    // Configure hot address settings --------------------------------------------
    const hot_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": hot_wallet.address,
        "Domain": "737461626C65636F696E2E6F7267", // "stablecoin.org"
        // enable Require Auth so we can't use trust lines that users
        // make to the hot address, even by accident:
        "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
            xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const hst_prepared = await client.autofill(hot_settings_tx)
    const hst_signed = hot_wallet.sign(hst_prepared)
    console.log("Sending hot address AccountSet transaction...")
    const hst_result = await client.submitAndWait(hst_signed.tx_blob)
    if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`
    }







    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect()
}

main()