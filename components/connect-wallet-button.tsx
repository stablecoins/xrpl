"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-provider"
import { Wallet } from "lucide-react"

interface ConnectWalletButtonProps {
  onClick?: () => void
}

export function ConnectWalletButton({ onClick }: ConnectWalletButtonProps) {
  const { connect, isConnecting } = useWallet()

  const handleConnect = async () => {
    await connect()
    if (onClick) onClick()
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

