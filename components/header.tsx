"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-provider"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ConnectWalletButton } from "./connect-wallet-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
export default function Header() {
  const { isConnected, address, disconnect, balance } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDisconnect = () => {
    disconnect()
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/xidebt.svg" alt="Logo" width={110} height={110} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/projects" className="nav-link">
            Projects
          </Link>
          <Link href="/invest" className="nav-link">
            Invest
          </Link>
          {isConnected && (
            <>
              <Link href="/votes" className="nav-link">
                Vote
              </Link>
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link href="/submit-project" className="nav-link">
                Submit Project
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isConnected && <Button variant="outline" size="sm">
            $RLUSD {balance.RLUSD?.toFixed(2) ?? 0}
          </Button>}
          {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full px-4">
                    {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="w-full">
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/investments" className="w-full">
                      My Investments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/votes" className="w-full">
                      My Votes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <ConnectWalletButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t p-4 bg-background/95 backdrop-blur-sm"
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/projects"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/invest"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Invest
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/votes"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vote
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/submit-project"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Project
                </Link>
              </>
            )}
            <div className="pt-2">
              {isConnected ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">
                    Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDisconnect} className="rounded-full">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <ConnectWalletButton onClick={() => setIsMenuOpen(false)} />
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}

