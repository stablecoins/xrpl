const xrpl = require('xrpl')

async function main() {
  // 1. Connect to the XRP Ledger Testnet
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  // 2. Import issuer and recipient wallets
  const issuer = xrpl.Wallet.fromSeed('sEdVCMGRi9X6EchueWewoks35z1Pijh')
  const recipient = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE')

  console.log("Issuer Address:", issuer.address)
  console.log("Recipient Address:", recipient.address)

  // 3. Disable "Require Destination Tag" for issuer
  const accountSetTx = {
    TransactionType: "AccountSet",
    Account: issuer.address,
    ClearFlag: xrpl.AccountSetAsfFlags.tfOptionalDestTag // = 1
  }

  const accountSetPrepared = await client.autofill(accountSetTx)
  const accountSetSigned = issuer.sign(accountSetPrepared)
  const accountSetResult = await client.submitAndWait(accountSetSigned.tx_blob)
  console.log("Disable RequireDestTag result:", accountSetResult.result.meta.TransactionResult)

  // 4. Recipient sets trust line to accept 'DBT' token from issuer
  const trustSetTx = {
    TransactionType: "TrustSet",
    Account: recipient.address,
    LimitAmount: {
      currency: "DBT", // 3-letter uppercase
      issuer: issuer.address,
      value: "1000000000"
    }
  }

  const trustSetPrepared = await client.autofill(trustSetTx)
  const trustSetSigned = recipient.sign(trustSetPrepared)
  const trustSetResult = await client.submitAndWait(trustSetSigned.tx_blob)
  console.log("TrustSet result:", trustSetResult.result.meta.TransactionResult)

  // 5. Issuer sends 1000 DBT to recipient (no DestinationTag required now)
  const paymentTx = {
    TransactionType: "Payment",
    Account: issuer.address,
    Destination: recipient.address,
    Amount: {
      currency: "DBT",
      issuer: issuer.address,
      value: "1000"
    }
  }

  const paymentPrepared = await client.autofill(paymentTx)
  const paymentSigned = issuer.sign(paymentPrepared)
  const paymentResult = await client.submitAndWait(paymentSigned.tx_blob)
  console.log("Payment result:", paymentResult.result.meta.TransactionResult)

  await client.disconnect()
}

main().catch(console.error)
