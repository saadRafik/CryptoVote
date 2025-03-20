"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { getVoterList, addVoter, removeVoter } from "@/lib/contract-utils"
import { Loader2, Plus, Trash2, Search } from "lucide-react"

export function VoterManagement() {
  const { isConnected, signer } = useWeb3()
  const [voters, setVoters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newVoterAddress, setNewVoterAddress] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchVoters() {
      if (isConnected && signer) {
        try {
          const voterList = await getVoterList(signer)
          setVoters(voterList)
        } catch (error) {
          console.error("Error fetching voters:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Mock data for demonstration
        setTimeout(() => {
          setVoters([
            { address: "0x1234...5678", votingPower: 10, lastVoted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { address: "0x5678...9012", votingPower: 5, lastVoted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
            { address: "0x9012...3456", votingPower: 8, lastVoted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          ])
          setLoading(false)
        }, 1000)
      }
    }

    fetchVoters()
  }, [isConnected, signer])

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newVoterAddress) {
      toast({
        title: "Address required",
        description: "Please enter a wallet address",
        variant: "destructive",
      })
      return
    }

    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addVoter(signer, newVoterAddress)

      // Update local state
      setVoters([
        ...voters,
        {
          address: newVoterAddress,
          votingPower: 1,
          lastVoted: null,
        },
      ])

      toast({
        title: "Voter added",
        description: "The voter has been added successfully",
      })

      // Reset form
      setNewVoterAddress("")
    } catch (error) {
      console.error("Error adding voter:", error)
      toast({
        title: "Action failed",
        description: "There was an error adding the voter",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveVoter = async (address: string) => {
    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform this action",
        variant: "destructive",
      })
      return
    }

    try {
      await removeVoter(signer, address)

      // Update local state
      setVoters(voters.filter((voter) => voter.address !== address))

      toast({
        title: "Voter removed",
        description: "The voter has been removed successfully",
      })
    } catch (error) {
      console.error("Error removing voter:", error)
      toast({
        title: "Action failed",
        description: "There was an error removing the voter",
        variant: "destructive",
      })
    }
  }

  const filteredVoters = voters.filter((voter) => voter.address.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voter Management</CardTitle>
        <CardDescription>Add or remove voters and manage voting rights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddVoter} className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="voter-address">Add New Voter</Label>
            <Input
              id="voter-address"
              placeholder="Enter wallet address"
              value={newVoterAddress}
              onChange={(e) => setNewVoterAddress(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Voter
              </>
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search voters..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : filteredVoters.length > 0 ? (
            <div className="space-y-4">
              {filteredVoters.map((voter, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{voter.address}</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Voting Power: <span className="font-medium">{voter.votingPower}</span>
                      </p>
                      {voter.lastVoted && (
                        <p className="text-xs text-muted-foreground">
                          Last Voted:{" "}
                          <span className="font-medium">{new Date(voter.lastVoted).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveVoter(voter.address)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No voters found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

