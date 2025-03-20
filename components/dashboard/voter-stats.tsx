"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeb3 } from "@/components/web3-provider"
import { getUserVotingStats } from "@/lib/contract-utils"

export function VoterStats() {
  const { isConnected, signer, account } = useWeb3()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVoterStats() {
      if (isConnected && signer && account) {
        try {
          const voterStats = await getUserVotingStats(signer, account)
          setStats(voterStats)
        } catch (error) {
          console.error("Error fetching voter stats:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalVotes: 8,
            participationRate: 75,
            votingPower: 10,
          })
          setLoading(false)
        }, 1000)
      }
    }

    fetchVoterStats()
  }, [isConnected, signer, account])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.totalVotes || 0}</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.participationRate || 0}%</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.votingPower || 0}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

