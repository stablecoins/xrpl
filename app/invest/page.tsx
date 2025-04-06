"use client"

<<<<<<< Updated upstream
import { useWallet } from "@/lib/wallet-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Coins, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
=======
import { useWallet } from "@/lib/wallet-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Coins, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { approve, swap } from "@/lib/swap-provider";
>>>>>>> Stashed changes

export default function Invest() {
  const { isConnected, balance } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [amount, setAmount] = useState<number>(100)
  const [isInvesting, setIsInvesting] = useState(false)
  const [estimatedTokens, setEstimatedTokens] = useState<number>(10)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  // Calculate estimated tokens
  useEffect(() => {
    // Simple 1:10 ratio for this example
    setEstimatedTokens(amount / 10)
  }, [amount])

  const handleInvest = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive amount to invest",
        variant: "destructive",
      })
      return
    }

    if (amount > balance.RLUSD) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough RLUSD for this investment",
        variant: "destructive",
      })
      return
    }

    try {
      setIsInvesting(true)

      // In a real implementation, we would use the XRPL SDK to send a transaction
      // For this example, we'll simulate a transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Investment successful!",
        description: `You have invested ${amount} RLUSD and received ${estimatedTokens} investment tokens.`,
      })

      // In a real app, we would update the balances from the blockchain
      // For now, we'll just redirect to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Investment failed:", error)
      toast({
        title: "Investment failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInvesting(false)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Invest RLUSD</h1>
        <p className="text-muted-foreground">Invest your RLUSD to receive investment tokens</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Investment tokens represent your stake in the platform and determine your voting power. The exchange rate is
          10 RLUSD = 1 investment token.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
          <CardDescription>Enter the amount of RLUSD you want to invest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">RLUSD Amount</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="amount"
                type="number"
                min="0"
                max={balance.RLUSD}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <Button variant="outline" onClick={() => setAmount(balance.RLUSD)} className="whitespace-nowrap">
                Max
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Available: {balance.RLUSD} RLUSD</p>
          </div>

          <div className="space-y-2">
            <Label>Estimated Investment Tokens</Label>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">{estimatedTokens}</div>
            </div>
          </div>
<<<<<<< Updated upstream
=======
          {hasApproved && <div className="space-y-2 flex items-center space-x-2 rounded-md border p-3 overflow-x-hidden truncate">
              <div className="opacity-60 truncate">TrustSet: <Link href={`https://testnet.xrpl.org/transactions/${txHash}`} target="_blank">{txHash}</Link></div>
          </div>}
>>>>>>> Stashed changes
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleInvest} disabled={isInvesting || amount <= 0 || amount > balance.RLUSD}>
            {isInvesting ? "Processing..." : "Invest RLUSD"}
            {!isInvesting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

