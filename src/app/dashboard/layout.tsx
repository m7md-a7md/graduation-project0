"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/useAuthStore"
import AppSidebar from "@/components/layout/AppSidebar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { accessToken, fetchProfile, user, refreshToken } = useAuthStore()
  const [ready, setReady] = useState(false)
  const refreshInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const init = async () => {
      // مفيش token خالص → جرب refresh من الـ cookie أولاً
      if (!accessToken) {
        try {
          await refreshToken()   // بيستخدم الـ refresh_token cookie
          await fetchProfile()
          setReady(true)
        } catch {
          // الـ refresh فشل → روح login
          router.replace("/auth")
        }
        return
      }

      // في token → جرب تجيب الـ profile
      if (!user) {
        try {
          await fetchProfile()
        } catch {
          // الـ token expired → جرب refresh
          try {
            await refreshToken()
            await fetchProfile()
          } catch {
            router.replace("/auth")
            return
          }
        }
      }

      setReady(true)
    }

    init()
  }, [])

  // Auto refresh كل 10 دقائق
  useEffect(() => {
    if (!ready) return
    refreshInterval.current = setInterval(async () => {
      try {
        await refreshToken()
      } catch {
        router.replace("/auth")
      }
    }, 10 * 60 * 1000)
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current)
    }
  }, [ready])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--black)" }}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--black)" }}>
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