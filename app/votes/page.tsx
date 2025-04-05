"use client"

import { useWallet } from "@/lib/wallet-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowUpRight, Check, Coins, Search, ThumbsUp, VoteIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockProjects } from "@/lib/mock-data"
import Link from "next/link"
import { motion } from "framer-motion"

interface VoteHistory {
  projectId: string
  projectTitle: string
  voteAmount: number
  date: string
}

export default function Votes() {
  const { isConnected, balance } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [voteAmount, setVoteAmount] = useState<number>(1)
  const [isVoting, setIsVoting] = useState(false)
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([
    {
      projectId: "1",
      projectTitle: "XRPL DeFi Lending Platform",
      voteAmount: 15,
      date: "2023-12-10",
    },
    {
      projectId: "3",
      projectTitle: "Cross-Chain Bridge for XRPL",
      voteAmount: 25,
      date: "2023-12-05",
    },
  ])

  // Projects with user's votes
  const [projectVotes, setProjectVotes] = useState<Record<string, number>>({
    "1": 15,
    "3": 25,
  })

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  // Filter projects based on search query and active tab
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "active") return matchesSearch && project.fundingPercentage < 100
    if (activeTab === "voted") return matchesSearch && projectVotes[project.id]
    if (activeTab === "completed") return matchesSearch && project.fundingPercentage === 100

    return matchesSearch
  })

  const handleVote = async () => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to vote on",
        variant: "destructive",
      })
      return
    }

    if (voteAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive amount to vote",
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

      // Get the project title
      const project = mockProjects.find((p) => p.id === selectedProject)

      if (project) {
        // Update vote history
        const newVote = {
          projectId: selectedProject,
          projectTitle: project.title,
          voteAmount: voteAmount,
          date: new Date().toISOString().split("T")[0],
        }

        setVoteHistory((prev) => [newVote, ...prev])

        // Update project votes
        setProjectVotes((prev) => ({
          ...prev,
          [selectedProject]: (prev[selectedProject] || 0) + voteAmount,
        }))

        toast({
          title: "Vote successful!",
          description: `You have voted with ${voteAmount} tokens for "${project.title}".`,
        })
      }

      // Reset selection and vote amount
      setSelectedProject(null)
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

  const getTotalVotesUsed = () => {
    return Object.values(projectVotes).reduce((sum, votes) => sum + votes, 0)
  }

  const getVotesRemaining = () => {
    return balance.investmentTokens - getTotalVotesUsed()
  }

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
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Vote on Projects</h1>
        <p className="text-muted-foreground">Use your investment tokens to support projects you believe in</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8 rounded-full border-none bg-secondary/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto rounded-full p-1 bg-secondary/50 backdrop-blur-sm">
              <TabsTrigger value="active" className="rounded-full">
                Active Projects
              </TabsTrigger>
              <TabsTrigger value="voted" className="rounded-full">
                My Votes
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-full">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No projects found matching your criteria.</p>
                </div>
              ) : (
                <motion.div className="grid gap-6 md:grid-cols-2" variants={container} initial="hidden" animate="show">
                  {filteredProjects.map((project) => (
                    <motion.div key={project.id} variants={item}>
                      <Card
                        className={`card-hover border-none bg-card/50 backdrop-blur-sm h-full flex flex-col cursor-pointer transition-all duration-300 ${selectedProject === project.id ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                by {project.author} • {project.daysAgo} days ago
                              </CardDescription>
                            </div>
                            <Badge
                              variant={project.category === "DeFi" ? "default" : "outline"}
                              className="rounded-full"
                            >
                              {project.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow pb-2">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Funding Progress</span>
                              <span className="font-medium">{project.fundingPercentage}%</span>
                            </div>
                            <Progress value={project.fundingPercentage} className="h-2 rounded-full" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{project.currentFunding} RLUSD raised</span>
                              <span>Goal: {project.fundingGoal} RLUSD</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{project.votes} votes</span>
                            {projectVotes[project.id] && (
                              <Badge variant="outline" className="ml-2 rounded-full text-xs">
                                Your votes: {projectVotes[project.id]}
                              </Badge>
                            )}
                          </div>
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="ghost" size="sm" className="rounded-full hover:bg-secondary/50">
                              Details
                              <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                        {selectedProject === project.id && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="border-none bg-card/50 backdrop-blur-sm sticky top-20">
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>
                {selectedProject
                  ? `Voting for: ${mockProjects.find((p) => p.id === selectedProject)?.title}`
                  : "Select a project to vote on"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-primary" />
                  <div className="font-medium">Available Tokens</div>
                </div>
                <div className="text-xl font-bold">{getVotesRemaining()}</div>
              </div>

              {selectedProject && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vote Amount</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[voteAmount]}
                        min={1}
                        max={Math.min(100, getVotesRemaining())}
                        step={1}
                        onValueChange={(value) => setVoteAmount(value[0])}
                        className="flex-grow"
                        disabled={getVotesRemaining() <= 0}
                      />
                      <div className="w-12 text-center font-medium">{voteAmount}</div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Min: 1</span>
                      <span>Max: {Math.min(100, getVotesRemaining())}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-full py-6 transition-all hover:shadow-lg hover:shadow-primary/20"
                    onClick={handleVote}
                    disabled={isVoting || !selectedProject || voteAmount <= 0 || voteAmount > getVotesRemaining()}
                  >
                    {isVoting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <VoteIcon className="mr-2 h-4 w-4" />
                        Cast Vote
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Vote History</Label>
                {voteHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {voteHistory.map((vote, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 backdrop-blur-sm text-sm"
                      >
                        <div className="truncate max-w-[150px]">{vote.projectTitle}</div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-primary" />
                          <span>{vote.voteAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">No votes cast yet</div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/invest")}
                  className="w-full rounded-full transition-all hover:bg-primary/10"
                >
                  Get More Voting Power
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

