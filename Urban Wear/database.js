/**
 * =====================================================
 * CONFIGURAÇÃO DO BANCO DE DADOS - SQLite
 * =====================================================
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho do banco de dados
const dbPath = path.join(__dirname, "urban_wear.db");

// Criar conexão
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao abrir banco de dados:", err.message);
  } else {
    console.log("✓ Conexão com SQLite estabelecida");
    initializeDatabase();
  }
});

// Habilitar foreign keys
db.run("PRAGMA foreign_keys = ON");

/**
 * Inicializar o banco de dados com schema
 */
function initializeDatabase() {
  db.serialize(() => {
    // Tabela de usuários
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT DEFAULT '',
        last_name TEXT DEFAULT '',
        gender TEXT DEFAULT 'não-especificado',
        phone TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        last_login DATETIME
      )
    `);

    // Tabela de sessões ativas
    db.run(`
      CREATE TABLE IF NOT EXISTS active_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        refresh_token TEXT UNIQUE NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabela de histórico de login
    db.run(`
      CREATE TABLE IF NOT EXISTS login_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT NOT NULL,
        login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        logout_time DATETIME,
        ip_address TEXT,
        user_agent TEXT,
        login_method TEXT DEFAULT 'email',
        success INTEGER DEFAULT 1,
        failure_reason TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Tabela de configurações de segurança
    db.run(
      `
      CREATE TABLE IF NOT EXISTS security_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_name TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        description TEXT
      )
    `,
      () => {
        // Inserir configurações padrão se não existirem
        insertDefaultSettings();
      },
    );

    // Criar índices para melhor performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)`,
    );
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_sessions_token ON active_sessions(session_token)`,
    );
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_sessions_user ON active_sessions(user_id)`,
    );
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_sessions_expires ON active_sessions(expires_at)`,
    );
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_login_history_user ON login_history(user_id)`,
    );
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_login_history_time ON login_history(login_time DESC)`,
    );
  });
}

/**
 * Inserir configurações de segurança padrão
 */
function insertDefaultSettings() {
  const defaults = [
    [
      "session_timeout_minutes",
      "480",
      "Tempo de sessão em minutos (padrão: 8 horas)",
    ],
    ["token_expiry_hours", "24", "Expiração do token em horas"],
    ["refresh_token_days", "30", "Expiração do refresh token em dias"],
    ["max_sessions_per_user", "5", "Máximo de sessões simultâneas por usuário"],
    ["auto_login_enabled", "true", "Permitir auto-login com sessão armazenada"],
    ["password_min_length", "8", "Comprimento mínimo de senha"],
    ["require_special_chars", "true", "Exigir caracteres especiais na senha"],
  ];

  defaults.forEach((setting) => {
    db.run(
      `INSERT OR IGNORE INTO security_settings (setting_name, setting_value, description) 
       VALUES (?, ?, ?)`,
      setting,
    );
  });

  // Inserir usuário de teste
  db.run(
    `INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, is_active) 
     VALUES (?, ?, ?, ?, 1)`,
    [
      "usuario@urbanwear.com",
      "$2a$10$YX1K.kpVAFPhAy9lHu1/X.UkE67.H5Wk.B6w3bXzU9sVvvlVTDk6e", // Test@123
      "Urban",
      "Wear",
    ],
  );
}

/**
 * Promisify db.run para usar com async/await
 */
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

/**
 * Promisify db.get para usar com async/await
 */
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Promisify db.all para usar com async/await
 */
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

/**
 * Fechar banco de dados
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  closeDatabase,
};
