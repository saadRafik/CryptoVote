"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { castVote } from "@/lib/contract-utils"
import { Loader2 } from "lucide-react"

export function VoteForm({ proposalId }: { proposalId: string }) {
  const { isConnected, signer } = useWeb3()
  const [voteChoice, setVoteChoice] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!voteChoice) {
      toast({
        title: "Vote choice required",
        description: "Please select a vote option",
        variant: "destructive",
      })
      return
    }

    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await castVote(signer, proposalId, voteChoice, reason)

      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded on the blockchain",
      })

      // Reset form
      setVoteChoice(null)
      setReason("")
    } catch (error) {
      console.error("Error casting vote:", error)
      toast({
        title: "Vote failed",
        description: "There was an error submitting your vote",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>Your vote will be recorded on the blockchain</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Vote Option</Label>
            <RadioGroup value={voteChoice || ""} onValueChange={setVoteChoice}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="for" id="for" />
                <Label htmlFor="for" className="cursor-pointer">
                  For
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="against" id="against" />
                <Label htmlFor="against" className="cursor-pointer">
                  Against
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="abstain" id="abstain" />
                <Label htmlFor="abstain" className="cursor-pointer">
                  Abstain
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Share your reasoning for this vote"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!isConnected || isSubmitting || !voteChoice} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit Vote"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

