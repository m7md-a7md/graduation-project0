"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Globe, Check, Eye, EyeOff, LogOut, Trash2 } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t, locale, changeLocale } = useTranslation()

  // Profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "Ahmed Mido",
    email: "amedmido@example.com",
  })

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [tempProfileData, setTempProfileData] = useState(profileData)

  useEffect(() => { 
    setMounted(true)
    setTempProfileData(profileData)
  }, [])

  const LANGUAGES = [
    { code: "en", label: t("settings", "english") || "English", native: "English" },
    { code: "ar", label: t("settings", "arabic") || "Arabic", native: "العربية" },
  ]

  const handleSaveProfile = () => {
    setProfileData(tempProfileData)
    setIsEditingProfile(false)
  }

  const handleCancelProfile = () => {
    setTempProfileData(profileData)
    setIsEditingProfile(false)
  }

  const handleSavePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords do not match")
      return
    }
    console.log("Password changed")
    setPasswordData({ current: "", new: "", confirm: "" })
    setIsEditingPassword(false)
  }

  return (
    <div className="w-full min-h-screen" style={{ padding: "32px 48px", background: "var(--black)" }}>
      <div style={{ maxWidth: "680px" }} className="space-y-12">

        {/* Header */}
        <div className="ag-fade">
          <h1 style={{ 
            fontFamily: "var(--font-syne)", 
            fontSize: "32px", 
            fontWeight: 800, 
            color: "var(--text-1)", 
            letterSpacing: "-1px" 
          }}>
            {t("settings", "title") || "Settings"}
          </h1>
          <p style={{ 
            fontFamily: "var(--font-dm-sans)", 
            fontSize: "15px", 
            color: "var(--text-3)", 
            marginTop: "8px" 
          }}>
            {t("settings", "subtitle") || "Manage your account settings and preferences"}
          </p>
        </div>

        {/* Profile Section */}
        <section className="space-y-4 ag-fade-2">
          <div>
            <p style={{ 
              fontFamily: "var(--font-syne)", 
              fontSize: "14px", 
              fontWeight: 700, 
              color: "var(--text-1)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Profile
            </p>
            <p style={{ 
              fontFamily: "var(--font-dm-sans)", 
              fontSize: "13px", 
              color: "var(--text-3)", 
              marginTop: "4px" 
            }}>
              Update your personal information
            </p>
          </div>

          <div style={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)", 
            borderRadius: "16px", 
            padding: "24px",
            transition: "all 0.3s ease"
          }}>

            {/* Name */}
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ 
                  fontFamily: "var(--font-syne)", 
                  fontSize: "13px", 
                  fontWeight: 600, 
                  color: "var(--text-2)" 
                }}>
                  Full Name
                </label>
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0147FF",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-syne)"
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={tempProfileData.name}
                  onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text-1)",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(1,71,255,0.3)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              ) : (
                <p style={{ 
                  fontFamily: "var(--font-dm-sans)", 
                  fontSize: "14px", 
                  color: "var(--text-1)" 
                }}>
                  {profileData.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: isEditingProfile ? "20px" : "0", paddingBottom: isEditingProfile ? "20px" : "0", borderBottom: isEditingProfile ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <label style={{ 
                  fontFamily: "var(--font-syne)", 
                  fontSize: "13px", 
                  fontWeight: 600, 
                  color: "var(--text-2)" 
                }}>
                  Email Address
                </label>
                {!isEditingEmail && !isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingEmail(true)}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#0147FF",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-syne)"
                    }}
                  >
                    Change
                  </button>
                )}
              </div>
              {isEditingEmail && !isEditingProfile ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="email"
                    value={tempProfileData.email}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text-1)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button 
                    onClick={() => {
                      setProfileData({ ...profileData, email: tempProfileData.email })
                      setIsEditingEmail(false)
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "#0147FF",
                      color: "#fff",
                      fontFamily: "var(--font-syne)",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p style={{ 
                  fontFamily: "var(--font-dm-sans)", 
                  fontSize: "14px", 
                  color: "var(--text-1)" 
                }}>
                  {profileData.email}
                </p>
              )}
            </div>

            {/* Save/Cancel buttons for profile edit */}
            {isEditingProfile && (
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#0147FF",
                    color: "#fff",
                    fontFamily: "var(--font-syne)",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1a5cff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#0147FF"}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelProfile}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "var(--surface)",
                    color: "var(--text-1)",
                    fontFamily: "var(--font-syne)",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(1,71,255,0.08)"
                    e.currentTarget.style.borderColor = "rgba(1,71,255,0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--surface)"
                    e.currentTarget.style.borderColor = "var(--border)"
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Password Section */}
        <section className="space-y-4 ag-fade-2">
          <div>
            <p style={{ 
              fontFamily: "var(--font-syne)", 
              fontSize: "14px", 
              fontWeight: 700, 
              color: "var(--text-1)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Password & Security
            </p>
            <p style={{ 
              fontFamily: "var(--font-dm-sans)", 
              fontSize: "13px", 
              color: "var(--text-3)", 
              marginTop: "4px" 
            }}>
              Manage your password and security settings
            </p>
          </div>

          <div style={{ 
            background: "var(--card)", 
            border: "1px solid var(--border)", 
            borderRadius: "16px", 
            padding: "24px",
            transition: "all 0.3s ease"
          }}>
            {!isEditingPassword ? (
              <button
                onClick={() => setIsEditingPassword(true)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-1)",
                  fontFamily: "var(--font-syne)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(1,71,255,0.3)"
                  e.currentTarget.style.background = "rgba(1,71,255,0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.background = "var(--surface)"
                }}
              >
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label style={{ 
                    fontFamily: "var(--font-syne)", 
                    fontSize: "13px", 
                    fontWeight: 600, 
                    color: "var(--text-2)",
                    display: "block",
                    marginBottom: "8px"
                  }}>
                    Current Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 12px",
                        paddingRight: "40px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text-1)",
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "rgba(1,71,255,0.3)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label style={{ 
                    fontFamily: "var(--font-syne)", 
                    fontSize: "13px", 
                    fontWeight: 600, 
                    color: "var(--text-2)",
                    display: "block",
                    marginBottom: "8px"
                  }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 12px",
                        paddingRight: "40px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text-1)",
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "rgba(1,71,255,0.3)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ 
                    fontFamily: "var(--font-syne)", 
                    fontSize: "13px", 
                    fontWeight: 600, 
                    color: "var(--text-2)",
                    display: "block",
                    marginBottom: "8px"
                  }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text-1)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "rgba(1,71,255,0.3)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px", paddingTop: "10px" }}>
                  <button
                    onClick={handleSavePassword}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "#0147FF",
                      color: "#fff",
                      fontFamily: "var(--font-syne)",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#1a5cff"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#0147FF"}
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPassword(false)
                      setPasswordData({ current: "", new: "", confirm: "" })
                    }}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "var(--surface)",
                      color: "var(--text-1)",
                      fontFamily: "var(--font-syne)",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(1,71,255,0.08)"
                      e.currentTarget.style.borderColor = "rgba(1,71,255,0.3)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--surface)"
                      e.currentTarget.style.borderColor = "var(--border)"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Appearance */}
        <section className="space-y-4 ag-fade-2">
          <div>
            <p style={{ 
              fontFamily: "var(--font-syne)", 
              fontSize: "14px", 
              fontWeight: 700, 
              color: "var(--text-1)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {t("settings", "appearance") || "Appearance"}
            </p>
            <p style={{ 
              fontFamily: "var(--font-dm-sans)", 
              fontSize: "13px", 
              color: "var(--text-3)", 
              marginTop: "4px" 
            }}>
              {t("settings", "appearanceSubtitle") || "Choose how you want to use the platform"}
            </p>
          </div>

          {mounted && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "dark",  label: t("settings", "dark") || "Dark",  icon: <Moon size={16} /> },
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
                      borderRadius: "14px",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(1,71,255,0.2)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "var(--border)"
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        background: isActive ? "rgba(1,71,255,0.15)" : "var(--surface)",
                        border: `1px solid ${isActive ? "rgba(1,71,255,0.25)" : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isActive ? "#0147FF" : "var(--text-3)",
                        transition: "all 0.2s"
                      }}>
                        {opt.icon}
                      </div>
                      <span style={{ 
                        fontFamily: "var(--font-syne)", 
                        fontSize: "13px", 
                        fontWeight: 700, 
                        color: isActive ? "var(--text-1)" : "var(--text-2)" 
                      }}>
                        {opt.label}
                      </span>
                    </div>
                    {isActive && (
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        background: "#0147FF", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        animation: "scaleIn 0.3s ease-out"
                      }}>
                        <Check size={11} color="#fff" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Language */}
        <section className="space-y-4 ag-fade-2">
          <div>
            <p style={{ 
              fontFamily: "var(--font-syne)", 
              fontSize: "14px", 
              fontWeight: 700, 
              color: "var(--text-1)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {t("settings", "language") || "Language"}
            </p>
            <p style={{ 
              fontFamily: "var(--font-dm-sans)", 
              fontSize: "13px", 
              color: "var(--text-3)", 
              marginTop: "4px" 
            }}>
              {t("settings", "languageSubtitle") || "Select your preferred language"}
            </p>
          </div>

          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const isActive = locale === lang.code
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLocale(lang.code as "en" | "ar")}
                  style={{
                    width: "100%",
                    background: isActive ? "rgba(1,71,255,0.08)" : "var(--card)",
                    border: `1px solid ${isActive ? "rgba(1,71,255,0.3)" : "var(--border)"}`,
                    borderRadius: "14px",
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "rgba(1,71,255,0.2)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--border)"
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "10px",
                      background: isActive ? "rgba(1,71,255,0.15)" : "var(--surface)",
                      border: `1px solid ${isActive ? "rgba(1,71,255,0.25)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isActive ? "#0147FF" : "var(--text-3)",
                      transition: "all 0.2s"
                    }}>
                      <Globe size={14} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ 
                        fontFamily: "var(--font-syne)", 
                        fontSize: "13px", 
                        fontWeight: 700, 
                        color: isActive ? "var(--text-1)" : "var(--text-2)" 
                      }}>
                        {lang.label}
                      </p>
                      <p style={{ 
                        fontFamily: "var(--font-dm-sans)", 
                        fontSize: "11px", 
                        color: "var(--text-3)", 
                        marginTop: "1px" 
                      }}>
                        {lang.native}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ 
                      width: "20px", 
                      height: "20px", 
                      borderRadius: "50%", 
                      background: "#0147FF", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      animation: "scaleIn 0.3s ease-out"
                    }}>
                      <Check size={11} color="#fff" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Danger Zone */}
        <section className="space-y-4 ag-fade-2">
          <div>
            <p style={{ 
              fontFamily: "var(--font-syne)", 
              fontSize: "14px", 
              fontWeight: 700, 
              color: "#DC2626",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Danger Zone
            </p>
            <p style={{ 
              fontFamily: "var(--font-dm-sans)", 
              fontSize: "13px", 
              color: "var(--text-3)", 
              marginTop: "4px" 
            }}>
              Irreversible actions on your account
            </p>
          </div>

          <div className="space-y-2">
            {/* Logout */}


            {/* Delete Account */}
            <button
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                borderRadius: "14px",
                border: "1px solid #DC2626",
                background: "rgba(220, 38, 38, 0.08)",
                color: "#DC2626",
                fontFamily: "var(--font-syne)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.08)"
              }}
              onClick={() => {
                if (window.confirm("Are you sure? This action cannot be undone.")) {
                  console.log("Account deleted")
                }
              }}
            >
              <Trash2 size={16} />
              <span>Delete Account</span>
            </button>
          </div>
        </section>

        {/* Footer spacing */}
        <div style={{ height: "40px" }} />
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}