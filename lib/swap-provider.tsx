"use client";

import { Client, OfferCreate, TrustSet, Wallet } from "xrpl";
import sdk from "@crossmarkio/sdk";
import { Dispatch, SetStateAction } from "react";

const client = new Client("wss://testnet.xrpl-labs.com/");
const cold_wallet = Wallet.fromSeed("sEdVCMGRi9X6EchueWewoks35z1Pijh"); //rDPSgbrVQcBgVRC2o5yp8b4ACFJFEFeobb

export const approve = async (callbackFn: Dispatch<SetStateAction<string>>) => {
  try {
    await client.connect();
    const address = localStorage.getItem("walletAddress");

    if (!address) throw Error("Wallet not connected");
    const trustSetTx: TrustSet = {
      TransactionType: "TrustSet",
      Account: address,
      LimitAmount: {
        currency: "DBT",
        issuer: cold_wallet.address,
        value: "100000",
      },
    }
    const trustSetPrepared = await client.autofill(trustSetTx)
    const tx_result = await sdk.methods.signAndSubmitAndWait(trustSetPrepared)
    console.log(tx_result);
    callbackFn(tx_result.response.data.resp.result.hash)
    return true;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.disconnect();
  }
};

export const swap = async (token: number, stablecoin: number) => {
  const address = localStorage.getItem("walletAddress");

  try {
    await client.connect();

    if (!address) throw Error("Wallet not connected");

    const RLUSD_ISSUER = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";
    let offer_token_tx: OfferCreate = {
      TransactionType: "OfferCreate",
      Account: address,
      TakerPays: {
        currency: "DBT",
        value: token.toString(),
        issuer: cold_wallet.address,
      },
      TakerGets: {
        currency: "524C555344000000000000000000000000000000",
        value: stablecoin.toString(),
        issuer: RLUSD_ISSUER,
      },
    };

    let swap_prepared = await client.autofill(offer_token_tx);
    let offer_result = await sdk.methods.signAndSubmitAndWait(swap_prepared);
    console.log(offer_result);
    // offer_result.result.meta.TransactionResult == "tesSUCCESS"
  } catch (e) {
    console.error(e);
  } finally {
    await client.disconnect();
  }
};
