"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { HeadphonesIcon, BookOpen, BarChart2, ArrowRight, Loader2 } from "lucide-react"
import { createAgent, type AgentType } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"

const AGENT_TYPES = [
  { value: "customer_support" as AgentType, icon: HeadphonesIcon, labelKey: "customerSupport", descKey: "csDescription" },
  { value: "knowledge_base"   as AgentType, icon: BookOpen,        labelKey: "knowledgeBase",   descKey: "kbDescription" },
  { value: "analysis"         as AgentType, icon: BarChart2,       labelKey: "analysis",        descKey: "anDescription" },
]

type Props = { open: boolean; onClose: () => void }

export default function NewAgentModal({ open, onClose }: Props) {
  const router = useRouter()
  const { t, isRTL } = useTranslation()
  const [name, setName] = useState("")
  const [selectedType, setSelectedType] = useState<AgentType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCreate = async () => {
    if (!name.trim()) return setError(t("modal", "errorName"))
    if (!selectedType) return setError(t("modal", "errorType"))
    setLoading(true)
    setError("")
    try {
      const agent = await createAgent(name.trim(), selectedType)
      handleClose()
      router.push(`/dashboard/agents/${agent.agent_id}`)
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName("")
    setSelectedType(null)
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden gap-0" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "20px", maxWidth: "480px" }} dir={isRTL ? "rtl" : "ltr"}>

        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.3px" }}>
              {t("modal", "title")}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
              {t("modal", "subtitle")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }} className="space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label style={{ fontFamily: "var(--font-syne)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", display: "block" }}>
              {t("modal", "nameLabel")}
            </label>
            <input
              placeholder={t("modal", "namePlaceholder")}
              value={name}
              onChange={(e) => { setName(e.target.value); setError("") }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "10px",
                padding: "10px 12px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "13px",
                color: "#fff",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "#0147FF"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label style={{ fontFamily: "var(--font-syne)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", display: "block" }}>
              {t("modal", "typeLabel")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AGENT_TYPES.map((type) => {
                const Icon = type.icon
                const isSelected = selectedType === type.value
                return (
                  <button
                    key={type.value}
                    onClick={() => { setSelectedType(type.value); setError("") }}
                    style={{
                      background: isSelected ? "rgba(1,71,255,0.08)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isSelected ? "rgba(1,71,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: "12px",
                      padding: "12px 10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "10px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      position: "relative",
                    }}
                  >
                    {isSelected && (
                      <span style={{ position: "absolute", top: "8px", right: "8px", width: "5px", height: "5px", borderRadius: "50%", background: "#0147FF" }} />
                    )}
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: isSelected ? "rgba(1,71,255,0.15)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isSelected ? "rgba(1,71,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSelected ? "#0147FF" : "rgba(255,255,255,0.35)",
                    }}>
                      <Icon size={13} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontFamily: "var(--font-syne)", fontSize: "11px", fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)" }}>
                        {t("modal", type.labelKey)}
                      </p>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "2px", lineHeight: 1.4 }}>
                        {t("modal", type.descKey)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "#ef4444" }}>{error}</p>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={handleClose}
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer" }}
          >
            {t("modal", "cancel")}
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !selectedType}
            style={{
              background: name.trim() && selectedType ? "#0147FF" : "rgba(255,255,255,0.05)",
              border: `1px solid ${name.trim() && selectedType ? "rgba(1,71,255,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "10px",
              padding: "8px 16px",
              fontFamily: "var(--font-syne)",
              fontSize: "12px",
              fontWeight: 700,
              color: name.trim() && selectedType ? "#fff" : "rgba(255,255,255,0.25)",
              cursor: name.trim() && selectedType ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s",
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
            {loading ? t("modal", "creating") : t("modal", "create")}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}