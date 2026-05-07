import { create } from 'zustand';
import { Agent, User } from '@/app/components/home/types';

interface DashboardStore {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Agents
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, agent: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  // Selected Agent
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;

  // UI State
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  // User
  user: {
    id: '1',
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
  },
  setUser: (user) => set({ user }),

  // Agents - Mock Data
  agents: [
    {
      id: '1',
      name: 'Customer Support Bot',
      agent_type: 'customer_support',
      status: 'active',
      ai_status: 'ready',
      file_name: 'support-docs.pdf',
      file_path: '/files/support-docs.pdf',
      file_type: 'pdf',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sales Assistant',
      agent_type: 'knowledge_base',
      status: 'active',
      ai_status: 'processing',
      file_name: null,
      file_path: null,
      file_type: null,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Data Analyzer',
      agent_type: 'analysis',
      status: 'inactive',
      ai_status: 'idle',
      file_name: null,
      file_path: null,
      file_type: null,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  setAgents: (agents) => set({ agents }),

  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, agent],
    })),

  updateAgent: (id, updatedAgent) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, ...updatedAgent } : agent
      ),
    })),

  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== id),
      selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
    })),

  // Selected Agent
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),

  // UI State
  isCreateModalOpen: false,
  setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
}));