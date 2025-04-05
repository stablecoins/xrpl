"use client"

import { useWallet } from "@/lib/wallet-provider"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { mockProjects } from "@/lib/mock-data"
import { ArrowLeft, Calendar, ThumbsUp, Users } from "lucide-react"
import Link from "next/link"

export default function ProjectDetails({ params }) {
  const { isConnected, balance, connect } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [isVoting, setIsVoting] = useState(false)
  const [voteAmount, setVoteAmount] = useState(1)

  // Find the project by ID
  const project = mockProjects.find((p) => p.id === params.id)

  // If project not found, redirect to projects page
  if (!project) {
    router.push("/projects")
    return null
  }

  const handleVote = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote on projects",
        variant: "destructive",
      })
      return
    }

    if (voteAmount > balance.investmentTokens) {
      toast({
        title: "Insufficient tokens",
        description: "You don't have enough investment tokens for this vote",
        variant: "destructive",
      })
      return
    }

    try {
      setIsVoting(true)

      // In a real implementation, we would use the XRPL SDK to record the vote
      // For this example, we'll simulate a vote
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Vote successful!",
        description: `You have voted with ${voteAmount} tokens for "${project.title}".`,
      })

      // In a real app, we would update the project's vote count
      // For now, we'll just reset the vote amount
      setVoteAmount(1)
    } catch (error) {
      console.error("Voting failed:", error)
      toast({
        title: "Voting failed",
        description: "There was an error processing your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link href="/projects" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">{project.title}</h1>
          <p className="text-muted-foreground">
            by {project.author} • {project.daysAgo} days ago
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Project Overview</CardTitle>
                <Badge variant={project.category === "DeFi" ? "default" : "outline"}>{project.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">
                {project.description}
                {"\n\n"}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies,
                nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies,
                nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                {"\n\n"}
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                        <Avatar>
                          <AvatarImage src={`/placeholder-user-${i}.jpg`} />
                          <AvatarFallback>{`U${i}`}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">User{i}</span>
                            <span className="text-xs text-muted-foreground">
                              {i} day{i > 1 ? "s" : ""} ago
                            </span>
                          </div>
                          <p className="text-sm">
                            This is a great project! I'm excited to see how it develops.
                            {i === 1 && " The team seems very capable and the roadmap is clear."}
                            {i === 2 && " I have some questions about the tokenomics though."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Load More Comments
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="updates" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.daysAgo - 2} days ago</span>
                      </div>
                      <h3 className="font-medium">Project Launch</h3>
                      <p className="text-sm mt-1">
                        We're excited to announce the official launch of our project on the XRPL platform!
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.daysAgo} days ago</span>
                      </div>
                      <h3 className="font-medium">Development Update</h3>
                      <p className="text-sm mt-1">
                        We've made significant progress on the core functionality and are on track for our first
                        milestone.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user-1.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{project.author}</h3>
                        <p className="text-sm text-muted-foreground">Project Lead</p>
                        <p className="text-sm mt-1">
                          Experienced blockchain developer with 5+ years in the XRPL ecosystem.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user-2.jpg" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Alice Smith</h3>
                        <p className="text-sm text-muted-foreground">Technical Architect</p>
                        <p className="text-sm mt-1">
                          Blockchain architect specializing in DeFi applications and smart contracts.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding Progress</CardTitle>
              <CardDescription>
                {project.currentFunding} of {project.fundingGoal} RLUSD raised
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={project.fundingPercentage} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{project.fundingPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Funded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{project.votes}</div>
                  <div className="text-xs text-muted-foreground">Votes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{30 - project.daysAgo}</div>
                  <div className="text-xs text-muted-foreground">Days Left</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vote on this Project</CardTitle>
              <CardDescription>Use your investment tokens to vote on this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vote Amount</span>
                      <span>{voteAmount} tokens</span>
                    </div>
                    <Slider
                      value={[voteAmount]}
                      min={1}
                      max={Math.min(100, balance.investmentTokens)}
                      step={1}
                      onValueChange={(value) => setVoteAmount(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: 1</span>
                      <span>Available: {balance.investmentTokens}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleVote}
                    disabled={isVoting || voteAmount > balance.investmentTokens}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {isVoting ? "Processing..." : "Vote Now"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground mb-4">Connect your wallet to vote on this project</p>
                  <Button className="w-full" onClick={() => connect()}>
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>{project.votes * 2} supporters</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{project.votes} votes</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

