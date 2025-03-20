"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeb3 } from "@/components/web3-provider"
import { getAllProposals } from "@/lib/contract-utils"
import { formatDistanceToNow } from "date-fns"

export function ProposalsList() {
  const { isConnected, signer } = useWeb3()
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposals() {
      if (isConnected && signer) {
        try {
          const allProposals = await getAllProposals(signer)
          setProposals(allProposals)
        } catch (error) {
          console.error("Error fetching proposals:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setProposals([
            {
              id: "1",
              title: "Community Fund Allocation",
              description: "Proposal to allocate funds for community development projects",
              endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              status: "active",
              votesFor: 120,
              votesAgainst: 45,
            },
            {
              id: "2",
              title: "Protocol Upgrade v2.5",
              description: "Vote on implementing the new protocol upgrade with enhanced security features",
              endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
              status: "active",
              votesFor: 89,
              votesAgainst: 32,
            },
            {
              id: "3",
              title: "Treasury Expansion",
              description: "Proposal to expand the treasury allocation for future development",
              endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              status: "completed",
              votesFor: 156,
              votesAgainst: 78,
            },
            {
              id: "4",
              title: "Governance Update",
              description: "Update to the governance structure to improve decision making",
              endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
              status: "completed",
              votesFor: 203,
              votesAgainst: 112,
            },
          ])
          setLoading(false)
        }, 1000)
      }
    }

    fetchProposals()
  }, [isConnected, signer])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No proposals found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id}>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{proposal.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{proposal.description}</p>
                </div>
                <Badge className={proposal.status === "active" ? "bg-green-500" : ""}>{proposal.status}</Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">For:</span>
                    <span className="text-sm">{proposal.votesFor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Against:</span>
                    <span className="text-sm">{proposal.votesAgainst}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {proposal.status === "active"
                      ? `Ends ${formatDistanceToNow(proposal.endTime, { addSuffix: true })}`
                      : `Ended ${formatDistanceToNow(proposal.endTime, { addSuffix: true })}`}
                  </p>
                </div>

                <Button asChild>
                  <Link href={`/proposals/${proposal.id}`}>
                    {proposal.status === "active" ? "Vote Now" : "View Details"}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

