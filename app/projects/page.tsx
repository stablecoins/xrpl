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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Projects</h1>
        <p className="text-muted-foreground">Browse and vote on community projects</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isConnected && (
          <Link href="/submit-project">
            <Button>Submit Project</Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="funded">Funded</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {project.icon} 
                          <br />
                          <br />
                          {project.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          by {project.author} • {project.daysAgo} days ago
                        </CardDescription>
                      </div>
                      <Badge variant={project.category === "DeFi" ? "default" : "outline"}>{project.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{project.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Funding Progress</span>
                        <span className="font-medium">{project.fundingPercentage}%</span>
                      </div>
                      <Progress value={project.fundingPercentage} className={"h-2"} />
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
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

