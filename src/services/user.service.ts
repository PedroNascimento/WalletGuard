import { supabase } from './supabase';

export const userService = {
    async uploadAvatar(file: File) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        await this.updateProfile(user.user_metadata.name || '', publicUrl);

        return publicUrl;
    },

    async updateProfile(name: string, avatarUrl?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const updates: any = { name };
        if (avatarUrl) updates.avatar_url = avatarUrl;

        // Atualizar metadados do Auth
        const { error: authError } = await supabase.auth.updateUser({
            data: updates
        });
        if (authError) throw authError;

        // Atualizar tabela app_users
        const { error: dbError } = await supabase
            .from('app_users')
            .update({ name })
            .eq('id', user.id);

        if (dbError) throw dbError;
    },

    async updatePassword(password: string) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
    },

    async exportData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data: receitas } = await supabase.from('receitas').select('*').eq('user_id', user.id);
        const { data: despesas } = await supabase.from('expenses').select('*').eq('user_id', user.id);
        const { data: bancos } = await supabase.from('banks').select('*').eq('user_id', user.id);
        const { data: cartoes } = await supabase.from('cards').select('*').eq('user_id', user.id);

        return {
            receitas,
            despesas,
            bancos,
            cartoes,
            exportDate: new Date().toISOString()
        };
    }
};
