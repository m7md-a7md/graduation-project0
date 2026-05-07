// lib/api.ts

export type AgentType = "customer_support" | "knowledge_base" | "analysis"
export type AiStatus = "idle" | "processing" | "ready" | "failed"

export type Agent = {
  agent_id: string
  name: string
  agent_type: AgentType
  ai_status: AiStatus
  file_name: string | null      // ← أول ملف
  file_path: string | null
  files: { name: string; path: string }[]  // ← كل الملفات
}

export type Widget = {
  widget_id: string
  agent_id: string
  active: boolean
  public_key: string
  embed_code: string
  welcome_message: string
}

// ── Persist helpers ──
const AGENTS_KEY = "mock_agents"
const WIDGETS_KEY = "mock_widgets"

const loadAgents = (): Agent[] => {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(AGENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveAgents = (agents: Agent[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents))
}

const loadWidgets = (): Widget[] => {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(WIDGETS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveWidgets = (widgets: Widget[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgets))
}

// ── Agent Functions ──

export const getAgents = async (): Promise<Agent[]> => {
  return loadAgents()
}

export const getAgent = async (id: string): Promise<Agent | null> => {
  const agents = loadAgents()
  return agents.find((a) => a.agent_id === id) ?? null
}

export const createAgent = async (
  name: string,
  agent_type: AgentType
): Promise<Agent> => {
  const agents = loadAgents()
  const newAgent: Agent = {
    agent_id: crypto.randomUUID(),
    name,
    agent_type,
    ai_status: "idle",
    file_name: null,
    file_path: null,
    files: [],
  }
  saveAgents([...agents, newAgent])
  return newAgent
}

export const deleteAgent = async (agentId: string): Promise<void> => {
  const agents = loadAgents().filter((a) => a.agent_id !== agentId)
  saveAgents(agents)
}

// ── File Functions ──

export const deleteFile = async (agentId: string, fileName: string): Promise<void> => {
  const agents = loadAgents().map((a) => {
    if (a.agent_id !== agentId) return a
    const files = (a.files || []).filter((f) => f.name !== fileName)
    return {
      ...a,
      files,
      file_name: files[0]?.name ?? null,
      file_path: files[0]?.path ?? null,
    }
  })
  saveAgents(agents)
}
export const uploadFile = async (agentId: string, file: File): Promise<void> => {
  const agents = loadAgents().map((a) => {
    if (a.agent_id !== agentId) return a
    const newFile = { name: file.name, path: `/files/${file.name}` }
    const files = [...(a.files || []), newFile]
    return {
      ...a,
      files,
      file_name: files[0].name,
      file_path: files[0].path,
    }
  })
  saveAgents(agents)
}

// ── Training Functions ──

export const trainAgent = async (agentId: string): Promise<void> => {
  const agents = loadAgents().map((a) =>
    a.agent_id === agentId ? { ...a, ai_status: "processing" as AiStatus } : a
  )
  saveAgents(agents)

  // Simulate training — after 5s set to ready
  setTimeout(() => {
    const updated = loadAgents().map((a) =>
      a.agent_id === agentId ? { ...a, ai_status: "ready" as AiStatus } : a
    )
    saveAgents(updated)
  }, 5000)
}

export const testAgent = async (
  agentId: string,
  message: string
): Promise<string> => {
  return `Mock response for: "${message}"`
}

// ── Widget Functions ──

export const getWidget = async (agentId: string): Promise<Widget | null> => {
  const widgets = loadWidgets()
  return widgets.find((w) => w.agent_id === agentId) ?? null
}

export const createWidget = async (agentId: string): Promise<Widget> => {
  const publicKey = `pk_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`
  const newWidget: Widget = {
    widget_id: crypto.randomUUID(),
    agent_id: agentId,
    active: true,
    public_key: publicKey,
    embed_code: `<script src="https://yourapp.com/widget.js" data-public-key="${publicKey}" defer></script>`,
    welcome_message: "Hi! How can I help you?",
  }
  const widgets = loadWidgets()
  saveWidgets([...widgets, newWidget])
  return newWidget
}