import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const STORAGE_KEY = "jeevitham-authenticated";
const DEMO_EMAIL = "admin@jeevitham.in";
const DEMO_PASSWORD = "123456";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    setIsAuthenticated(storedValue === "true");
  }, []);

  const login = useCallback((email: string, password: string) => {
    const emailMatches = email.trim().toLowerCase() === DEMO_EMAIL;
    const passwordMatches = password === DEMO_PASSWORD;

    if (!emailMatches || !passwordMatches) {
      return false;
    }

    window.localStorage.setItem(STORAGE_KEY, "true");
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
