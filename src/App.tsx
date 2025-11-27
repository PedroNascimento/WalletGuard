import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Receitas } from './pages/receitas/Receitas';
import { Despesas } from './pages/despesas/Despesas';
import { Cartoes } from './pages/cartoes/Cartoes';
import { GastosCartao } from './pages/cartoes/GastosCartao';
import { Bancos } from './pages/bancos/Bancos';
import { Reports } from './pages/reports/Reports';
import { Settings } from './pages/settings/Settings';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* App Routes */}
            <Route element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/receitas" element={<Receitas />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="/cartoes" element={<Cartoes />} />
              <Route path="/cartoes/:id/gastos" element={<GastosCartao />} />
              <Route path="/bancos" element={<Bancos />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
