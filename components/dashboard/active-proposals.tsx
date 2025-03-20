"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeb3 } from "@/components/web3-provider"
import { getActiveProposals } from "@/lib/contract-utils"
import { formatDistanceToNow } from "date-fns"

export function ActiveProposals() {
  const { isConnected, signer } = useWeb3()
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposals() {
      if (isConnected && signer) {
        try {
          const activeProposals = await getActiveProposals(signer)
          setProposals(activeProposals)
        } catch (error) {
          console.error("Error fetching active proposals:", error)
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
            },
            {
              id: "2",
              title: "Protocol Upgrade v2.5",
              description: "Vote on implementing the new protocol upgrade with enhanced security features",
              endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
              status: "active",
            },
          ])
          setLoading(false)
        }, 1000)
      }
    }

    fetchProposals()
  }, [isConnected, signer])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Proposals</CardTitle>
        <CardDescription>Current proposals that are open for voting</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : proposals.length > 0 ? (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{proposal.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{proposal.description}</p>
                  </div>
                  <Badge>{proposal.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Ends {formatDistanceToNow(proposal.endTime, { addSuffix: true })}
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/proposals/${proposal.id}`}>Vote Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No active proposals</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

