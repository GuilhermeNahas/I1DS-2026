# Banco de Dados - Urban Wear Store

## Sistema de Autenticação e Gerenciamento de Sessões

---

## 📋 Visão Geral

Este banco de dados foi projetado para gerenciar:

- **Autenticação de usuários** com armazenamento seguro de senhas
- **Sessões ativas** com tokens e auto-login
- **Histórico de login** para auditoria e segurança
- **Configurações de segurança** centralizadas

---

## 🗂️ Estrutura de Tabelas

### 1. **users** - Usuários do Sistema

Armazena informações dos usuários cadastrados.

```sql
- id: Identificador único
- email: Email único do usuário
- password_hash: Senha criptografada (SHA256)
- first_name: Primeiro nome
- last_name: Sobrenome
- gender: Gênero (masculina/feminina/outro)
- phone: Telefone
- created_at: Data de criação
- updated_at: Data da última atualização
- is_active: Status da conta (ativo/inativo)
- last_login: Data do último login
```

### 2. **active_sessions** - Sessões Ativas

Gerencia sessões abertas e tokens de autenticação.

```sql
- id: Identificador da sessão
- user_id: Referência ao usuário
- session_token: Token único da sessão
- refresh_token: Token para renovar sessão
- ip_address: IP do cliente
- user_agent: Navegador/dispositivo do usuário
- created_at: Quando a sessão foi criada
- expires_at: Quando a sessão expira
- last_activity: Última atividade na sessão
- is_active: Se a sessão está ativa
```

### 3. **login_history** - Histórico de Login

Registra todos os acessos para auditoria.

```sql
- id: Identificador do registro
- user_id: Usuário que fez login
- email: Email usado no login
- login_time: Hora do login
- logout_time: Hora do logout
- ip_address: IP de origem
- user_agent: Informação do navegador
- login_method: Método usado (email/google/apple)
- success: Se o login foi bem-sucedido
- failure_reason: Motivo da falha (se houver)
```

### 4. **security_settings** - Configurações de Segurança

Configurações centralizadas do sistema.

```sql
- session_timeout_minutes: Quanto tempo a sessão dura (padrão: 480 = 8 horas)
- token_expiration_hours: Expiração do token (padrão: 24 horas)
- refresh_token_expiration_days: Duração do refresh token (padrão: 30 dias)
- max_sessions_per_user: Limite de sessões por usuário (padrão: 5)
- auto_login_enabled: Ativar auto-login (padrão: true)
- password_min_length: Comprimento mínimo de senha (padrão: 8)
```

---

## 🔧 Procedures (Funções do Banco)

### 1. **create_session()**

Cria uma nova sessão para um usuário logado.

```sql
CALL create_session(
  1,                                    -- user_id
  'token_aleatorio_12345',             -- session_token
  'refresh_token_aleatorio',           -- refresh_token
  '192.168.1.100',                     -- ip_address
  'Mozilla/5.0 (Windows NT 10.0)'      -- user_agent
);
```

### 2. **validate_session()**

Valida se uma sessão está ativa e não expirou.

```sql
CALL validate_session('token_aleatorio_12345');
-- Retorna dados do usuário se válido, senão vazio
```

### 3. **auto_login()**

Realiza auto-login se sessão válida existir.

```sql
CALL auto_login('token_aleatorio_12345');
-- Retorna dados do usuário se auto-login habilitado e sessão válida
```

### 4. **expire_session()**

Encerra uma sessão específica.

```sql
CALL expire_session('token_aleatorio_12345');
```

### 5. **logout_all_user_sessions()**

Encerra todas as sessões de um usuário.

```sql
CALL logout_all_user_sessions(1);
```

### 6. **cleanup_expired_sessions()**

Remove sessões expiradas (executar periodicamente).

```sql
CALL cleanup_expired_sessions();
-- Recomendado: rodar a cada hora ou diariamente
```

### 7. **log_login()**

Registra um evento de login para auditoria.

```sql
CALL log_login(
  1,                          -- user_id
  'usuario@urbanwear.com',   -- email
  '192.168.1.100',           -- ip_address
  'Mozilla/5.0...',          -- user_agent
  'email_password',          -- login_method
  TRUE,                      -- success
  NULL                       -- failure_reason
);
```

---

## 🔐 Fluxo de Autenticação

```
1. USUÁRIO FAZ LOGIN
   ↓
2. VALIDAR EMAIL E SENHA
   ↓
3. GERAR TOKENS (session_token + refresh_token)
   ↓
4. CHAMAR create_session()
   ↓
5. ARMAZENAR session_token NO NAVEGADOR (localStorage/cookie)
   ↓
6. CHAMAR log_login() COM SUCCESS=TRUE
   ↓
7. USUÁRIO AUTENTICADO ✓

---

PRÓXIMO ACESSO (AUTO-LOGIN):
   ↓
1. VERIFICAR SE EXISTE session_token NO NAVEGADOR
   ↓
2. CHAMAR validate_session() OU auto_login()
   ↓
3. SE VÁLIDA: LOGIN AUTOMÁTICO ✓
   ↓
4. SE EXPIRADA: PEDIR EMAIL/SENHA NOVAMENTE
   ↓
5. CHAMAR cleanup_expired_sessions() PERIODICAMENTE
```

