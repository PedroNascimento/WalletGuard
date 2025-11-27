import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Depending on email confirmation settings, you might want to show a message instead
      navigate("/dashboard");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Faça login
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" isLoading={loading}>
          Criar conta
        </Button>
      </form>
    </div>
  );
};
