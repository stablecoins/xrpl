const xrpl = require("xrpl")

// 1. Connexion au XRPL Testnet
const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

async function main() {
  await client.connect()

  // 2. Création de comptes test


  const issuer = xrpl.Wallet.fromSeed('sEdVCMGRi9X6EchueWewoks35z1Pijh')
  const borrower = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE')
  

  //const fund_wallet = await client.fundWallet()

  //console.log("Investisseur:", fund_wallet.wallet.address)
  console.log("Emprunteur :", borrower.address)
  console.log("Émetteur USDC:",issuer.address)

  const USDC = {
    currency: "DEBT",
    issuer: issuer.address,
  }

  const trust_tx = await client.submitAndWait({
    TransactionType: "TrustSet",
    Account: borrower.address,
    LimitAmount: {
      ...USDC,
      value: "50000",  // Autorise jusqu'à 50K USDC
    },
  }, { wallet: borrower })

  const send_usdc = await client.submitAndWait({
    TransactionType: "Payment",
    Account: issuer.address,
    Destination: borrower.address,
    Amount: {
      ...USDC,
      value: "10000"
    },
  }, { wallet: issuer })

  console.log("10 000 USDC envoyés")

  const six_months = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30 * 6)
  
  /*
  const escrow_tx = await client.submitAndWait({
    TransactionType: "EscrowCreate",
    Account: borrower.wallet.address,
    Destination: fund_wallet.wallet.address,
    Amount: "10500",
    FinishAfter: six_months,
  }, { wallet: borrower.wallet })
  */

  console.log("Escrow de remboursement créé pour 6 mois plus tard")

  await client.disconnect()
}

main()
