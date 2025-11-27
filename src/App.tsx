import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import { AuthLayout } from "./layouts/AuthLayout";
import { AppLayout } from "./layouts/AppLayout";

// Lazy loading pages
const Login = React.lazy(() =>
  import("./pages/auth/Login").then((module) => ({ default: module.Login })),
);
const Signup = React.lazy(() =>
  import("./pages/auth/Signup").then((module) => ({ default: module.Signup })),
);
const ForgotPassword = React.lazy(() =>
  import("./pages/auth/ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  })),
);
const Dashboard = React.lazy(() =>
  import("./pages/dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const Receitas = React.lazy(() =>
  import("./pages/receitas/Receitas").then((module) => ({
    default: module.Receitas,
  })),
);
const Despesas = React.lazy(() =>
  import("./pages/despesas/Despesas").then((module) => ({
    default: module.Despesas,
  })),
);
const Cartoes = React.lazy(() =>
  import("./pages/cartoes/Cartoes").then((module) => ({
    default: module.Cartoes,
  })),
);
const GastosCartao = React.lazy(() =>
  import("./pages/cartoes/GastosCartao").then((module) => ({
    default: module.GastosCartao,
  })),
);
const Bancos = React.lazy(() =>
  import("./pages/bancos/Bancos").then((module) => ({
    default: module.Bancos,
  })),
);
const Relatorios = React.lazy(() =>
  import("./pages/relatorios/Relatorios").then((module) => ({
    default: module.Relatorios,
  })),
);
const Settings = React.lazy(() =>
  import("./pages/settings/Settings").then((module) => ({
    default: module.Settings,
  })),
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                {/* App Routes */}
                <Route
                  element={
                    <RequireAuth>
                      <AppLayout />
                    </RequireAuth>
                  }
                >
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/receitas" element={<Receitas />} />
                  <Route path="/despesas" element={<Despesas />} />
                  <Route path="/cartoes" element={<Cartoes />} />
                  <Route
                    path="/cartoes/:id/gastos"
                    element={<GastosCartao />}
                  />
                  <Route path="/bancos" element={<Bancos />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="/configuracoes" element={<Settings />} />
                </Route>

                {/* Fallback */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
