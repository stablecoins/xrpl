"use client"

import { useWallet } from "@/lib/wallet-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, Coins, Vote } from "lucide-react"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { isConnected, address, balance, disconnect } = useWallet()
  const router = useRouter()

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
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your investments and votes</p>
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
              <CardTitle className="text-base font-medium">RLUSD Balance</CardTitle>
              <Coins className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{balance.RLUSD.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Available for investment</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Investment Tokens</CardTitle>
              <BarChart3 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{balance.investmentTokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Your voting power</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Projects Voted</CardTitle>
              <Vote className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">3</div>
              <p className="text-xs text-muted-foreground">Active votes</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="card-hover border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Projects Submitted</CardTitle>
              <BarChart3 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">1</div>
              <p className="text-xs text-muted-foreground">Your proposals</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-none bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/invest">
              <Button className="w-full rounded-full transition-all hover:shadow-lg hover:shadow-primary/20">
                Invest RLUSD
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/votes">
              <Button variant="outline" className="w-full rounded-full transition-all hover:bg-primary/10">
                Vote on Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/submit-project">
              <Button variant="outline" className="w-full rounded-full transition-all hover:bg-primary/10">
                Submit New Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="w-full rounded-full transition-all hover:bg-primary/10">
                Browse Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Wallet</CardTitle>
            <CardDescription>XRPL wallet details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="text-sm font-medium">Address</div>
              <div className="mt-1 text-sm text-muted-foreground break-all">{address}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Network</div>
              <div className="mt-1 text-sm text-muted-foreground">XRPL Mainnet</div>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-full transition-all hover:bg-destructive/10"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

