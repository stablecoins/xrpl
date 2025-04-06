"use client"

import { Button } from "@/components/ui/button"
import { useSwap } from "@/lib/swap-provider"
import { Wallet } from "lucide-react"

interface SwapButtonProps {
  onClick?: () => void
}

export function SwapButton({ onClick }: SwapButtonProps) {
  const { swap, isSwapping } = useSwap()

  const handleSwap = async () => {
    await swap()
    if (onClick) onClick()
  }

  return (
    <Button onClick={handleSwap} disabled={isSwapping}>
      <Wallet className="mr-2 h-4 w-4" />
      {isSwapping ? "Swapping..." : "Swap"}
    </Button>
  )
}

