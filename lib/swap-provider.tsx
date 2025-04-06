"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import sdk from '@crossmarkio/sdk';
import {Client, Wallet} from 'xrpl';
import { useWallet } from "./wallet-provider";

const TOKEN_ADDRESS = "rDPSgbrVQcBgVRC2o5yp8b4ACFJFEFeobb";

interface SwapContextType {
  swap: () => Promise<void>,
  isSwapping: boolean,
}

const client = new Client("wss://testnet.xrpl-labs.com/");

const SwapContext = createContext<SwapContextType>({
  swap: async () => {},
  isSwapping: false,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isSwapping, setIsSwapping] = useState(false)

  const swap = async () => {
    const {address, connect} = useWallet();

    try {
      setIsSwapping(true)
      await client.connect()
      await connect()

      const hot_wallet = Wallet.fromSeed('sEdToVagQdtYYjMzwnSAQD1crBMqHBE')
    }
    catch (e) {
      console.error(e)
    }
    finally {
      await client.disconnect()
      setIsSwapping(false)
    }
  }

  return (
    <SwapContext.Provider
      value={{
        swap,
        isSwapping,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export const useSwap = () => useContext(SwapContext)

