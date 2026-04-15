# Urban Wear Store - Servidor Backend

Servidor Express.js completo com autenticação, gerenciamento de sessões e integração com MySQL.

## 📋 Pré-requisitos

- **Node.js** (v14 ou superior) - [Download](https://nodejs.org)
- **MySQL** (v5.7 ou superior) - [Download](https://dev.mysql.com/downloads/mysql/)
- **npm** (vem com Node.js)

## 🚀 Instalação Rápida

### 1️⃣ Instalar Node.js

Se ainda não tiver instalado, baixe e instale de https://nodejs.org

Verifique a instalação aberto PowerShell e digitando:

```powershell
node --version
npm --version
```

### 2️⃣ Instalar as dependências do projeto

Abra o PowerShell na pasta do projeto:

```powershell
cd "C:\Users\DS1\Desktop\I1DS-2026\Urban Wear"
npm install
```

### 3️⃣ Criar o banco de dados

Abra o MySQL Command Line Client ou MySQL Workbench e execute o arquivo `database.sql`:

```sql
source C:/Users/DS1/Desktop/I1DS-2026/Urban\ Wear/database.sql;
```

Ou copie o conteúdo do arquivo `database.sql` e execute no MySQL.

### 4️⃣ Configurar variáveis de ambiente

O arquivo `.env` já foi criado com valores padrão. Se necessário, edite-o:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=urban_wear_db
JWT_SECRET=sua-chave-secreta-super-segura-2026
```

## 🏃 Como Executar

### Modo Produção

```powershell
npm start
```

### Modo Desenvolvimento (com auto-reload)

```powershell
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

## 📝 Endpoints da API

### Autenticação

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Senha@123"
}
```

**Resposta:**

```json
{
  "sessionToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "gender": "masculino"
  }
}
```

#### Registrar novo usuário

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "novo@example.com",
  "password": "Senha@123",
  "firstName": "João",
  "lastName": "Silva",
  "gender": "masculino",
  "phone": "11999999999"
}
```

#### Validar Sessão

```
POST /api/auth/validate-session
Authorization: Bearer {sessionToken}
```

#### Auto-login

```
POST /api/auth/auto-login
Content-Type: application/json

{
  "sessionToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Renovar Token

```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout

```
POST /api/auth/logout
Authorization: Bearer {sessionToken}
Content-Type: application/json

{
  "sessionToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout de todas as sessões

```
POST /api/auth/logout-all
Authorization: Bearer {sessionToken}
```

### Conteúdo

#### Obter Coleções

```
GET /api/collections
```

#### Obter Produtos

```
GET /api/products
```

## 🔐 Autenticação

Os endpoints protegidos requerem o header `Authorization`:

```
Authorization: Bearer {sessionToken}
```

## 🛠️ Estrutura de Arquivos

```
Urban Wear/
├── server.js              # Servidor Express (este arquivo)
├── package.json           # Dependências do projeto
├── .env                   # Variáveis de ambiente
├── database.sql           # Schema do banco de dados
├── DATABASE.md            # Documentação do banco
├── urbanWear.html         # Frontend HTML
├── urbanWear.js           # Frontend JavaScript
├── urbanWear.js           # Frontend JavaScript com auth
├── auth.js                # Cliente de autenticação (browser)
└── style.css              # Estilos CSS
```

## 🐛 Solução de Problemas

### Erro: "Conexão recusada"

**Solução:** Verifique se MySQL está rodando. No Windows, abra Services e procure por "MySQL80" ou similar.

### Erro: "Banco de dados não encontrado"

**Solução:** Execute o arquivo `database.sql` no MySQL para criar as tabelas.

### Erro: "EADDRINUSE"

**Solução:** A porta 3000 já está em uso. Mude a porta no arquivo `.env` ou finalize o processo usando a porta.

### Validação de senha falha no registro

**Requisitos minimos da senha:**

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 símbolo especial (@$!%\*?&)

**Exemplo válido:** `Senha@123`

## 📚 Dependências do Projeto

- **express** - Framework web
- **mysql2** - Driver MySQL
- **cors** - Permitir requisições cross-origin
- **dotenv** - Variáveis de ambiente
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação com JWT
- **body-parser** - Parsing de JSON

## 🔄 Fluxo de Autenticação

1. **Login**: Usuário envia email/senha
2. **Validação**: Servidor valida credenciais no banco
3. **Tokens**: Gera `sessionToken` (8h) e `refreshToken` (30d)
4. **Sessão Ativa**: Cria registro de sessão no banco
5. **Auto-login**: Na próxima visita, usa `sessionToken` para restaurar sessão
6. **Renovação**: Se `sessionToken` expirar, usa `refreshToken` para gerar novo
7. **Logout**: Marca sessão como inativa no banco

## 📞 Suporte

Para dúvidas ou erros, verifique:

- Arquivo `DATABASE.md` para detalhes do banco
- Console do servidor para mensagens de erro
- Console do navegador (F12) para erros do frontend

---

**Desenvolvido com ❤️ para Urban Wear Store**
