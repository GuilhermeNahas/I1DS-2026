/**
 * =====================================================
 * SERVIDOR BACKEND - URBAN WEAR STORE
 * Express.js + SQLite + Autenticação
 * =====================================================
 *
 * Instalação de dependências:
 * npm install
 *
 * Execução:
 * npm start
 *
 * Acesso:
 * http://localhost:3000
 */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { dbRun, dbGet, dbAll, closeDatabase } = require("./database");

// =====================================================
// CONFIGURAÇÃO DO SERVIDOR
// =====================================================

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET =
  process.env.JWT_SECRET || "sua-chave-secreta-super-segura-2026";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));

// =====================================================
// VALIDAÇÃO E AUTENTICAÇÃO
// =====================================================

/**
 * Middleware para validar token JWT
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado" });
    }
    req.user = user;
    next();
  });
};

/**
 * Validar força da senha
 */
function validatePassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

/**
 * Validar email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// =====================================================
// ROTAS DE AUTENTICAÇÃO
// =====================================================

/**
 * POST /api/auth/register - Cadastro de novo usuário
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, gender, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos especiais",
      });
    }

    // Verificar se email já existe
    const existingUser = await dbGet("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir novo usuário
    const result = await dbRun(
      "INSERT INTO users (email, password_hash, first_name, last_name, gender, phone, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [
        email,
        hashedPassword,
        firstName || "",
        lastName || "",
        gender || "não-especificado",
        phone || "",
      ],
    );

    const userId = result.lastID;

    // Gerar tokens
    const sessionToken = jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: "8h",
    });
    const refreshToken = jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: "30d",
    });

    // Armazenar sessão
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    await dbRun(
      "INSERT INTO active_sessions (user_id, session_token, refresh_token, ip_address, user_agent, expires_at, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [
        userId,
        sessionToken,
        refreshToken,
        req.ip,
        req.get("user-agent"),
        expiresAt.toISOString(),
      ],
    );

    // Log de login
    await dbRun(
      'INSERT INTO login_history (user_id, email, login_time, ip_address, user_agent, login_method, success) VALUES (?, ?, datetime("now"), ?, ?, ?, 1)',
      [userId, email, req.ip, req.get("user-agent"), "email"],
    );

    res.json({
      sessionToken,
      refreshToken,
      user: {
        id: userId,
        email,
        first_name: firstName || "",
        last_name: lastName || "",
        gender: gender || "não-especificado",
      },
    });
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

/**
 * POST /api/auth/login - Login com email e senha
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Buscar usuário
    const user = await dbGet(
      "SELECT id, email, password_hash, first_name, last_name, gender, is_active FROM users WHERE email = ? AND is_active = 1",
      [email],
    );

    if (!user) {
      // Log de falha
      await dbRun(
        'INSERT INTO login_history (email, login_time, ip_address, user_agent, login_method, success, failure_reason) VALUES (?, datetime("now"), ?, ?, ?, 0, ?)',
        [
          email,
          req.ip,
          req.get("user-agent"),
          "email",
          "Usuário não encontrado",
        ],
      );

      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      // Log de falha
      await dbRun(
        'INSERT INTO login_history (user_id, email, login_time, ip_address, user_agent, login_method, success, failure_reason) VALUES (?, ?, datetime("now"), ?, ?, ?, 0, ?)',
        [
          user.id,
          email,
          req.ip,
          req.get("user-agent"),
          "email",
          "Senha incorreta",
        ],
      );

      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // Gerar tokens
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" },
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    // Criar sessão
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    await dbRun(
      "INSERT INTO active_sessions (user_id, session_token, refresh_token, ip_address, user_agent, expires_at, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [
        user.id,
        sessionToken,
        refreshToken,
        req.ip,
        req.get("user-agent"),
        expiresAt.toISOString(),
      ],
    );

    // Atualizar último login
    await dbRun('UPDATE users SET last_login = datetime("now") WHERE id = ?', [
      user.id,
    ]);

    // Log de sucesso
    await dbRun(
      'INSERT INTO login_history (user_id, email, login_time, ip_address, user_agent, login_method, success) VALUES (?, ?, datetime("now"), ?, ?, ?, 1)',
      [user.id, email, req.ip, req.get("user-agent"), "email"],
    );

    res.json({
      sessionToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

/**
 * POST /api/auth/validate-session - Validar sessão ativa
 */
app.post("/api/auth/validate-session", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Verificar sessão no banco
    const session = await dbGet(
      'SELECT * FROM active_sessions WHERE session_token = ? AND is_active = 1 AND expires_at > datetime("now")',
      [token],
    );

    if (!session) {
      return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }

    // Atualizar última atividade
    await dbRun(
      'UPDATE active_sessions SET last_activity = datetime("now") WHERE session_token = ?',
      [token],
    );

    res.json({ valid: true });
  } catch (error) {
    console.error("Erro ao validar sessão:", error);
    res.status(500).json({ error: "Erro ao validar sessão" });
  }
});

/**
 * POST /api/auth/auto-login - Auto-login com sessão ativa
 */
