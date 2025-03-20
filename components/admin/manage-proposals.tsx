"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { getAllProposals, cancelProposal, executeProposal } from "@/lib/contract-utils"
import { MoreHorizontal, Play, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ManageProposals() {
  const { isConnected, signer } = useWeb3()
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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

  const handleCancelProposal = async (id: string) => {
    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      })
      return
    }

    try {
      await cancelProposal(signer, id)

      // Update local state
      setProposals(proposals.map((p) => (p.id === id ? { ...p, status: "cancelled" } : p)))

      toast({
        title: "Proposal cancelled",
        description: "The proposal has been cancelled successfully",
      })
    } catch (error) {
      console.error("Error cancelling proposal:", error)
      toast({
        title: "Action failed",
        description: "There was an error cancelling the proposal",
        variant: "destructive",
      })
    }
  }

  const handleExecuteProposal = async (id: string) => {
    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      })
      return
    }

    try {
      await executeProposal(signer, id)

      // Update local state
      setProposals(proposals.map((p) => (p.id === id ? { ...p, status: "executed" } : p)))

      toast({
        title: "Proposal executed",
        description: "The proposal has been executed successfully",
      })
    } catch (error) {
      console.error("Error executing proposal:", error)
      toast({
        title: "Action failed",
        description: "There was an error executing the proposal",
        variant: "destructive",
      })
    }
  }

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
    <Card>
      <CardHeader>
        <CardTitle>Manage Proposals</CardTitle>
        <CardDescription>View and manage all proposals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="flex flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{proposal.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{proposal.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      proposal.status === "active"
                        ? "bg-green-500"
                        : proposal.status === "completed"
                          ? "bg-blue-500"
                          : proposal.status === "cancelled"
                            ? "bg-red-500"
                            : ""
                    }
                  >
                    {proposal.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleExecuteProposal(proposal.id)}
                        disabled={proposal.status !== "completed"}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Execute
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCancelProposal(proposal.id)}
                        disabled={proposal.status !== "active"}
                        className="text-red-500"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-xs">
                    <span className="font-medium">For:</span> {proposal.votesFor}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium">Against:</span> {proposal.votesAgainst}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {proposal.status === "active"
                    ? `Ends ${formatDistanceToNow(proposal.endTime, { addSuffix: true })}`
                    : `Ended ${formatDistanceToNow(proposal.endTime, { addSuffix: true })}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

