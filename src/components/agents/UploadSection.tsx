"use client"

import { useRef, useState } from "react"
import { uploadFile, deleteFile, trainAgent, type Agent } from "@/lib/api"
import { UploadCloud, FileText, Trash2, Sparkles, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"

type Props = {
  agent: Agent
  onUpdate: () => void
}

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".png", ".jpg", ".jpeg", ".gif", ".webp"]
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
]

const isFileAllowed = (file: File): boolean => {
  const ext = "." + file.name.split(".").pop()?.toLowerCase()
  return ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext)
}

export default function UploadSection({ agent, onUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [training, setTraining] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const { t } = useTranslation()


  const files = agent.files || []

  const handleUpload = async (file: File) => {
    if (!isFileAllowed(file)) return setError("نوع الملف غير مدعوم. الأنواع المسموح بها: PDF, Word, Excel, صور, نص.")
    if (file.size > 10 * 1024 * 1024) return setError("File size must be under 10MB")
    setUploading(true)
    setError("")
    try {
      await uploadFile(agent.agent_id, file)
      onUpdate()
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    try {
      await deleteFile(agent.agent_id, fileName)
      onUpdate()
    } catch {
      setError("Failed to delete file.")
    }
  }

  const handleTrain = async () => {
    setTraining(true)
    setError("")
    try {
      await trainAgent(agent.agent_id)
      onUpdate()
    } catch {
      setError("Training failed. Please try again.")
    } finally {
      setTraining(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold tracking-tight" style={{ color: "var(--text-1)" }}>
          {t("upload", "title")}
        </h3>
        <p className="text-sm" style={{ color: "var(--text-3)" }}>
          {t("upload", "subtitle")}
        </p>
      </div>

      {/* Drop Zone */}
<div
  onClick={() => !uploading && inputRef.current?.click()}
  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
  onDragLeave={() => setDragOver(false)}
  onDrop={(e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach(handleUpload)
  }}
  className={cn(
    "group relative rounded-2xl border-2 border-dashed transition-all duration-200",
    "p-8 flex flex-col items-center justify-center cursor-pointer",
    "hover:border-blue-500/50 hover:bg-blue-500/5",
    dragOver && "border-blue-500 bg-blue-500/10"
  )}
  style={{
    borderColor: dragOver ? undefined : "var(--border)",
    background: dragOver ? undefined : "var(--surface)"
  }}
>
        {/* Background Gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="relative space-y-3 text-center">
          {/* Icon */}
          <div className={cn(
            "mx-auto w-12 h-12 rounded-xl flex items-center justify-center",
            "transition-all duration-200",
            dragOver 
              ? "bg-blue-500/20 text-blue-400" 
              : "group-hover:bg-blue-500/15 group-hover:text-blue-400"
          )}
          style={{
            background: dragOver ? undefined : "var(--surface)",
            color: dragOver ? undefined : "var(--text-3)"
          }}>
            {uploading
              ? <Loader2 size={24} className="animate-spin" />
              : <UploadCloud size={24} />
            }
          </div>

          {/* Text */}
          <div>
            <p className="font-medium" style={{ color: "var(--text-1)" }}>
              {uploading ? t("upload", "uploading") : t("upload", "dropFiles")}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>
              {t("upload", "fileLimit")}
            </p>
            {/* Allowed types hint */}
            <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>
              PDF · Word · Excel · Images · TXT
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif,.webp"
          className="hidden"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || [])
            selectedFiles.forEach(handleUpload)
          }}
        />
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
            {files.length} file{files.length !== 1 ? "s" : ""} uploaded
          </p>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div
                key={i}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3",
                  "rounded-lg border transition-all duration-200",
                  "hover:bg-opacity-8"
                )}
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)"
                }}
              >
                {/* Icon */}
                <div className="p-2 rounded-lg text-blue-400 shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}>
                  <FileText size={16} />
                </div>

                {/* Filename */}
                <p className="flex-1 text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>
                  {file.name}
                </p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(file.name)}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    "hover:text-red-400",
                    "hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                  )}
                  style={{ color: "var(--text-3)" }}
                  title="Delete file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Train Button */}
      {files.length > 0 && (
        <button
          onClick={handleTrain}
          disabled={training}
          className={cn(
            "w-full py-3 px-4 rounded-xl font-semibold",
            "flex items-center justify-center gap-2",
            "transition-all duration-200 transform",
            "bg-gradient-to-r from-blue-600 to-blue-500",
            "text-white shadow-lg shadow-blue-500/25",
            "hover:shadow-blue-500/40 hover:shadow-2xl hover:-translate-y-0.5",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-lg disabled:shadow-blue-500/15",
            "active:scale-95"
          )}
        >
          {training ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{t("upload", "training")}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{t("upload", "startTraining")} ({files.length})</span>
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg text-red-400 text-sm" style={{ background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.3)", border: "1px solid" }}>
          <p className="font-medium">⚠ {error}</p>
        </div>
      )}
    </div>
  )
}