import React, { createContext, useEffect } from "react";
import { create } from "zustand";
import { api } from "../api/http";

export type UserRole = "User" | "Lender" | "Admin";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: UserRole;
  photo?: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initDone: boolean;
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    surname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithApple: (idToken: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initDone: false,

  loadUser: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ loading: false, initDone: true, user: null });
      return;
    }
    try {
      const res = await api.get<User>("/users/info");
      set({ user: res.data, loading: false, initDone: true });
    } catch (e) {
      console.error("Failed to load user info", e);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null, loading: false, initDone: true });
    }
  },

  login: async (email, password) => {
    const resp = await api.post<{ accessToken: string }>("/auth/login", {
      email,
      password
    });
    const { accessToken } = resp.data;
    localStorage.setItem("accessToken", accessToken);
    const me = await api.get<User>("/users/info");
    set({ user: me.data });
  },

  register: async ({ name, surname, email, password }) => {
    const resp = await api.post<{ accessToken: string }>("/auth/register", {
      name,
      surname,
      email,
      password,
      role: "User"
    });
    const { accessToken } = resp.data;
    localStorage.setItem("accessToken", accessToken);
    const me = await api.get<User>("/users/info");
    set({ user: me.data });
  },

  loginWithGoogle: async (credential) => {
    const resp = await api.post<{
      accessToken: string;
      refreshToken?: string;
    }>("/auth/ssgoogle", { token: credential });

    localStorage.setItem("accessToken", resp.data.accessToken);
    if (resp.data.refreshToken) {
      localStorage.setItem("refreshToken", resp.data.refreshToken);
    }

    const me = await api.get<User>("/users/info");
    set({ user: me.data });
  },

  loginWithApple: async (idToken) => {
    const resp = await api.post<{
      accessToken: string;
      refreshToken?: string;
    }>("/auth/apple", { token: idToken });

    localStorage.setItem("accessToken", resp.data.accessToken);
    if (resp.data.refreshToken) {
      localStorage.setItem("refreshToken", resp.data.refreshToken);
    }

    const me = await api.get<User>("/users/info");
    set({ user: me.data });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null });
  }
}));

const AuthContext = createContext(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const loadUser = useAuthStore((s) => s.loadUser);
  const initDone = useAuthStore((s) => s.initDone);

  useEffect(() => {
    if (!initDone) {
      void loadUser();
    }
  }, [initDone, loadUser]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useAuthStore();
