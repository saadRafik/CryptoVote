import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProposalsList } from "@/components/proposals/proposals-list"
import { ProposalFilters } from "@/components/proposals/proposal-filters"
import { WalletConnect } from "@/components/wallet-connect"

export const metadata: Metadata = {
  title: "Proposals | CryptoVote",
  description: "View and vote on active proposals",
}

export default function ProposalsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Proposals" text="View and vote on active proposals.">
        <WalletConnect />
      </DashboardHeader>
      <div className="flex flex-col space-y-4">
        <ProposalFilters />
        <ProposalsList />
      </div>
    </DashboardShell>
  )
}

