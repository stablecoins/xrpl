"use client"

import { useWallet } from "@/lib/wallet-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowUpRight, Calendar, Coins, DollarSign, LineChart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface Investment {
  id: string
  date: string
  amount: number
  tokens: number
  apy: number
}

interface Project {
  id: string
  title: string
  category: string
  investedAmount: number
  currentValue: number
  changePercentage: number
  date: string
}

export default function Investments() {
  const { isConnected, balance } = useWallet()
  const router = useRouter()

  // Mock data for investments
  const [investments, setInvestments] = useState<Investment[]>([
    { id: "1", date: "2023-12-15", amount: 200, tokens: 20, apy: 5.2 },
    { id: "2", date: "2023-11-30", amount: 300, tokens: 30, apy: 4.8 },
    { id: "3", date: "2023-11-15", amount: 500, tokens: 50, apy: 6.1 },
  ])

  // Mock data for project investments
  const [projectInvestments, setProjectInvestments] = useState<Project[]>([
    {
      id: "1",
      title: "XRPL DeFi Lending Platform",
      category: "DeFi",
      investedAmount: 300,
      currentValue: 330,
      changePercentage: 10,
      date: "2023-12-01",
    },
    {
      id: "3",
      title: "Cross-Chain Bridge for XRPL",
      category: "Infrastructure",
      investedAmount: 450,
      currentValue: 495,
      changePercentage: 10,
      date: "2023-11-20",
    },
    {
      id: "5",
      title: "Decentralized Social Media on XRPL",
      category: "Social",
      investedAmount: 250,
      currentValue: 237.5,
      changePercentage: -5,
      date: "2023-12-10",
    },
  ])

  // Calculate total investment stats
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalTokens = investments.reduce((sum, inv) => sum + inv.tokens, 0)
  const totalProjectInvested = projectInvestments.reduce((sum, proj) => sum + proj.investedAmount, 0)
  const totalProjectValue = projectInvestments.reduce((sum, proj) => sum + proj.currentValue, 0)
  const totalReturn = totalProjectValue - totalProjectInvested
  const totalReturnPercentage =
    totalProjectInvested > 0 ? ((totalProjectValue - totalProjectInvested) / totalProjectInvested) * 100 : 0

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">My Investments</h1>
        <p className="text-muted-foreground">Track and manage your investments on the platform</p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Total Invested</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{totalInvested.toLocaleString()} RLUSD</div>
              <p className="text-xs text-muted-foreground">Across all investments</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Current Value</CardTitle>
              <LineChart className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{totalProjectValue.toLocaleString()} RLUSD</div>
              <div className={`text-xs ${totalReturn >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}>
                {totalReturn >= 0 ? "+" : ""}
                {totalReturn.toLocaleString()} RLUSD
                <span className="ml-1">({totalReturnPercentage.toFixed(2)}%)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Investment Tokens</CardTitle>
              <Coins className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{totalTokens}</div>
              <p className="text-xs text-muted-foreground">Total tokens received</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Projects</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{projectInvestments.length}</div>
              <p className="text-xs text-muted-foreground">Active investments</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full sm:w-auto rounded-full p-1 bg-secondary/50 backdrop-blur-sm">
            <TabsTrigger value="projects" className="rounded-full">
              Project Investments
            </TabsTrigger>
            <TabsTrigger value="tokens" className="rounded-full">
              Token Investments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projectInvestments.map((project) => (
                <Card key={project.id} className="card-hover border-none bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={project.category === "DeFi" ? "default" : "outline"} className="rounded-full">
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription>Invested on {project.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Invested</div>
                        <div className="text-lg font-medium">{project.investedAmount} RLUSD</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                        <div className="text-lg font-medium">{project.currentValue} RLUSD</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Return</div>
                      <div
                        className={`text-sm font-medium flex items-center ${project.changePercentage >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {project.changePercentage >= 0 ? "+" : ""}
                        {project.changePercentage}%
                        {project.changePercentage >= 0 ? (
                          <TrendingUp className="ml-1 h-3 w-3" />
                        ) : (
                          <TrendingUp className="ml-1 h-3 w-3 transform rotate-180" />
                        )}
                      </div>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm" className="w-full rounded-full">
                        View Project
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="mt-6">
            <Card className="border-none bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Token Investment History</CardTitle>
                <CardDescription>Your history of RLUSD investments for tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Investment Progress</span>
                    <span className="font-medium">{Math.min(100, (totalInvested / 2000) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(100, (totalInvested / 2000) * 100)} className="h-2 rounded-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current: {totalInvested} RLUSD</span>
                    <span>Goal: 2,000 RLUSD</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{investment.amount} RLUSD</div>
                          <div className="text-xs text-muted-foreground">{investment.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{investment.tokens} tokens</div>
                        <div className="text-xs text-green-500">APY: {investment.apy}%</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/invest">
                  <Button className="w-full rounded-full transition-all hover:shadow-lg hover:shadow-primary/20">
                    Invest More RLUSD
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

