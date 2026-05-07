import AppSidebar from "@/components/layout/AppSidebar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--black)" }}>
      
      {/* Sidebar — دايماً dark */}
      <div className="dark">
        <AppSidebar />
      </div>

      <main
        className={cn(
          "flex-1 overflow-y-auto",
          "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
        )}
        style={{ background: "var(--black)" }}
      >
        {children}
      </main>
    </div>
  )
}