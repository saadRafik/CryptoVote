import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { WalletConnect } from "@/components/wallet-connect"

export const metadata: Metadata = {
  title: "Admin | CryptoVote",
  description: "Manage voting proposals and settings",
}

export default function AdminPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Panel" text="Manage voting proposals and settings.">
        <WalletConnect />
      </DashboardHeader>
      <AdminTabs />
    </DashboardShell>
  )
}

