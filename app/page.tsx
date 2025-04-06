import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Wallet, Coins, BarChart3, ArrowRightLeft, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                XRPL Stablecoin Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                A simple and secure solution for interacting with stablecoins on the XRP Ledger
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/projects">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/projects" target="_blank" rel="noopener noreferrer">
                  Browse Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Follow these simple steps to use our stablecoin platform on XRPL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Card className="flex flex-col h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">1. Connect Your Wallet</CardTitle>
                <CardDescription>Connect with your XRPL wallet to access all features</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 dark:text-gray-400">
                  Our application supports multiple wallets compatible with XRPL. Simply click the "Connect" button and
                  choose your preferred wallet.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="flex flex-col h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">2. Choose Your Stablecoin</CardTitle>
                <CardDescription>Select from our list of available stablecoins on XRPL</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 dark:text-gray-400">
                  We offer a variety of stablecoins backed by different currencies. Browse the list and choose the one
                  that best suits your needs.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="flex flex-col h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ArrowRightLeft className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">3. Perform Transactions</CardTitle>
                <CardDescription>Send, receive, or exchange your stablecoins with ease</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 dark:text-gray-400">
                  Our intuitive interface allows you to perform transactions quickly and securely. Enjoy reduced fees
                  and the speed of the XRPL network.
                </p>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="flex flex-col h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">4. Track Your Assets</CardTitle>
                <CardDescription>Visualize and manage your stablecoin portfolio</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 dark:text-gray-400">
                  Our dashboard gives you an overview of your assets, with detailed charts and a complete history of
                  your transactions.
                </p>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="flex flex-col h-full transition-all hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">5. Enjoy the Benefits</CardTitle>
                <CardDescription>Take advantage of all the benefits of stablecoins on XRPL</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 dark:text-gray-400">
                  Fast transactions, reduced fees, enhanced security, and interoperability with the XRPL ecosystem -
                  discover all the advantages of our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Our platform offers a comprehensive suite of tools to manage your stablecoins
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Protect your assets with the best security and authentication practices.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fast Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enjoy the speed of the XRPL network for near-instant transactions.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reduced Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Save on transaction fees thanks to the efficiency of the XRPL protocol.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Intuitive Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <p>A smooth and accessible user experience, even for beginners.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Multi-Currency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access a variety of stablecoins backed by different global currencies.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Track and analyze your transactions with detailed reporting tools.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}