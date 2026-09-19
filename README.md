# 🎮 Gaming Hub

Aplicação full-stack para catálogo, avaliação e gestão de jogos.

- **Backend**: Node.js + Express + Prisma (MySQL/MariaDB) + JWT
- **Frontend**: React + Vite + Tailwind CSS + React Router + Axios

O projeto é dividido em **dois repositórios/pastas independentes**, que rodam como dois servidores separados e se comunicam via HTTP:

```
gaming-hub-projeto/
├── gaming-hub-backend/     → API REST (roda em http://localhost:3000)
└── gaming-hub-frontend/    → Interface React (roda em http://localhost:5173)
```

> Os dois precisam estar rodando **ao mesmo tempo**, em terminais separados, para a aplicação funcionar.

---

## ✅ Pré-requisitos

Antes de começar, tenha instalado:

- **Node.js** (versão 18 ou superior) — [nodejs.org](https://nodejs.org)
- **npm** (já vem junto com o Node.js)
- **MySQL ou MariaDB** rodando localmente (ou acessível remotamente)
- Um editor de código (VS Code recomendado)

Para conferir se o Node e o npm estão instalados, rode no terminal:

```bash
node -v
npm -v
```

---

## 📦 Parte 1 — Configurando o Backend

Todos os comandos abaixo devem ser executados **dentro da pasta `gaming-hub-backend`**.

```bash
cd gaming-hub-backend
```

### 1.1. Instalar as dependências

O `package.json` já lista tudo o que é necessário (Express, Prisma, JWT, bcrypt, etc.):

```bash
npm install
```

### 1.2. Configurar as variáveis de ambiente (`.env`)

Crie um arquivo chamado **`.env`** na raiz do backend (mesmo nível do `package.json` e do `server.js`). Existe um `env.example` no projeto — você pode copiar ele como base:

```bash
cp env.example .env
```

E preencher com seus dados reais:

```env
# Conexão do Prisma com o banco de dados (usada pelo schema.prisma)
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"

# Dados de conexão individuais (caso algum script use variáveis separadas)
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="senha"
DB_NAME="nome_do_banco"
DB_PORT=3306

# Chave usada para assinar e validar os tokens JWT (login/autenticação)
JWT_SECRET="uma_frase_secreta_bem_dificil_de_adivinhar"

# Porta em que a API vai rodar (opcional, padrão é 3000)
PORT=3000
```

> ⚠️ Substitua `usuario`, `senha`, `nome_do_banco` e a porta pelos dados reais do seu MySQL/MariaDB local.
>
> ⚠️ **`JWT_SECRET` é obrigatório para produção.** No código atual existe um fallback (`"chave_secreta"`) caso essa variável não seja definida — funciona para testar localmente, mas **defina um valor próprio no `.env`**, ou qualquer pessoa que souber o fallback padrão consegue forjar tokens válidos.

### 1.3. Rodar as migrations do Prisma

Isso cria (ou atualiza) as tabelas no banco de dados definido em `DATABASE_URL`, com base no `prisma/schema.prisma`:

```bash
npx prisma migrate dev
```

Esse comando também gera automaticamente o **Prisma Client** (o código que o `db.js` usa para consultar o banco). Se por algum motivo o client não for gerado, rode manualmente:

```bash
npx prisma generate
```

> 💡 Se o banco de dados (`nome_do_banco`) ainda não existe, crie-o antes de rodar o comando acima (via um cliente MySQL, phpMyAdmin, DBeaver, etc.). O Prisma cria as **tabelas**, mas não cria o banco em si.

### 1.4. Iniciar o servidor do backend

Se o `package.json` tiver um script com `nodemon` (reinicia sozinho a cada alteração):

```bash
npm run dev
```

Ou, para rodar sem `nodemon`:

```bash
node server.js
```

Se tudo deu certo, o terminal deve mostrar:

```
Servidor rodando em http://localhost:3000/
```

Deixe esse terminal aberto — é o backend rodando.

### 1.5. Testar se a API está no ar

Acesse **http://localhost:3000** no navegador. Deve aparecer:

```json
{ "message": "API Gaming Hub rodando com sucesso" }
```

---

## 💻 Parte 2 — Configurando o Frontend

Abra um **novo terminal** (deixe o do backend rodando) e vá até a pasta do frontend:

```bash
cd gaming-hub-frontend
```

### 2.1. Instalar as dependências

```bash
npm install
```

### 2.2. Configurar as variáveis de ambiente (`.env`)

Crie um arquivo **`.env`** na raiz do frontend (mesmo nível do `package.json` e do `index.html`):

```env
VITE_API_URL=http://localhost:3000
```

Essa é a URL que o Axios (`src/services/api.js`) usa para falar com o backend. Se o backend estiver rodando em outra porta, ajuste aqui.

### 2.3. Iniciar o servidor do frontend

```bash
npm run dev
```

O terminal deve mostrar algo como:

```
  VITE ready in ... ms
  ➜  Local:   http://localhost:5173/
```

### 2.4. Acessar a aplicação

Abra **http://localhost:5173** no navegador. Essa é a interface React — ela faz as requisições para `localhost:3000` por trás dos panos.

---

## 🚀 Rodando o projeto completo (resumo)

| Terminal | Pasta | Comando | URL |
|---|---|---|---|
| Terminal 1 (Backend) | `gaming-hub-backend` | `npm run dev` | http://localhost:3000 |
| Terminal 2 (Frontend) | `gaming-hub-frontend` | `npm run dev` | http://localhost:5173 |

Sempre que for trabalhar no projeto, os dois terminais precisam estar abertos e rodando ao mesmo tempo. Só o frontend (`:5173`) é acessado no navegador — o backend (`:3000`) fica "escutando" as requisições em segundo plano.

---

## 🧪 Fluxo de teste sugerido

1. Acesse `http://localhost:5173`.
2. Clique em **Cadastrar**, crie uma conta.
3. Faça **Login** com o e-mail e senha cadastrados.
4. Vá em **Painel Admin** e cadastre uma categoria (se ainda não tiver nenhuma cadastrada — via Thunder Client/Insomnia/Postman direto em `POST http://localhost:3000/categories`, já que o front não tem tela de criar categoria) e um jogo.
5. Volte ao **Catálogo**, veja o jogo aparecer, entre em **Ver Detalhes** e envie uma avaliação.

> 📌 O painel admin do frontend só gerencia **jogos** (criar/editar/excluir). Categorias precisam ser cadastradas diretamente na API por enquanto (ex: usando o Thunder Client, como no arquivo `testeThunderClient.txt` do backend).

---

## 🔧 Solução de problemas comuns

**Erro `EADDRINUSE` (porta já em uso)**
Algum processo já está usando a porta 3000 ou 5173. Feche o processo anterior ou mude a porta no `.env` (backend: `PORT`, frontend: ajuste em `vite.config.js`).

**Tela em branco ou erro de rede no frontend**
Confirme que o backend está rodando (`http://localhost:3000` responde no navegador) e que o `VITE_API_URL` no `.env` do frontend está correto.

**Erro `P1001` ou de conexão no `npx prisma migrate dev`**
O MySQL/MariaDB não está acessível com os dados do `DATABASE_URL`. Confirme que o serviço do banco está rodando e que usuário/senha/porta/nome do banco estão corretos.

**401 Unauthorized ao criar/editar/excluir jogos**
Você precisa estar logado. Verifique se o token está sendo salvo (`localStorage` → chave `@GamingHub:token`) após o login.

**400 Bad Request ao editar um jogo**
Confirme que o `updateGameSchema` do backend (`src/schemas/gameSchema.js`) usa os campos `release_year` e `categories_id_fk` (e não `year`/`categoryId`) — esses nomes precisam bater com as colunas reais da tabela `games`.

---

## 📁 Scripts úteis (rodar dentro de cada pasta)

**Backend**
```bash
npm install          # instala dependências
npx prisma generate  # gera o Prisma Client
npx prisma migrate dev  # aplica migrations no banco
npm run dev           # inicia com nodemon
node server.js        # inicia sem nodemon
```

**Frontend**
```bash
npm install    # instala dependências
npm run dev    # inicia servidor de desenvolvimento
npm run build  # gera build de produção (pasta dist/)
```