---

## 📊 Consultas Úteis

### Ver todas as sessões ativas:

```sql
SELECT u.email, s.session_token, s.expires_at, s.is_active
FROM active_sessions s
JOIN users u ON s.user_id = u.id
WHERE s.is_active = TRUE AND s.expires_at > NOW();
```

### Contar sessões por usuário:

```sql
SELECT u.email, COUNT(s.id) as sessions_count
FROM users u
LEFT JOIN active_sessions s ON u.id = s.user_id AND s.is_active = TRUE
GROUP BY u.id;
```

### Histórico de login do usuário:

```sql
SELECT email, login_time, ip_address, login_method, success
FROM login_history
WHERE email = 'usuario@urbanwear.com'
ORDER BY login_time DESC
LIMIT 20;
```

### Sessões expiradas:

```sql
SELECT u.email, s.expires_at
FROM active_sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at < NOW();
```

### Tentar falhas de login:

```sql
SELECT email, login_time, failure_reason, COUNT(*) as tentativas
FROM login_history
WHERE success = FALSE
  AND login_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY email
ORDER BY tentativas DESC;
```

---

## 🚀 Uso com Node.js/Express

### Instalação da biblioteca MySQL:

```bash
npm install mysql2/promise
```

### Exemplo de Middleware de Autenticação:

```javascript
const authenticateSession = async (req, res, next) => {
  const sessionToken = req.cookies.sessionToken || req.headers.authorization;

  if (!sessionToken) {
    return res.status(401).json({ error: "Sessão não encontrada" });
  }

  try {
    const connection = await getDBConnection();
    const [result] = await connection.query("CALL validate_session(?)", [
      sessionToken,
    ]);

    if (result[0].length === 0) {
      return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }

    req.user = result[0][0];
    next();
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar sessão" });
  }
};
```

### Exemplo de Login:

```javascript
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await getDBConnection();

    // Buscar usuário
    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      await connection.query("CALL log_login(NULL, ?, ?, ?, ?, FALSE, ?)", [
        email,
        req.ip,
        req.headers["user-agent"],
        "email_password",
        "Usuário não encontrado",
      ]);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = users[0];

    // Validar senha
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (user.password_hash !== hashedPassword) {
      await connection.query("CALL log_login(?, ?, ?, ?, ?, FALSE, ?)", [
        user.id,
        email,
        req.ip,
        req.headers["user-agent"],
        "email_password",
        "Senha incorreta",
      ]);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gerar tokens
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const refreshToken = crypto.randomBytes(32).toString("hex");

    // Criar sessão
    await connection.query("CALL create_session(?, ?, ?, ?, ?)", [
      user.id,
      sessionToken,
      refreshToken,
      req.ip,
      req.headers["user-agent"],
    ]);

    // Registrar login bem-sucedido
    await connection.query("CALL log_login(?, ?, ?, ?, ?, TRUE, NULL)", [
      user.id,
      email,
      req.ip,
      req.headers["user-agent"],
      "email_password",
    ]);

    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 480 * 60 * 1000, // 8 horas
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});
```

---

## ⚙️ Manutenção

### Agendar limpeza de sessões (CRON):

```bash
# Executar a cada hora
0 * * * * mysql -u user -p password urban_wear_db -e "CALL cleanup_expired_sessions();"
```

### Monitorar falhas de login:

```sql
SELECT DATE(login_time) as data, email, COUNT(*) as tentativas
FROM login_history
WHERE success = FALSE
GROUP BY DATE(login_time), email
ORDER BY data DESC;
```

### Analisar uso do sistema:

```sql
SELECT
  u.email,
  u.created_at,
  u.last_login,
  COUNT(lh.id) as total_logins
FROM users u
LEFT JOIN login_history lh ON u.id = lh.user_id
GROUP BY u.id
ORDER BY total_logins DESC;
```

---

## 🔒 Segurança

✅ **Implementado:**

- Senhas criptografadas (SHA256)
- Tokens únicos por sessão
- Expiração automática de sessões
- Rastreamento de IP e navegador
- Histórico completo de logins
- Limite de sessões por usuário
- Auto-limpeza de sessões expiradas

⚠️ **Recomendações:**

- Use HTTPS em produção
- Implemente rate limiting de login
- Configure firewall para detectar força bruta
- Faça backup regular do banco
- Use bcrypt ou argon2 para mais segurança nas senhas
- Implemente 2FA (autenticação de dois fatores)

---

## 📝 Versionamento

**Versão:** 1.0
**Data:** 15 de abril de 2026
**Compatível com:** MySQL 5.7+, MariaDB 10.2+
