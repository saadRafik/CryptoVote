"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { createProposal } from "@/lib/contract-utils"
import { Loader2, Plus, Trash2 } from "lucide-react"

export function CreateProposal() {
  const { isConnected, signer } = useWeb3()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [sections, setSections] = useState([{ title: "", content: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const addSection = () => {
    setSections([...sections, { title: "", content: "" }])
  }

  const removeSection = (index: number) => {
    const newSections = [...sections]
    newSections.splice(index, 1)
    setSections(newSections)
  }

  const updateSection = (index: number, field: "title" | "content", value: string) => {
    const newSections = [...sections]
    newSections[index][field] = value
    setSections(newSections)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !startDate || !endDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a proposal",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createProposal(signer, {
        title,
        description,
        startDate,
        endDate,
        sections,
      })

      toast({
        title: "Proposal created",
        description: "Your proposal has been created successfully",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setStartDate(undefined)
      setEndDate(undefined)
      setSections([{ title: "", content: "" }])
    } catch (error) {
      console.error("Error creating proposal:", error)
      toast({
        title: "Creation failed",
        description: "There was an error creating your proposal",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Proposal</CardTitle>
        <CardDescription>Fill in the details to create a new voting proposal</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter proposal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of the proposal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} placeholder="Select start date" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} placeholder="Select end date" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Proposal Sections</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            {sections.map((section, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Section {index + 1}</h4>
                  {sections.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-title-${index}`}>Section Title</Label>
                  <Input
                    id={`section-title-${index}`}
                    placeholder="E.g., Background, Proposal, Implementation"
                    value={section.title}
                    onChange={(e) => updateSection(index, "title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-content-${index}`}>Content</Label>
                  <Textarea
                    id={`section-content-${index}`}
                    placeholder="Enter section content"
                    value={section.content}
                    onChange={(e) => updateSection(index, "content", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!isConnected || isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Proposal
              </>
            ) : (
              "Create Proposal"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

