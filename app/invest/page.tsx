"use client"

import { useWallet } from "@/lib/wallet-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Coins, Info, History, TrendingUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InvestmentHistory {
  date: string
  amount: number
  tokens: number
}

export default function Invest() {
  const { isConnected, balance } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [amount, setAmount] = useState<number>(100)
  const [isInvesting, setIsInvesting] = useState(false)
  const [estimatedTokens, setEstimatedTokens] = useState<number>(10)
  const [totalInvested, setTotalInvested] = useState<number>(500)
  const [totalTokens, setTotalTokens] = useState<number>(50)
  const [investmentHistory, setInvestmentHistory] = useState<InvestmentHistory[]>([
    { date: "2023-12-15", amount: 200, tokens: 20 },
    { date: "2023-11-30", amount: 300, tokens: 30 },
  ])

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

      // Update investment history
      const newInvestment = {
        date: new Date().toISOString().split("T")[0],
        amount: amount,
        tokens: estimatedTokens,
      }

      setInvestmentHistory((prev) => [newInvestment, ...prev])
      setTotalInvested((prev) => prev + amount)
      setTotalTokens((prev) => prev + estimatedTokens)

      toast({
        title: "Investment successful!",
        description: `You have invested ${amount} RLUSD and received ${estimatedTokens} investment tokens.`,
      })

      // In a real app, we would update the balances from the blockchain
      // For now, we'll just reset the amount
      setAmount(0)
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
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Invest RLUSD</h1>
        <p className="text-muted-foreground">
          Invest your RLUSD to receive investment tokens and increase your voting power
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs defaultValue="invest" className="w-full">
            <TabsList className="w-full sm:w-auto rounded-full p-1 bg-secondary/50 backdrop-blur-sm mb-6">
              <TabsTrigger value="invest" className="rounded-full">
                Invest
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invest">
              <Card className="border-none bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                  <CardDescription>Enter the amount of RLUSD you want to invest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="border-none bg-secondary/30 backdrop-blur-sm">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      Investment tokens represent your stake in the platform and determine your voting power. The
                      exchange rate is 10 RLUSD = 1 investment token.
                    </AlertDescription>
                  </Alert>

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
                        className="rounded-full border-none bg-secondary/50 backdrop-blur-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setAmount(balance.RLUSD)}
                        className="whitespace-nowrap rounded-full transition-all hover:scale-105"
                      >
                        Max
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available: {balance.RLUSD} RLUSD</span>
                      <span className="text-muted-foreground">Min: 10 RLUSD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Investment Tokens</Label>
                    <div className="flex items-center space-x-2 rounded-full border-none bg-secondary/50 backdrop-blur-sm p-4">
                      <Coins className="h-5 w-5 text-primary" />
                      <div className="text-xl font-medium">{estimatedTokens}</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleInvest}
                      disabled={isInvesting || amount <= 0 || amount > balance.RLUSD}
                      className="w-full rounded-full py-6 transition-all hover:shadow-lg hover:shadow-primary/20"
                    >
                      {isInvesting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Invest RLUSD
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-none bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Investment History</CardTitle>
                  <CardDescription>Your past investments on the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investmentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {investmentHistory.map((investment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3">
                            <History className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{investment.amount} RLUSD</div>
                              <div className="text-xs text-muted-foreground">{investment.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{investment.tokens} tokens</div>
                            <div className="text-xs text-muted-foreground">received</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No investment history found</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-none bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
              <CardDescription>Your current investment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Invested</span>
                  <span className="font-medium">{totalInvested} RLUSD</span>
                </div>
                <Progress value={(totalInvested / 2000) * 100} className="h-2 rounded-full" />
                <div className="text-xs text-right text-muted-foreground">Goal: 2,000 RLUSD</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-primary" />
                    <div className="font-medium">Investment Tokens</div>
                  </div>
                  <div className="text-xl font-bold">{totalTokens}</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div className="font-medium">Voting Power</div>
                  </div>
                  <div className="text-xl font-bold">{totalTokens}</div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/votes")}
                  className="w-full rounded-full transition-all hover:bg-primary/10"
                >
                  Go to Voting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

