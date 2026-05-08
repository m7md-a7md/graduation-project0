// lib/api.ts
import axiosInstance from "@/lib/axios"

// ── Types ────────────────────────────────────────────────────────
export type AgentType = "customer_support" | "knowledge_base" | "analysis"
export type AiStatus = "idle" | "processing" | "ready" | "failed"

export type Agent = {
  agent_id: string
  user_id: string
  name: string
  agent_type: AgentType
  ai_status: AiStatus
  status: string
  file_name: string | null
  file_path: string | null
  file_key: string | null
  file_type: string | null
  // للتوافق مع الكود القديم
  files?: { name: string; path: string }[]
}

export type Widget = {
  widget_id: string
  agent_id: string
  active: boolean
  expire_at: string | null
  welcome_message: string
  position: string
  theme_config: {
    primaryColor: string
    textColor: string
  }
  // للتوافق مع الكود القديم
  public_key?: string
  embed_code?: string
}

export type CreateWidgetPayload = {
  welcome_message?: string
  position?: string
  theme_config?: {
    primaryColor: string
    textColor: string
  }
  expire_at?: string | null
}

// ── Agent Functions ──────────────────────────────────────────────

export const getAgents = async (): Promise<Agent[]> => {
  const { data } = await axiosInstance.get("/agents")
  return data
}

export const getAgent = async (id: string): Promise<Agent | null> => {
  try {
    const { data } = await axiosInstance.get(`/agents/${id}`)
    return data
  } catch {
    return null
  }
}

export const createAgent = async (
  name: string,
  agent_type: AgentType
): Promise<Agent> => {
  const { data } = await axiosInstance.post("/agents", { name, agent_type })
  return data
}

export const deleteAgent = async (agentId: string): Promise<void> => {
  await axiosInstance.delete(`/agents/${agentId}`)
}

// ── File Functions ───────────────────────────────────────────────

export const uploadFile = async (agentId: string, file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)

  await axiosInstance.post(`/upload/${agentId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const deleteFile = async (agentId: string): Promise<void> => {
  await axiosInstance.delete(`/upload/${agentId}/delete`)
}

// ── Training Functions ───────────────────────────────────────────

export const trainAgent = async (agentId: string): Promise<void> => {
  await axiosInstance.post(`/agents/${agentId}/train`, {})
}

export const testAgent = async (
  agentId: string,
  message: string
): Promise<string> => {
  const { data } = await axiosInstance.post(`/agents/${agentId}/test`, { message })
  return data.answer
}

// ── Widget Functions ─────────────────────────────────────────────

export const getWidget = async (agentId: string): Promise<Widget | null> => {
  try {
    const { data } = await axiosInstance.get(`/widgets/${agentId}`)
    return data.widget ?? null
  } catch {
    return null
  }
}

export const createWidget = async (
  agentId: string,
  payload: CreateWidgetPayload = {}
): Promise<Widget & { publicKey: string; embed_code: string }> => {
  const body: CreateWidgetPayload = {
    welcome_message: "Hi! How can I help you?",
    position: "bottom-right",
    theme_config: {
      primaryColor: "#111827",
      textColor: "#ffffff",
    },
    expire_at: null,
    ...payload,
  }

  const { data } = await axiosInstance.post(`/widgets/${agentId}`, body)

  // لو الـ widget موجود بالفعل، السيرفر بيرجع الموجود
  const widget = data.widget
  return {
    ...widget,
    publicKey: data.publicKey,
    embed_code: data.embed_code,
    // للتوافق مع الكود القديم
    public_key: data.publicKey,
  }
}

export const deleteWidget = async (agentId: string): Promise<void> => {
  await axiosInstance.delete(`/widgets/${agentId}`)
}

// ── Public Widget Functions (لا تحتاج Auth) ──────────────────────

export const initWidgetSession = async (
  publicKey: string
): Promise<{ session_id: string; widget: Partial<Widget> }> => {
  const { data } = await axiosInstance.post(
    "/public/widgets/session",
    {},
    {
      headers: { "x-public-key": publicKey },
    }
  )
  return data
}

export const askWidget = async (
  message: string,
  session_id: string,
  publicKey: string
): Promise<{ answer: string; sources: string[] }> => {
  const { data } = await axiosInstance.post(
    "/public/widgets/ask",
    { message, session_id },
    {
      headers: { "x-public-key": publicKey },
    }
  )
  return data
}