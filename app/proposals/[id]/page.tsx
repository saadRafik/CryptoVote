import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProposalDetail } from "@/components/proposals/proposal-detail"
import { VoteForm } from "@/components/proposals/vote-form"
import { VoteResults } from "@/components/proposals/vote-results"
import { WalletConnect } from "@/components/wallet-connect"

export const metadata: Metadata = {
  title: "Proposal Details | CryptoVote",
  description: "View proposal details and cast your vote",
}

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Proposal Details" text="View proposal details and cast your vote.">
        <WalletConnect />
      </DashboardHeader>
      <div className="grid gap-6">
        <ProposalDetail id={params.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <VoteForm proposalId={params.id} />
          <VoteResults proposalId={params.id} />
        </div>
      </div>
    </DashboardShell>
  )
}

