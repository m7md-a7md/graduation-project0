import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "@/lib/authApi";
import type { User } from "@/lib/authApi";

interface AuthState {
  user:         User | null;
  accessToken:  string | null;
  isLoading:    boolean;
  error:        string | null;

  isLoggedIn:   () => boolean;

  register:     (name: string, email: string, password: string) => Promise<void>;
  login:        (email: string, password: string) => Promise<void>;
  logout:       () => Promise<void>;
  refreshToken: () => Promise<void>;

  fetchProfile:       () => Promise<void>;
  updateName:         (name: string) => Promise<void>;
  changePassword:     (oldPw: string, newPw: string) => Promise<void>;
  forgotPassword:     (email: string) => Promise<void>;
  resetPassword:      (token: string, newPw: string) => Promise<void>;
  requestEmailChange: (newEmail: string) => Promise<void>;
  deleteAccount:      () => Promise<void>;

  _setError:   (msg: string | null) => void;
  _clearAuth:  () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:        null,
      accessToken: null,
      isLoading:   false,
      error:       null,

      isLoggedIn: () => !!get().accessToken && !!get().user,

      _setError:  (msg) => set({ error: msg }),
      _clearAuth: () => {
        // امسح من الـ store والـ localStorage
        localStorage.removeItem("access_token")
        set({ user: null, accessToken: null, error: null })
      },

      // ── Register ──────────────────────────────────────────
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.register(name, email, password);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Registration failed";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Login ─────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.login(email, password);

          set({ accessToken: res.access_token });

          localStorage.setItem("access_token", res.access_token);

          await get().fetchProfile();
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Login failed";
          set({ error: msg });
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Logout ────────────────────────────────────────────
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = get().accessToken;
          if (token) await api.logout(token);
        } catch {
          // حتى لو فشل → امسح
        } finally {
          get()._clearAuth();
          set({ isLoading: false });
        }
      },

      // ── Refresh Token ─────────────────────────────────────
      refreshToken: async () => {
        try {
          const res = await api.refreshToken();
          set({ accessToken: res.access_token });
          localStorage.setItem("access_token", res.access_token);
        } catch {
          get()._clearAuth();
        }
      },

      // ── Fetch Profile ─────────────────────────────────────
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

      // ── Update Name ───────────────────────────────────────
      updateName: async (name) => {
        const token = get().accessToken;
        if (!token) return;
        set({ isLoading: true, error: null });
        try {
          await api.updateProfileName(name, token);
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

      // ── Change Password ───────────────────────────────────
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

      // ── Forgot Password ───────────────────────────────────
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

      // ── Reset Password ────────────────────────────────────
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

      // ── Request Email Change ──────────────────────────────
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

      // ── Delete Account ────────────────────────────────────
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
      name: "agentlab-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);