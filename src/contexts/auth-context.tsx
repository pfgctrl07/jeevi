import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type AuthUser, clearAuthToken, getAuthToken, setAuthToken } from "@/lib/api";

type AuthResult = { success: true } | { success: false; error: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string,
    role: AuthUser["role"],
  ) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // A stored token only proves a session existed on this device — confirm
    // with the server it's still valid before trusting it, since it may have
    // expired or been signed with a secret the server no longer uses.
    if (!getAuthToken()) {
      setIsLoading(false);
      return;
    }

    api
      .me()
      .then(({ user: validUser }) => setUser(validUser))
      .catch(() => clearAuthToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { token, user: loggedInUser } = await api.login({ email, password });
      setAuthToken(token);
      setUser(loggedInUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: errorMessage(err) };
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: AuthUser["role"],
    ): Promise<AuthResult> => {
      try {
        const { token, user: newUser } = await api.register({ name, email, password, role });
        setAuthToken(token);
        setUser(newUser);
        return { success: true };
      } catch (err) {
        return { success: false, error: errorMessage(err) };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
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
