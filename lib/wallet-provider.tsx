"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
    if (savedAddress) {
      setIsConnected(true)
      setAddress(savedAddress)
      // In a real app, we would fetch the actual balances here
      setBalance({
        RLUSD: 1000,
        investmentTokens: 100,
      })
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)

      // In a real implementation, we would use the Xumm SDK here
      // For this example, we'll simulate a connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate a successful connection
      const mockAddress = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
      setAddress(mockAddress)
      setIsConnected(true)
      localStorage.setItem("walletAddress", mockAddress)

      // Set mock balances
      setBalance({
        RLUSD: 1000,
        investmentTokens: 100,
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
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

