import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Settings: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
                <p className="text-gray-500">Gerencie suas preferências e conta</p>
            </div>

            <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Perfil</h3>
                <form className="space-y-4 max-w-md">
                    <Input label="Nome" defaultValue="Usuário Exemplo" />
                    <Input label="E-mail" defaultValue="usuario@exemplo.com" disabled />
                    <Button>Salvar Alterações</Button>
                </form>
            </Card>
        </div>
    );
};
