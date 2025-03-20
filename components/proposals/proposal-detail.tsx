"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/components/web3-provider"
import { getProposalDetails } from "@/lib/contract-utils"
import { formatDistanceToNow, format } from "date-fns"

export function ProposalDetail({ id }: { id: string }) {
  const { isConnected, signer } = useWeb3()
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposalDetails() {
      if (isConnected && signer) {
        try {
          const proposalDetails = await getProposalDetails(signer, id)
          setProposal(proposalDetails)
        } catch (error) {
          console.error("Error fetching proposal details:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setProposal({
            id,
            title: "Community Fund Allocation",
            description:
              "This proposal aims to allocate funds from the treasury for community development projects. The funds will be used to support various initiatives that benefit the ecosystem and its users.",
            creator: "0x1234...5678",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            status: "active",
            votesFor: 120,
            votesAgainst: 45,
            quorum: 200,
            details: [
              {
                title: "Background",
                content:
                  "The community has expressed interest in developing new tools and resources to enhance the user experience.",
              },
              {
                title: "Proposal",
                content: "Allocate 100,000 tokens from the treasury to fund community-driven development projects.",
              },
              {
                title: "Implementation",
                content:
                  "Projects will be selected through a community review process and funded based on their potential impact.",
              },
              {
                title: "Timeline",
                content: "Implementation will begin immediately after the proposal passes and continue for 6 months.",
              },
            ],
            transactions: [
              {
                hash: "0xabcd...1234",
                from: "0x1234...5678",
                action: "Created Proposal",
                timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              },
              {
                hash: "0xefgh...5678",
                from: "0x9876...5432",
                action: "Voted For",
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              },
              {
                hash: "0xijkl...9012",
                from: "0x5432...1098",
                action: "Voted Against",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              },
            ],
          })
          setLoading(false)
        }, 1000)
      }
    }

    fetchProposalDetails()
  }, [id, isConnected, signer])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">Proposal not found</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{proposal.title}</CardTitle>
            <CardDescription className="mt-2">
              Created by {proposal.creator} • {format(proposal.createdAt, "PPP")}
            </CardDescription>
          </div>
          <Badge className={proposal.status === "active" ? "bg-green-500" : ""}>{proposal.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{proposal.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Start Date</h4>
                <p>{format(proposal.startTime, "PPP")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">End Date</h4>
                <p>{format(proposal.endTime, "PPP")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <p>{proposal.status}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Time Remaining</h4>
                <p>
                  {proposal.status === "active"
                    ? formatDistanceToNow(proposal.endTime, { addSuffix: true })
                    : "Voting ended"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {proposal.details.map((detail: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2">{detail.title}</h3>
                  <p className="text-muted-foreground">{detail.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="activity">
            <div className="space-y-4">
              {proposal.transactions.map((tx: any, index: number) => (
                <div key={index} className="flex items-start justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{tx.action}</p>
                    <p className="text-sm text-muted-foreground">From: {tx.from}</p>
                    <p className="text-sm text-muted-foreground">Tx: {tx.hash}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

