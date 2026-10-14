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

export function AuthProvider({ children }: AuthProviderProps) {
 
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
   const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const navigate = useNavigate()
  const permissions = user?.permissions ?? [];

  const login = (newToken: string, user: any) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(user))
    console.log("Before navigate:", window.location.pathname);
    setToken(newToken)
    setUser(user)
    navigate('/dashboard', { replace: true })
    console.log("Before navigate:", window.location.pathname);
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }



const hasPermission = (permission: Permission) =>
    permissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        permissions,
        login,
        logout,
        isLoggedIn: !!token,
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