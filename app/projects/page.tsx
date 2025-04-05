"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Search, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/lib/wallet-provider"
import { mockProjects } from "@/lib/mock-data"
import { motion } from "framer-motion"

export default function Projects() {
  const { isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter projects based on search query and active tab
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "trending") return matchesSearch && project.votes > 50
    if (activeTab === "new") return matchesSearch && project.daysAgo < 7
    if (activeTab === "funded") return matchesSearch && project.fundingPercentage === 100

    return matchesSearch
  })

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
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Projects</h1>
        <p className="text-muted-foreground">Browse and vote on community projects</p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8 rounded-full border-none bg-secondary/50 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isConnected && (
          <Link href="/submit-project">
            <Button className="rounded-full">Submit Project</Button>
          </Link>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto rounded-full p-1 bg-secondary/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="rounded-full">
              All Projects
            </TabsTrigger>
            <TabsTrigger value="trending" className="rounded-full">
              Trending
            </TabsTrigger>
            <TabsTrigger value="new" className="rounded-full">
              New
            </TabsTrigger>
            <TabsTrigger value="funded" className="rounded-full">
              Funded
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found matching your criteria.</p>
              </div>
            ) : (
              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredProjects.map((project) => (
                  <motion.div key={project.id} variants={item}>
                    <Card className="card-hover border-none bg-card/50 backdrop-blur-sm h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription className="mt-1">
                              by {project.author} • {project.daysAgo} days ago
                            </CardDescription>
                          </div>
                          <Badge variant={project.category === "DeFi" ? "default" : "outline"} className="rounded-full">
                            {project.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{project.description}</p>
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
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{project.votes} votes</span>
                        </div>
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="outline" size="sm" className="rounded-full">
                            View Details
                            <ArrowUpRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

