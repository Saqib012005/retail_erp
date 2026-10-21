import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react" 
import { useNavigate } from "react-router-dom"

export type Permission = string;
type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  permissions: Permission[];
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  permissions: Permission[];
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  hasPermission: (permission: Permission) => boolean;
};




const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

const DEFAULT_DEV_USER: User = {
  id: 1,
  email: "admin@streamys.in",
  name: "Arjun Sharma",
  role: "ADMIN",
  permissions: ["*"],
}

const DEFAULT_DEV_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzdHJlYW15cy5pbiIsIm1haWwiOiJhZG1pbkBzdHJlYW15cy5pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc5MjU2MzU5NywiZXhwIjoyMTA3OTIzNTk3fQ.405po7ixiFtZoel54pjP4uN0w_KKOEWW1t95ALf1PcY"

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || DEFAULT_DEV_TOKEN
  )
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : DEFAULT_DEV_USER
  })
  const navigate = useNavigate()

  // Ensure localStorage is populated with default dev session if not set
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", DEFAULT_DEV_TOKEN)
    }
    if (!localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(DEFAULT_DEV_USER))
    }
  }

  const permissions = user?.permissions ?? ["*"]

  const login = (newToken: string, user: any) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(newToken)
    setUser(user)
    navigate("/dashboard", { replace: true })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    navigate("/login", { replace: true })
  }

  const hasPermission = (_permission: Permission) => true

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        permissions,
        login,
        logout,
        isLoggedIn: true,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};