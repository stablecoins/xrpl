const xrpl = require('xrpl')

//this is the multisig for treasury DAO``
const signer1 = xrpl.Wallet.fromSeed('sEdVCMGRi9X6EchueWewoks35z1Pijh') //rDPSgbrVQcBgVRC2o5yp8b4ACFJFEFeobb
const signer2 = xrpl.Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE') // rL1hZDZ3fdNTkYH2s8Nrx5d4xgf5nNyH99

async function main() {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    // 1. Create wallets (or use existing ones)
    const multisigWallet = (await client.fundWallet()).wallet

    console.log('Primary:', multisigWallet.address)
    console.log('Signer 1:', signer1.address)
    console.log('Signer 2:', signer2.address)

    // 2. Set up SignerList with quorum = 2
    const signerListTx = {
        TransactionType: "SignerListSet",
        Account: multisigWallet.address,
        SignerQuorum: 2,
        SignerEntries: [
            {
                SignerEntry: {
                    Account: signer1.address,
                    SignerWeight: 1
                }
            },
            {
                SignerEntry: {
                    Account: signer2.address,
                    SignerWeight: 1
                }
            }
        ]
    }

    const prepared = await client.autofill(signerListTx)
    const signed = multisigWallet.sign(prepared)
    const result = await client.submitAndWait(signed.tx_blob)
    console.log("SignerListSet Result:", result.result.meta.TransactionResult)

    // 3. Create a payment from primary wallet (but use multisig)
    const tx = {
        TransactionType: "Payment",
        Account: multisigWallet.address,
        Destination: xrpl.Wallet.generate().address,
        Amount: "1000000", // 1 XRP in drops
        SigningPubKey: "" // Must be empty for multisigned
    }

    const filledTx = await client.autofill(tx)

    // Each signer signs
    const signed1 = signer1.sign(filledTx, true) // true = multisign
    const signed2 = signer2.sign(filledTx, true)

    // Combine signatures
    const combined = xrpl.combine([signed1.signedTransaction, signed2.signedTransaction])

    // Submit multisigned transaction
    const multisigResult = await client.submitAndWait(combined.signedTransaction)
    console.log("Multisig Payment Result:", multisigResult.result.meta.TransactionResult)

    await client.disconnect()
}

main()
