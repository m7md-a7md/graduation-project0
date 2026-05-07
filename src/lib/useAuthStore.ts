// ─────────────────────────────────────────────────────────────
//  Auth Store — Zustand
//  Manages: access_token, user, loading, error states
//  Install: npm install zustand
// ─────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "@/lib/authApi";
import type { User } from "@/lib/authApi";

// ── State shape ───────────────────────────────────────────────
interface AuthState {
  // Data
  user:         User | null;
  accessToken:  string | null;
  isLoading:    boolean;
  error:        string | null;

  // Computed helpers
  isLoggedIn:   () => boolean;

  // Actions — Auth
  register:     (name: string, email: string, password: string) => Promise<void>;
  login:        (email: string, password: string) => Promise<void>;
  logout:       () => Promise<void>;
  refreshToken: () => Promise<void>;

  // Actions — Profile
  fetchProfile:       () => Promise<void>;
  updateName:         (name: string) => Promise<void>;
  changePassword:     (oldPw: string, newPw: string) => Promise<void>;
  forgotPassword:     (email: string) => Promise<void>;
  resetPassword:      (token: string, newPw: string) => Promise<void>;
  requestEmailChange: (newEmail: string) => Promise<void>;
  deleteAccount:      () => Promise<void>;

  // Internal helpers
  _setError:   (msg: string | null) => void;
  _clearAuth:  () => void;
}

// ── Store ─────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────
      user:        null,
      accessToken: null,
      isLoading:   false,
      error:       null,

      // ── Computed ───────────────────────────────────────────
      isLoggedIn: () => !!get().accessToken && !!get().user,

      // ── Internal helpers ───────────────────────────────────
      _setError:  (msg) => set({ error: msg }),
      _clearAuth: () => set({ user: null, accessToken: null, error: null }),

      // ══════════════════════════════════════════════════════
      //  1) Register
      // ══════════════════════════════════════════════════════
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.register(name, email, password);
          // No token returned — user must verify email then login
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Registration failed";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  4) Login
      // ══════════════════════════════════════════════════════
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.login(email, password);
          set({ accessToken: res.access_token });
          // Fetch profile after successful login
          await get().fetchProfile();
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Login failed";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  5) Logout
      // ══════════════════════════════════════════════════════
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = get().accessToken;
          if (token) await api.logout(token);
        } catch {
          // Even if API fails, clear local state
        } finally {
          get()._clearAuth();
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  6) Refresh token
      // ══════════════════════════════════════════════════════
      refreshToken: async () => {
        try {
          const res = await api.refreshToken();
          set({ accessToken: res.access_token });
        } catch {
          get()._clearAuth();
        }
      },

      // ══════════════════════════════════════════════════════
      //  7) Get profile
      // ══════════════════════════════════════════════════════
      fetchProfile: async () => {
        const token = get().accessToken;
        if (!token) return;
        try {
          const user = await api.getProfile(token);
          set({ user });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to fetch profile";
          set({ error: msg });
        }
      },

      // ══════════════════════════════════════════════════════
      //  8) Update name
      // ══════════════════════════════════════════════════════
      updateName: async (name) => {
        const token = get().accessToken;
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          await api.updateProfileName(name, token);
          // Update local user state optimistically
          const user = get().user;
          if (user) set({ user: { ...user, name } });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to update name";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  9) Change password (inside account)
      // ══════════════════════════════════════════════════════
      changePassword: async (oldPw, newPw) => {
        const token = get().accessToken;
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          await api.changePasswordInside(oldPw, newPw, token);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to change password";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  10) Forgot password
      // ══════════════════════════════════════════════════════
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await api.forgotPassword(email);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to send reset link";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  11) Reset password by token (from email link)
      // ══════════════════════════════════════════════════════
      resetPassword: async (token, newPw) => {
        set({ isLoading: true, error: null });
        try {
          await api.resetPasswordByToken(token, newPw);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to reset password";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  12) Request email change
      // ══════════════════════════════════════════════════════
      requestEmailChange: async (newEmail) => {
        const token = get().accessToken;
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          await api.requestEmailChange(newEmail, token);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to request email change";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ══════════════════════════════════════════════════════
      //  14) Delete account
      // ══════════════════════════════════════════════════════
      deleteAccount: async () => {
        const token = get().accessToken;
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          await api.deleteProfile(token);
          get()._clearAuth();
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Failed to delete account";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    {
      name: "agentlab-auth",           // localStorage key
      partialize: (state) => ({        // only persist token (not loading/error)
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);