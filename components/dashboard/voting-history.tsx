"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeb3 } from "@/components/web3-provider"
import { getUserVotingHistory } from "@/lib/contract-utils"
import { formatDistanceToNow } from "date-fns"

export function VotingHistory() {
  const { isConnected, signer, account } = useWeb3()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVotingHistory() {
      if (isConnected && signer && account) {
        try {
          const votingHistory = await getUserVotingHistory(signer, account)
          setHistory(votingHistory)
        } catch (error) {
          console.error("Error fetching voting history:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setHistory([
            {
              id: "1",
              proposalTitle: "Treasury Expansion",
              voteChoice: "For",
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
              status: "completed",
            },
            {
              id: "2",
              proposalTitle: "Governance Update",
              voteChoice: "Against",
              timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
              status: "completed",
            },
          ])
          setLoading(false)
        }, 1000)
      }
    }

    fetchVotingHistory()
  }, [isConnected, signer, account])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Voting History</CardTitle>
        <CardDescription>Record of your previous votes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((vote) => (
              <div key={vote.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{vote.proposalTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      Voted: <span className="font-medium">{vote.voteChoice}</span>
                    </p>
                  </div>
                  <Badge variant={vote.status === "completed" ? "secondary" : "outline"}>{vote.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(vote.timestamp, { addSuffix: true })}
                  </p>
                  <Button variant="outline" asChild size="sm">
                    <Link href={`/proposals/${vote.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No voting history</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

