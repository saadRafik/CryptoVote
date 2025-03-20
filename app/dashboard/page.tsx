import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ActiveProposals } from "@/components/dashboard/active-proposals"
import { VotingHistory } from "@/components/dashboard/voting-history"
import { VoterStats } from "@/components/dashboard/voter-stats"
import { WalletConnect } from "@/components/wallet-connect"

export const metadata: Metadata = {
  title: "Dashboard | CryptoVote",
  description: "View active proposals and your voting history",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="View active proposals and your voting history.">
        <WalletConnect />
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <VoterStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ActiveProposals />
        <VotingHistory />
      </div>
    </DashboardShell>
  )
}

