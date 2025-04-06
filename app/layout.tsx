import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/lib/wallet-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Earn interest on Ripple USD",
  description: "Deposit RLUSD and earn interest"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
              <footer className="border-t py-4">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Stablecoin - support@stablecoin.org
                </div>
              </footer>
            </div>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'