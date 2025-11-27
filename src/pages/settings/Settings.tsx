import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { userService } from "../../services/user.service";
import { User, Lock, Moon, Sun, Download, Save, Camera } from "lucide-react";
import { saveAs } from "file-saver";

export const Settings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    try {
      setUploadingAvatar(true);
      const url = await userService.uploadAvatar(file);
      setAvatarUrl(url);
      await refreshUser();
      addToast("Foto de perfil atualizada!", "success");
    } catch (error) {
      console.error(error);
      addToast(
        'Erro ao atualizar foto. Verifique se o bucket "avatars" existe e é público.',
        "error",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingProfile(true);
      await userService.updateProfile(name, avatarUrl || undefined);
      await refreshUser();
      addToast("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      console.error(error);
      addToast("Erro ao atualizar perfil.", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast("As senhas não coincidem.", "error");
      return;
    }
    if (password.length < 6) {
      addToast("A senha deve ter pelo menos 6 caracteres.", "error");
      return;
    }

    try {
      setLoadingPassword(true);
      await userService.updatePassword(password);
      addToast("Senha atualizada com sucesso!", "success");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      addToast("Erro ao atualizar senha.", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await userService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      saveAs(
        blob,
        `walletguard-backup-${new Date().toISOString().split("T")[0]}.json`,
      );
      addToast("Download iniciado!", "success");
    } catch (error) {
      console.error(error);
      addToast("Erro ao exportar dados.", "error");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie suas preferências e conta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User className="text-primary-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Perfil
            </h3>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <User size={40} />
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-md"
              >
                <Camera size={16} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </div>
            {uploadingAvatar && (
              <p className="text-xs text-gray-500">Enviando...</p>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="E-mail"
              value={user?.email || ""}
              disabled
              className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
            <Button
              type="submit"
              isLoading={loadingProfile}
              className="w-full gap-2"
            >
              <Save size={18} />
              Salvar Alterações
            </Button>
          </form>
        </Card>

        {/* Aparência */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            {theme === "dark" ? (
              <Moon className="text-purple-500" size={20} />
            ) : (
              <Sun className="text-orange-500" size={20} />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aparência
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Alternar entre modo claro e escuro.
            </p>
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="w-full justify-between"
            >
              <span>Modo {theme === "dark" ? "Escuro" : "Claro"}</span>
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
          </div>
        </Card>

        {/* Segurança */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="text-red-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Segurança
            </h3>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="Nova Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              isLoading={loadingPassword}
              className="w-full"
            >
              Atualizar Senha
            </Button>
          </form>
        </Card>

        {/* Dados */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Download className="text-green-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Seus Dados
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Faça o download de todos os seus dados em formato JSON para
              backup.
            </p>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full gap-2"
            >
              <Download size={18} />
              Exportar Meus Dados
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        WalletGuard v1.3.0
      </div>
    </div>
  );
};
