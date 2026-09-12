# Este REAMD é temporário.
# Não leve esse readme a sério (-mateus)

# OBS: Cada um programe na sua branch

Através deste código você terá acesso a:

Estrutura MVP + Routes para usar em um projeto que utiliza o Prisma ORM em sua versão 7.10.0
--- <br><br>

# 🚀 Como Executar o Projeto

Este guia contém o passo a passo completo para configurar e rodar a aplicação em seu ambiente local.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- Banco de dados **MySQL** ou **MariaDB** rodando localmente

---

## 🛠️ Passo a Passo para Execução

### 1. Instalar as Dependências
Como as dependências do projeto (Express, Nodemon, Prisma, etc.) já estão declaradas no `package.json`, execute o comando abaixo no terminal para instalar todos os pacotes necessários:

```bash
npm install
```

### 2. Configurar as Variáveis de Ambiente (.env)
Crie um arquivo chamado `.env` na raiz do projeto (no mesmo nível do `package.json`) e adicione a string de conexão com o seu banco de dados MariaDB/MySQL:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
```
```env
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="senha"
DB_NAME="nome_do_banco"
DB_PORT=3306
```
> ⚠️ **Nota:** Substitua `usuario`, `senha`, a porta (se for diferente de `3306`) e `nome_do_banco` com as credenciais reais do seu ambiente local.

### 3. Sincronizar o Prisma com o Banco de Dados
Com a pasta `node_modules` gerada e o arquivo `.env` configurado, execute os comandos do CLI do Prisma para gerar o Prisma Client v7 e sincronizar a estrutura das tabelas no seu banco de dados:

```bash
# Gera os tipos e o código do Prisma Client v7
npx prisma generate

# Cria e atualiza as tabelas diretamente no seu banco de dados
# Lembre de criar as tabelas antes
npx prisma db push # OU
npx prisma migrate dev --name init
```

### 4. Iniciar a Aplicação em Modo de Desenvolvimento
Como o script `"dev"` já está configurado no `package.json` (executando o `nodemon server.js`), basta dar o comando de inicialização:

```bash
npm run dev
```

---
Pronto! Sua aplicação estará rodando em modo de desenvolvimento.