app.post("/api/auth/auto-login", async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Verificar sessão
    const session = await dbGet(
      'SELECT u.id, u.email, u.first_name, u.last_name, u.gender FROM active_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ? AND s.is_active = 1 AND s.expires_at > datetime("now")',
      [sessionToken],
    );

    if (!session) {
      return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }

    // Atualizar última atividade
    await dbRun(
      'UPDATE active_sessions SET last_activity = datetime("now") WHERE session_token = ?',
      [sessionToken],
    );

    res.json({
      user: {
        id: session.id,
        email: session.email,
        first_name: session.first_name,
        last_name: session.last_name,
        gender: session.gender,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer auto-login:", error);
    res.status(500).json({ error: "Erro ao fazer auto-login" });
  }
});

/**
 * POST /api/auth/refresh-token - Renovar token
 */
app.post("/api/auth/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token não fornecido" });
    }

    jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Refresh token inválido" });
      }

      // Gerar novo session token
      const newSessionToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        JWT_SECRET,
        { expiresIn: "8h" },
      );

      // Atualizar token na sessão
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8);

      await dbRun(
        'UPDATE active_sessions SET session_token = ?, expires_at = ?, last_activity = datetime("now") WHERE refresh_token = ?',
        [newSessionToken, expiresAt.toISOString(), refreshToken],
      );

      // Obter dados do usuário
      const user = await dbGet(
        "SELECT id, email, first_name, last_name, gender FROM users WHERE id = ?",
        [decoded.userId],
      );

      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      res.json({
        sessionToken: newSessionToken,
        user,
      });
    });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    res.status(500).json({ error: "Erro ao renovar token" });
  }
});

/**
 * POST /api/auth/logout - Fazer logout
 */
app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    const { sessionToken } = req.body;

    // Desativar sessão
    await dbRun(
      "UPDATE active_sessions SET is_active = 0 WHERE session_token = ?",
      [sessionToken],
    );

    // Log do logout
    const session = await dbGet(
      "SELECT user_id FROM active_sessions WHERE session_token = ?",
      [sessionToken],
    );

    if (session) {
      await dbRun(
        'UPDATE login_history SET logout_time = datetime("now") WHERE user_id = ? ORDER BY login_time DESC LIMIT 1',
        [session.user_id],
      );
    }

    res.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).json({ error: "Erro ao fazer logout" });
  }
});

/**
 * POST /api/auth/logout-all - Fazer logout de todas as sessões
 */
app.post("/api/auth/logout-all", authenticateToken, async (req, res) => {
  try {
    // Desativar todas as sessões do usuário
    await dbRun("UPDATE active_sessions SET is_active = 0 WHERE user_id = ?", [
      req.user.userId,
    ]);

    res.json({ message: "Logout de todas as sessões realizado com sucesso" });
  } catch (error) {
    console.error("Erro ao fazer logout de todas as sessões:", error);
    res.status(500).json({ error: "Erro ao fazer logout de todas as sessões" });
  }
});

// =====================================================
// ROTAS DE CONTEÚDO
// =====================================================

/**
 * GET / - Servir a página principal
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "urbanWear.html"));
});

/**
 * GET /api/collections - Obter coleções
 */
app.get("/api/collections", async (req, res) => {
  try {
    res.json([
      {
        id: 1,
        name: "Feminina",
        image:
          "https://images.unsplash.com/photo-1545291730-faff8c3340ba?w=400",
      },
      {
        id: 2,
        name: "Masculina",
        image:
          "https://images.unsplash.com/photo-1516762899156-0ac8d9b7b0d4?w=400",
      },
    ]);
  } catch (error) {
    console.error("Erro ao obter coleções:", error);
    res.status(500).json({ error: "Erro ao obter coleções" });
  }
});

/**
 * GET /api/products - Obter produtos
 */
app.get("/api/products", async (req, res) => {
  try {
    res.json([
      {
        id: 1,
        name: "Tênis Urban",
        price: 299.9,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        collection: "Feminina",
      },
      {
        id: 2,
        name: "Camisetas Básicas",
        price: 79.9,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        collection: "Feminina",
      },
      {
        id: 3,
        name: "Moletons Confortáveis",
        price: 159.9,
        image:
          "https://images.unsplash.com/photo-1556821552-5a63fe14ae0b?w=400",
        collection: "Feminina",
      },
      {
        id: 4,
        name: "Shorts Urban",
        price: 129.9,
        image:
          "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
        collection: "Feminina",
      },
    ]);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ error: "Erro ao obter produtos" });
  }
});

// =====================================================
// TRATAMENTO DE ERROS
// =====================================================

/**
 * Middleware para rotas não encontradas
 */
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

/**
 * Middleware para erros globais
 */
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║   🚀 URBAN WEAR STORE - Servidor Iniciado             ║`);
    console.log(`╠════════════════════════════════════════════════════════╣`);
    console.log(
      `║   🌐 Acesse: http://localhost:${PORT}                      ║`,
    );
    console.log(`║   💾 Banco: SQLite (urban_wear.db)                    ║`);
    console.log(`║   📝 API:    http://localhost:${PORT}/api/auth          ║`);
    console.log(`║   ⏹️  Stop:   Pressione Ctrl+C                         ║`);
    console.log(`╚════════════════════════════════════════════════════════╝\n`);
  });
};

// Iniciar servidor
startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n🛑 Encerrando servidor...");
  await closeDatabase();
  process.exit(0);
});

module.exports = app;
