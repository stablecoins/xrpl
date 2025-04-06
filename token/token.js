// In browsers, use a <script> tag. In Node.js, uncomment the following line:
const xrpl = require('xrpl')

// Wrap code in an async function so we can use await
async function main() {

    const cold_wallet = xrpl.Wallet.fromSeed('sEdVCMGRi9X6EchueWewoks35z1Pijh') //rDPSgbrVQcBgVRC2o5yp8b4ACFJFEFeobb
    const hot_wallet = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE') // rL1hZDZ3fdNTkYH2s8Nrx5d4xgf5nNyH99
    const third_wallet = xrpl.Wallet.fromSeed('sEdVMHNVSLtqKsjkQUQbMaHQchXcyGe') // rGDz6TqCLDcJPj2e5SKDwTGxFavEsYszx1

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
            xrpl.AccountSetTfFlags.tfOptionalDestTag)
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


      // Create trust line from hot to cold address --------------------------------
  const currency_code = "FOO"
  const trust_set_tx = {
    "TransactionType": "TrustSet",
    "Account": hot_wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared = await client.autofill(trust_set_tx)
  const ts_signed = hot_wallet.sign(ts_prepared)
  console.log("Creating trust line from hot address to issuer...")
  const ts_result = await client.submitAndWait(ts_signed.tx_blob)
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
  }

    // Create trust line from hot_wallet to cold address --------------------------------
  const trust_set_tx2 = {
    "TransactionType": "TrustSet",
    "Account": hot_wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared2 = await client.autofill(trust_set_tx2)
  const ts_signed2 = hot_wallet.sign(ts_prepared2)
  console.log("Creating trust line from hot_wallet address to issuer...")
  const ts_result2 = await client.submitAndWait(ts_signed2.tx_blob)
  if (ts_result2.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed2.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result2.result.meta.TransactionResult}`
  }


  const trust_set_tx3 = {
    "TransactionType": "TrustSet",
    "Account": third_wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": cold_wallet.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }

  const ts_prepared3 = await client.autofill(trust_set_tx3)
  const ts_signed3 = third_wallet.sign(ts_prepared3)
  console.log("Creating trust line from customer_two address to issuer...")
  const ts_result3 = await client.submitAndWait(ts_signed3.tx_blob)
  if (ts_result3.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed3.hash}`)
  } else {
    throw `Error sending transaction: ${ts_result3.result.meta.TransactionResult}`
  }


    // Send token cold to hot ----------------------------------------------------------------
    let issue_quantity = "3800"

    let send_token_tx = {
      "TransactionType": "Payment",
      "Account": cold_wallet.address,
      "DeliverMax": {
        "currency": currency_code,
        "value": issue_quantity,
        "issuer": cold_wallet.address
      },
      "Destination": hot_wallet.address,
      "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                          // on the hot account earlier.
    }
  
    let pay_prepared = await client.autofill(send_token_tx)
    let pay_signed = cold_wallet.sign(pay_prepared)
    console.log(`Cold to hot - Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
    let pay_result = await client.submitAndWait(pay_signed.tx_blob)
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
    } else {
      console.log(pay_result)
      throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
    }
    
    // Send token hot to client----------------------------------------------------------------
    issue_quantity = "2"
    
    send_token_tx = {
      "TransactionType": "Payment",
      "Account": hot_wallet.address,
      "DeliverMax": {
        "currency": currency_code,
        "value": issue_quantity,
        "issuer": cold_wallet.address
      },
      "Destination": third_wallet.address,
      "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                          // on the hot account earlier.
    }
  
    pay_prepared = await client.autofill(send_token_tx)
    pay_signed = hot_wallet.sign(pay_prepared)
    console.log(`hot to client - Sending ${issue_quantity} ${currency_code} to ${third_wallet.address}...`)
    pay_result = await client.submitAndWait(pay_signed.tx_blob)
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
    } else {
      console.log(pay_result)
      throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
    }


    const latestLedger = await client.getLedgerIndex();
    const RLUSD_ISSUER = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV"
    let offer_token_tx = {
        "TransactionType": "OfferCreate",
        "LastLedgerSequence" : latestLedger + 10,
        "Account": third_wallet.address,
        "TakerPays": {
          "currency": currency_code,
          "value": "1",
          "issuer": cold_wallet.address
        },
        "TakerGets": {
          "currency": "USD",
          "value": "1",
          "issuer": RLUSD_ISSUER
        },
        //"Destination": third_wallet.address,
        //"DestinationTag": 1 // Needed since we enabled Require Destination Tags
                            // on the hot account earlier.
      }
      
      let swap_prepared = await client.autofill(offer_token_tx)
    let taker_signed = third_wallet.sign(swap_prepared)
    console.log(`Cold to hot - Sending 1 ${currency_code} to ${third_wallet.address}... for 1 RLUSD`)
    let offer_result = await client.submitAndWait(taker_signed.tx_blob)
    if (offer_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${taker_signed.hash}`)
    } else {
      console.log(offer_result)
      throw `Error sending transaction: ${offer_result.result.meta.TransactionResult}`
    }


     offer_token_tx = {
        "TransactionType": "OfferCreate",
        "Account": hot_wallet.address,
        "TakerPays": {
          "currency": "USD",
          "value": "1",
          "issuer": RLUSD_ISSUER
        },
        "TakerGets": {
          "currency": currency_code,
          "value": "1",
          "issuer": cold_wallet.address
        },
        
        //"Destination": third_wallet.address,
        //"DestinationTag": 1 // Needed since we enabled Require Destination Tags
                            // on the hot account earlier.
      }
      
       swap_prepared = await client.autofill(offer_token_tx)
     taker_signed = hot_wallet.sign(swap_prepared)
    console.log(`hot to anyone - Sending 1 ${currency_code} to ${hot_wallet.address}... for 1 RLUSD`)
     offer_result = await client.submitAndWait(taker_signed.tx_blob)
    if (offer_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${taker_signed.hash}`)
    } else {
      console.log(offer_result)
      throw `Error sending transaction: ${offer_result.result.meta.TransactionResult}`
    }

    //issue_quantity = "100"
    //const send_token_tx2 = {
    //  "TransactionType": "Payment",
    //  "Account": hot_wallet.address,
    //  "DeliverMax": {
    //    "currency": currency_code,
    //    "value": issue_quantity,
    //    "issuer": cold_wallet.address
    //  },
    //  "Destination": hot_wallet.address,
    //  "DestinationTag": 1 // Needed since we enabled Require Destination Tags
    //                      // on the hot account earlier.
    //}
  //
    //const pay_prepared2 = await client.autofill(send_token_tx2)
    //const pay_signed2 = hot_wallet.sign(pay_prepared2)
    //console.log(`Hot to customer_one - Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
    //const pay_result2 = await client.submitAndWait(pay_signed2.tx_blob)
    //if (pay_result2.result.meta.TransactionResult == "tesSUCCESS") {
    //  console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed2.hash}`)
    //} else {
    //  console.log(pay_result2)
    //  throw `Error sending transaction: ${pay_result2.result.meta.TransactionResult}`
    //}
  //
  //
    //issue_quantity = "12"
    //const send_token_tx3 = {
    //  "TransactionType": "Payment",
    //  "Account": hot_wallet.address,
    //  "DeliverMax": {
    //    "currency": currency_code,
    //    "value": 1,
    //    "issuer": cold_wallet.address
    //  },
    //  "Destination": third_wallet.address,
    //  "DestinationTag": 1 // Needed since we enabled Require Destination Tags
    //                      // on the hot account earlier.
    //}
  //
    //const pay_prepared3 = await client.autofill(send_token_tx3)
    //const pay_signed3 = hot_wallet.sign(pay_prepared3)
    //console.log(`Customer_one to customer_two - Sending ${issue_quantity} ${currency_code} to ${cold_wallet.address}...`)
    //const pay_result3 = await client.submitAndWait(pay_signed3.tx_blob)
    //if (pay_result3.result.meta.TransactionResult == "tesSUCCESS") {
    //  console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed3.hash}`)
    //} else {
    //  console.log(pay_result3)
    //  throw `Error sending transaction: ${pay_result3.result.meta.TransactionResult}`
    //}
  
  
    

  




    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect()
}

main()