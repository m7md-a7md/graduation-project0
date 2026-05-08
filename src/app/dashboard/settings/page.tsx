"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Sun, Moon, Globe, Check, Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { useAuthStore } from "@/lib/useAuthStore"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { t, locale, changeLocale } = useTranslation()

  // ── Auth Store ──────────────────────────────────────────────
  const {
    user,
    isLoading,
    error,
    updateName,
    changePassword,
    requestEmailChange,
    logout,
    deleteAccount,
    _setError,
  } = useAuthStore()

  // ── Local UI States ─────────────────────────────────────────
  const [isEditingProfile, setIsEditingProfile]   = useState(false)
  const [isEditingEmail, setIsEditingEmail]       = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [showPassword, setShowPassword]           = useState(false)
  const [showNewPassword, setShowNewPassword]     = useState(false)

  const [tempName, setTempName]   = useState("")
  const [tempEmail, setTempEmail] = useState("")

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // ── Success messages ────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState("")

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  useEffect(() => {
    setMounted(true)
    if (user) {
      setTempName(user.name)
      setTempEmail(user.email)
    }
  }, [user])

  // ── Handlers ────────────────────────────────────────────────

  const handleSaveName = async () => {
    try {
      await updateName(tempName)
      setIsEditingProfile(false)
      showSuccess("Name updated successfully")
    } catch {
      // error موجود في الـ store
    }
  }

  const handleSaveEmail = async () => {
    try {
      await requestEmailChange(tempEmail)
      setIsEditingEmail(false)
      showSuccess("Verification link sent to new email")
    } catch {
      // error موجود في الـ store
    }
  }

  const handleSavePassword = async () => {
    _setError(null)
    if (passwordData.new !== passwordData.confirm) {
      _setError("Passwords do not match")
      return
    }
    if (passwordData.new.length < 6) {
      _setError("Password must be at least 6 characters")
      return
    }
    try {
      await changePassword(passwordData.current, passwordData.new)
      setPasswordData({ current: "", new: "", confirm: "" })
      setIsEditingPassword(false)
      showSuccess("Password updated successfully")
    } catch {
      // error موجود في الـ store
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return
    try {
      await deleteAccount()
      router.push("/login")
    } catch {
      // error موجود في الـ store
    }
  }

  const LANGUAGES = [
    { code: "en", label: "English", native: "English" },
    { code: "ar", label: "Arabic",  native: "العربية" },
  ]

  if (!mounted) return null

  return (
    <div className="w-full min-h-screen" style={{ padding: "32px 48px", background: "var(--black)" }}>
      <div style={{ maxWidth: "680px" }} className="space-y-12">

        {/* Header */}
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "32px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-1px" }}>
            {t("settings", "title") || "Settings"}
          </h1>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", color: "var(--text-3)", marginTop: "8px" }}>
            {t("settings", "subtitle") || "Manage your account settings and preferences"}
          </p>
        </div>

        {/* Global error */}
        {error && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: "13px", fontFamily: "var(--font-dm-sans)" }}>
            ⚠ {error}
          </div>
        )}

        {/* Global success */}
        {successMsg && (
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e", fontSize: "13px", fontFamily: "var(--font-dm-sans)" }}>
            ✓ {successMsg}
          </div>
        )}

        {/* ── Profile Section ───────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Profile
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "13px", color: "var(--text-3)", marginTop: "4px" }}>
              Update your personal information
            </p>
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>

            {/* Name */}
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, color: "var(--text-2)" }}>
                  Full Name
                </label>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} style={{ fontSize: "12px", fontWeight: 600, color: "#0147FF", background: "none", border: "none", cursor: "pointer" }}>
                    Edit
                  </button>
                )}
              </div>
              {isEditingProfile ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-dm-sans)", fontSize: "14px", outline: "none" }}
                    onFocus={(e) => e.target.style.borderColor = "rgba(1,71,255,0.3)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isLoading}
                    style={{ padding: "8px 16px", borderRadius: "8px", background: "#0147FF", color: "#fff", fontFamily: "var(--font-syne)", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    {isLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                    Save
                  </button>
                  <button
                    onClick={() => { setIsEditingProfile(false); setTempName(user?.name ?? "") }}
                    style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", color: "var(--text-3)", fontFamily: "var(--font-syne)", fontSize: "12px", border: "1px solid var(--border)", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--text-1)" }}>
                  {user?.name || "—"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, color: "var(--text-2)" }}>
                  Email Address
                </label>
                {!isEditingEmail && (
                  <button onClick={() => setIsEditingEmail(true)} style={{ fontSize: "12px", fontWeight: 600, color: "#0147FF", background: "none", border: "none", cursor: "pointer" }}>
                    Change
                  </button>
                )}
              </div>
              {isEditingEmail ? (
                <div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-dm-sans)", fontSize: "14px", outline: "none" }}
                    />
                    <button
                      onClick={handleSaveEmail}
                      disabled={isLoading}
                      style={{ padding: "8px 16px", borderRadius: "8px", background: "#0147FF", color: "#fff", fontFamily: "var(--font-syne)", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      {isLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                      Send
                    </button>
                    <button
                      onClick={() => { setIsEditingEmail(false); setTempEmail(user?.email ?? "") }}
                      style={{ padding: "8px 12px", borderRadius: "8px", background: "var(--surface)", color: "var(--text-3)", fontFamily: "var(--font-syne)", fontSize: "12px", border: "1px solid var(--border)", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--text-3)" }}>
                    ℹ A verification link will be sent to the new email
                  </p>
                </div>
              ) : (
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--text-1)" }}>
                  {user?.email || "—"}
                </p>
              )}
            </div>
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── Password Section ──────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Password & Security
            </p>
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
            {!isEditingPassword ? (
              <button
                onClick={() => setIsEditingPassword(true)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                {/* Current */}
                <div>
                  <label style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: "8px" }}>Current Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      style={{ width: "100%", padding: "10px 40px 10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-dm-sans)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New */}
                <div>
                  <label style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: "8px" }}>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      style={{ width: "100%", padding: "10px 40px 10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-dm-sans)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    />
                    <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}>
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: "8px" }}>Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-dm-sans)", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    onKeyDown={(e) => e.key === "Enter" && handleSavePassword()}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                  <button
                    onClick={handleSavePassword}
                    disabled={isLoading}
                    style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", background: "#0147FF", color: "#fff", fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    {isLoading && <Loader2 size={14} className="animate-spin" />}
                    Update Password
                  </button>
                  <button
                    onClick={() => { setIsEditingPassword(false); setPasswordData({ current: "", new: "", confirm: "" }) }}
                    style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, border: "1px solid var(--border)", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── Appearance ────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t("settings", "appearance") || "Appearance"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "dark",  label: t("settings", "dark")  || "Dark",  icon: <Moon size={16} /> },
              { value: "light", label: t("settings", "light") || "Light", icon: <Sun  size={16} /> },
            ].map((opt) => {
              const isActive = theme === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  style={{
                    background: isActive ? "rgba(1,71,255,0.08)" : "var(--card)",
                    border: `1px solid ${isActive ? "rgba(1,71,255,0.3)" : "var(--border)"}`,
                    borderRadius: "14px", padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: isActive ? "rgba(1,71,255,0.15)" : "var(--surface)", border: `1px solid ${isActive ? "rgba(1,71,255,0.25)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? "#0147FF" : "var(--text-3)" }}>
                      {opt.icon}
                    </div>
                    <span style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 700, color: isActive ? "var(--text-1)" : "var(--text-2)" }}>
                      {opt.label}
                    </span>
                  </div>
                  {isActive && (
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#0147FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={11} color="#fff" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── Language ──────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {t("settings", "language") || "Language"}
            </p>
          </div>
          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const isActive = locale === lang.code
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLocale(lang.code as "en" | "ar")}
                  style={{ width: "100%", background: isActive ? "rgba(1,71,255,0.08)" : "var(--card)", border: `1px solid ${isActive ? "rgba(1,71,255,0.3)" : "var(--border)"}`, borderRadius: "14px", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: isActive ? "rgba(1,71,255,0.15)" : "var(--surface)", border: `1px solid ${isActive ? "rgba(1,71,255,0.25)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? "#0147FF" : "var(--text-3)" }}>
                      <Globe size={14} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 700, color: isActive ? "var(--text-1)" : "var(--text-2)" }}>{lang.label}</p>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "var(--text-3)", marginTop: "1px" }}>{lang.native}</p>
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#0147FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={11} color="#fff" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* ── Danger Zone ───────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p style={{ fontFamily: "var(--font-syne)", fontSize: "14px", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Danger Zone
            </p>
          </div>
          <div className="space-y-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "14px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-1)", fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              )}
              <span>Logout</span>
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "14px", border: "1px solid #DC2626", background: "rgba(220,38,38,0.08)", color: "#DC2626", fontFamily: "var(--font-syne)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              <span>Delete Account</span>
            </button>
          </div>
        </section>

        <div style={{ height: "40px" }} />
      </div>
    </div>
  )
}