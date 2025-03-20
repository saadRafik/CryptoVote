"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { updateVotingSettings } from "@/lib/contract-utils"
import { Loader2 } from "lucide-react"

export function AdminSettings() {
  const { isConnected, signer } = useWeb3()
  const [quorum, setQuorum] = useState("200")
  const [votingDuration, setVotingDuration] = useState("7")
  const [allowAbstain, setAllowAbstain] = useState(true)
  const [allowPublicProposals, setAllowPublicProposals] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to update settings",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateVotingSettings(signer, {
        quorum: Number.parseInt(quorum),
        votingDuration: Number.parseInt(votingDuration),
        allowAbstain,
        allowPublicProposals,
      })

      toast({
        title: "Settings updated",
        description: "Voting settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating the voting settings",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Settings</CardTitle>
        <CardDescription>Configure the voting system parameters</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quorum">Quorum (Minimum Votes Required)</Label>
            <Input id="quorum" type="number" min="1" value={quorum} onChange={(e) => setQuorum(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voting-duration">Default Voting Duration (Days)</Label>
            <Input
              id="voting-duration"
              type="number"
              min="1"
              value={votingDuration}
              onChange={(e) => setVotingDuration(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-abstain">Allow Abstain Votes</Label>
              <p className="text-sm text-muted-foreground">Allow voters to abstain from voting</p>
            </div>
            <Switch id="allow-abstain" checked={allowAbstain} onCheckedChange={setAllowAbstain} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-proposals">Allow Public Proposals</Label>
              <p className="text-sm text-muted-foreground">Allow any user to create proposals</p>
            </div>
            <Switch id="public-proposals" checked={allowPublicProposals} onCheckedChange={setAllowPublicProposals} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!isConnected || isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Settings
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

