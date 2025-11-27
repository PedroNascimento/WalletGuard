# 📱 Guia de Instalação PWA (Progressive Web App)

O **WalletGuard** está configurado como um PWA, o que significa que você pode instalá-lo no seu celular ou computador como se fosse um aplicativo nativo.

## ✨ Benefícios

- **Instalação:** Acesso direto da tela inicial.
- **Offline:** Funciona mesmo sem internet (cache de páginas visitadas).
- **Performance:** Carregamento instantâneo.
- **Tela Cheia:** Experiência imersiva sem barra de endereço.

---

## 🛠️ Configuração Inicial (Desenvolvedor)

O projeto já está configurado com `vite-plugin-pwa`.

### 1. Ícones do Aplicativo

Para que o PWA seja instalável, é necessário ter os ícones na pasta `public`.
Você deve adicionar os seguintes arquivos na pasta `public/`:

- `pwa-192x192.png` (Ícone 192x192px)
- `pwa-512x512.png` (Ícone 512x512px)
- `apple-touch-icon.png` (Ícone 180x180px para iOS)
- `favicon.ico` (Ícone padrão)

> **Nota:** Um ícone sugerido foi gerado pelo assistente. Você pode redimensioná-lo e salvar com os nomes acima.

### 2. Testando Localmente

O Service Worker só funciona em modo de produção ou preview.

```bash
# Construir o projeto
npm run build

# Visualizar a versão de produção
npm run preview
```

Acesse a URL mostrada (geralmente `http://localhost:4173`).

---

## 📲 Como Instalar no Celular

### Android (Chrome)

1. Acesse a URL do aplicativo no Chrome.
2. Toque no ícone de menu (três pontos) no canto superior direito.
3. Selecione **"Adicionar à tela inicial"** ou **"Instalar aplicativo"**.
4. Confirme a instalação.

### iOS (Safari)

1. Acesse a URL do aplicativo no Safari.
2. Toque no botão **Compartilhar** (quadrado com seta para cima).
3. Role para baixo e selecione **"Adicionar à Tela de Início"**.
4. Toque em **Adicionar** no canto superior direito.

---

## 💻 Como Instalar no Computador

### Chrome / Edge

1. Acesse a URL do aplicativo.
2. Na barra de endereço, clique no ícone de **Instalar** (computador com seta para baixo) no lado direito.
3. Clique em **Instalar**.

---

## 🔄 Atualizações

O aplicativo está configurado para **atualização automática**.
Quando uma nova versão for publicada, o aplicativo a baixará em segundo plano e a aplicará na próxima visita.
