"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import NewAgentModal from "@/components/agents/NewAgentModal"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setMounted(true)
    if (searchParams.get("newAgent") === "true") {
      setModalOpen(true)
    }
  }, [searchParams])

  const handleClose = () => {
    setModalOpen(false)
    router.replace("/dashboard")
  }

  if (!mounted) return null

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]">

      {/* Subtle radial glow — centre */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(217,119,6,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-10">

          {/* Logo mark */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a2a2a] border border-white/8 shadow-xl">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2L19.66 7V15L11 20L2.34 15V7L11 2Z"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M11 7L15.33 9.5V14.5L11 17L6.67 14.5V9.5L11 7Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-[28px] font-semibold tracking-tight text-white/90 leading-snug">
              {t("dashboard", "title")}
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              {t("dashboard", "subtitle")}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setModalOpen(true)}
            className={cn(
              "group flex w-full items-center justify-center gap-2",
              "rounded-xl px-5 py-3 text-sm font-medium",
              "bg-white/8 border border-white/10 text-white/80",
              "hover:bg-white/12 hover:border-white/20 hover:text-white",
              "active:scale-[0.98]",
              "transition-all duration-150"
            )}
          >
            <Plus size={15} className="text-white/50 group-hover:text-white/80 transition-colors" />
            {t("dashboard", "newAgent")}
          </button>

          {/* Feature pills */}
          <div className="flex items-center gap-2">
            {[{ label: t("agent", "knowledgeBase") }, { label: t("agent", "customerSupport") }, { label: t("agent", "analysis") }].map((f) => (
              <span
                key={f.label}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-[11px] font-medium text-white/35"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <NewAgentModal open={modalOpen} onClose={handleClose} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}
