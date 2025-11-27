import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Shield } from "lucide-react";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo and Header */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
              alt="WalletGuard"
              className="h-28 w-auto object-contain"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-900 dark:text-primary-100">
          Bem-vindo
        </h2>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
          Gerencie suas finanças com segurança e inteligência
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
          <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={loading}>
          Entrar
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Criar conta gratuita
          </Link>
        </p>
      </div>
    </div>
  );
};
