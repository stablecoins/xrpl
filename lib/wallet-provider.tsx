"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import sdk from '@crossmarkio/sdk';
import {Client} from 'xrpl';

const RLUSD_ADDRESS = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";

interface WalletContextType {
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  balance: {
    RLUSD: number
    investmentTokens: number
  }
}

const client = new Client("wss://testnet.xrpl-labs.com/");

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  isConnecting: false,
  address: null,
  balance: {
    RLUSD: 0,
    investmentTokens: 0,
  },
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState({
    RLUSD: 0,
    investmentTokens: 0,
  })

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    const savedRLUSD = localStorage.getItem("rlUsd") ?? "0"
    if (savedAddress) {
      setIsConnected(true)
      setAddress(savedAddress)
      setBalance({
        RLUSD: parseFloat(savedRLUSD),
        investmentTokens: 0
      })
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)
      await client.connect()

      let { response } = await sdk.methods.signInAndWait();

      const publicAddress = response.data.address;
      setAddress(publicAddress)

      const xrplResponse = await client.request({
        "command": "gateway_balances",
        "account": publicAddress,
        "strict": true,
        "ledger_index": "validated"
      })
      const rlusdAsset = xrplResponse?.result?.assets
      console.log(rlusdAsset)
      const rlusdAmount = parseFloat(rlusdAsset ? rlusdAsset[RLUSD_ADDRESS][0].value : '0');

      setIsConnected(true)
      localStorage.setItem("walletAddress", publicAddress)
      localStorage.setItem("rlUsd", rlusdAmount.toString())
      
      setBalance({
        RLUSD: rlusdAmount,
        investmentTokens: 0,
      })
    } catch (error) {
      console.error(error)
    } finally {
      await client.disconnect()
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance({
      RLUSD: 0,
      investmentTokens: 0,
    })
    localStorage.removeItem("walletAddress")
  }

  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        isConnecting,
        address,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

