import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/dashboard-page";
import { LoginPage } from "./pages/login-page";
import { ProtectedRoute } from "./routes/protected-route";
import { useAuth } from "./contexts/auth-context";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Avoid a flash redirect to the login page while a stored session token
    // is still being verified against the server.
    return (
      <div className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-background text-sm text-muted-foreground">
        Loading Jeevitham…
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;
