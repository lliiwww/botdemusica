# 🎵 Discord Music Bot (JavaScript)

Bot de música para Discord feito com [discord.js](https://discord.js.org/) e [@discordjs/voice](https://github.com/discordjs/voice), tocando áudio do YouTube via `play-dl`.

## Funcionalidades

- `/play <link ou busca>` — toca ou adiciona à fila uma música do YouTube
- `/skip` — pula a música atual
- `/pause` — pausa a música atual
- `/resume` — retoma a reprodução
- `/stop` — para tudo e limpa a fila
- `/queue` — mostra a fila atual
- Sai automaticamente do canal de voz após 60s de inatividade

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Uma aplicação criada no [Discord Developer Portal](https://discord.com/developers/applications) com um bot

## Instalação

```bash
git clone <url-do-seu-repositorio>
cd discord-music-bot
npm install
```

## Configuração

1. Copie `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

2. Preencha o `.env`:

   ```env
   DISCORD_TOKEN=seu_token_aqui
   CLIENT_ID=seu_client_id_aqui
   GUILD_ID=id_do_servidor_de_testes   # opcional, mas recomendado em dev
   ```

3. No Discord Developer Portal, na aba **Bot**, ative a intent **Message Content Intent**.

4. Gere o link de convite em **OAuth2 > URL Generator**, marcando os escopos `bot` e `applications.commands`, e as permissões:
   - View Channels
   - Send Messages
   - Connect
   - Speak

## Registrando os comandos

```bash
npm run deploy
```

## Executando o bot

```bash
npm start
```

## Estrutura do projeto

```
music-bot/
├── commands/        # cada slash command em um arquivo
├── musicManager.js   # fila de músicas e player por servidor
├── deploy-commands.js
├── index.js
├── package.json
└── .env.example
```

## Publicando no GitHub

```bash
git init
git add .
git commit -m "Initial commit: bot de música em JavaScript"
git branch -M main
git remote add origin <url-do-seu-repositorio-no-github>
git push -u origin main
```

O arquivo `.gitignore` já garante que `node_modules/` e `.env` (com seu token) não sejam enviados ao repositório.

## Hospedagem

Para manter o bot online 24/7, você pode hospedar em serviços como Railway, Render, ou uma VPS. Lembre-se de configurar as mesmas variáveis de ambiente (`DISCORD_TOKEN`, `CLIENT_ID`) na plataforma escolhida.
