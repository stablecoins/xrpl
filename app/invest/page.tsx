"use client";

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
import { ArrowRight, Coins, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { approve, swap } from "@/lib/swap-provider";

export default function Invest() {
  const { isConnected, balance } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(0);
  const [isInvesting, setIsInvesting] = useState(false);
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [hasApproved, setHasApproved] = useState<boolean>(false);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Calculate estimated tokens
  useEffect(() => {
    // Simple 1:10 ratio for this example
    setEstimatedTokens(amount);
  }, [amount]);

  const handleApprove = async () => {
    try {
      setIsApproving(true);

      setHasApproved(await approve(setTxHash));
    } catch (error) {
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  }

  const handleInvest = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive amount to invest",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance.RLUSD) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough RLUSD for this investment",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsInvesting(true);

      await swap(estimatedTokens, amount);

      toast({
        title: "Investment successful!",
        description: `You have invested ${amount} RLUSD and received ${estimatedTokens} investment tokens.`,
      });

      //router.push("/dashboard")
    } catch (error) {
      console.error("Investment failed:", error);
      toast({
        title: "Investment failed",
        description:
          "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Invest RLUSD</h1>
        <p className="text-muted-foreground">
          Invest your RLUSD to receive investment tokens
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Details</CardTitle>
          <CardDescription>
            Enter the amount of RLUSD you want to invest
          </CardDescription>
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
              <Button
                variant="outline"
                onClick={() => setAmount(balance.RLUSD)}
                className="whitespace-nowrap"
              >
                Max
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Available: {balance.RLUSD} RLUSD
            </p>
          </div>

          <div className="space-y-2">
            <Label>Estimated Investment Tokens</Label>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">{estimatedTokens}</div>
            </div>
          </div>
          {hasApproved && <div className="space-y-2 flex items-center space-x-2 rounded-md border p-3 overflow-x-hidden truncate">
              <div className="opacity-60 truncate">TrustSet: <a href={`https://testnet.xrpl.org/transactions/${txHash}`}>{txHash}</a></div>
          </div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          {hasApproved ? (
            <Button
              onClick={handleInvest}
              disabled={isInvesting || amount <= 0 || amount > balance.RLUSD}
            >
              {isInvesting ? "Processing..." : "Invest RLUSD"}
              {!isInvesting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <Button
              onClick={handleApprove}
            >
              {isApproving ? "Accepting..." : "Accept Trustline"}
              {!isApproving && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
