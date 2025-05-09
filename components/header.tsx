"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-provider"
import Link from "next/link"
import { useState } from "react"
import { ConnectWalletButton } from "./connect-wallet-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, X, Github } from "lucide-react" // Ajout de l'icône GitHub
import { FaGithub } from "react-icons/fa";

export default function Header() {
  const { isConnected, address, disconnect, balance } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleDisconnect = () => {
    disconnect()
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Stablecoin
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/projects" className="text-sm font-medium hover:text-primary">
            Projects
          </Link>
          <Link href="/invest" className="text-sm font-medium hover:text-primary">
            Invest
          </Link>
          {isConnected && (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Link href="/submit-project" className="text-sm font-medium hover:text-primary">
                Submit Project
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isConnected && (
            <Button variant="outline" size="sm">
              $RLUSD {balance.RLUSD?.toFixed(2) ?? 0}
            </Button>
          )}
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <ConnectWalletButton />
          )}

          {/* GitHub Icon */}
          <Link
            href="https://github.com/stablecoins/xrpl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <FaGithub size={32} color="black"/>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/projects"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/invest"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Invest
            </Link>
            {isConnected && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/submit-project"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Project
                </Link>
              </>
            )}
            <div className="pt-2 space-y-2">
              {isConnected ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">
                    Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <ConnectWalletButton onClick={() => setIsMenuOpen(false)} />
              )}

              {/* GitHub Icon (mobile) */}
              <Link
                href="https://github.com/stablecoins/xrpl/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5 mr-1" />
                GitHub
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
