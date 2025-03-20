"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProposal } from "@/components/admin/create-proposal"
import { ManageProposals } from "@/components/admin/manage-proposals"
import { VoterManagement } from "@/components/admin/voter-management"
import { AdminSettings } from "@/components/admin/admin-settings"

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState("create")

  return (
    <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="create">Create Proposal</TabsTrigger>
        <TabsTrigger value="manage">Manage Proposals</TabsTrigger>
        <TabsTrigger value="voters">Voter Management</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateProposal />
      </TabsContent>
      <TabsContent value="manage">
        <ManageProposals />
      </TabsContent>
      <TabsContent value="voters">
        <VoterManagement />
      </TabsContent>
      <TabsContent value="settings">
        <AdminSettings />
      </TabsContent>
    </Tabs>
  )
}

