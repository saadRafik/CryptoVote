"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeb3 } from "@/components/web3-provider"
import { getVoteResults } from "@/lib/contract-utils"

export function VoteResults({ proposalId }: { proposalId: string }) {
  const { isConnected, signer } = useWeb3()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVoteResults() {
      if (isConnected && signer) {
        try {
          const voteResults = await getVoteResults(signer, proposalId)
          setResults(voteResults)
        } catch (error) {
          console.error("Error fetching vote results:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setResults({
            votesFor: 120,
            votesAgainst: 45,
            votesAbstain: 15,
            totalVotes: 180,
            quorum: 200,
            quorumReached: false,
          })
          setLoading(false)
        }, 1000)
      }
    }

    fetchVoteResults()
  }, [proposalId, isConnected, signer])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vote Results</CardTitle>
          <CardDescription>Current voting results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vote Results</CardTitle>
          <CardDescription>Current voting results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[100px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No results available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalVotes = results.totalVotes
  const forPercentage = totalVotes > 0 ? (results.votesFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (results.votesAgainst / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (results.votesAbstain / totalVotes) * 100 : 0
  const quorumPercentage = results.quorum > 0 ? (totalVotes / results.quorum) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote Results</CardTitle>
        <CardDescription>Current voting results</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">For</span>
            <span className="text-sm font-medium">{forPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={forPercentage} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground text-right">{results.votesFor} votes</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Against</span>
            <span className="text-sm font-medium">{againstPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={againstPercentage} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground text-right">{results.votesAgainst} votes</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Abstain</span>
            <span className="text-sm font-medium">{abstainPercentage.toFixed(2)}%</span>
          </div>
          <Progress value={abstainPercentage} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground text-right">{results.votesAbstain} votes</p>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quorum</span>
              <span className="text-sm font-medium">{quorumPercentage.toFixed(2)}%</span>
            </div>
            <Progress value={quorumPercentage} className="h-2 bg-muted" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {totalVotes} of {results.quorum} votes needed
              </p>
              <p className="text-xs font-medium">{results.quorumReached ? "Quorum Reached" : "Quorum Not Reached"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

