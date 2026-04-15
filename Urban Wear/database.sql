-- =====================================================
-- BANCO DE DADOS: URBAN WEAR STORE
-- Autor: Sistema de Autenticação e Gerenciamento de Sessões
-- Data: 2026-04-15
-- =====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS urban_wear_db;
USE urban_wear_db;

-- =====================================================
-- TABELA: USUÁRIOS (users)
-- Armazena informações de login e perfil dos usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  gender ENUM('masculina', 'feminina', 'outro'),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
);

-- =====================================================
-- TABELA: SESSÕES ATIVAS (active_sessions)
-- Armazena sessões de usuários logados com tokens
-- =====================================================
CREATE TABLE IF NOT EXISTS active_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session_token (session_token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  INDEX idx_is_active (is_active)
);

-- =====================================================
-- TABELA: HISTÓRICO DE LOGIN (login_history)
-- Registra todos os acessos para auditoria
-- =====================================================
CREATE TABLE IF NOT EXISTS login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time DATETIME,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  login_method ENUM('email_password', 'google', 'apple') DEFAULT 'email_password',
  success BOOLEAN DEFAULT TRUE,
  failure_reason VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_login_time (login_time)
);

-- =====================================================
-- TABELA: CONFIGURAÇÕES DE SEGURANÇA (security_settings)
-- Armazena configurações de tempo de expiração e sessão
-- =====================================================
CREATE TABLE IF NOT EXISTS security_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_name VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(255) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_name (setting_name)
);

-- =====================================================
-- INSERIR CONFIGURAÇÕES PADRÃO DE SEGURANÇA
-- =====================================================
INSERT INTO security_settings (setting_name, setting_value, description) VALUES
('session_timeout_minutes', '480', 'Tempo de expiração de sessão em minutos (8 horas)'),
('token_expiration_hours', '24', 'Tempo de expiração do token de autenticação em horas'),
('refresh_token_expiration_days', '30', 'Tempo de expiração do refresh token em dias'),
('max_sessions_per_user', '5', 'Número máximo de sessões ativas por usuário'),
('auto_login_enabled', 'true', 'Ativar auto-login quando sessão válida existir'),
('password_min_length', '8', 'Comprimento mínimo de senha'),
('password_require_uppercase', 'true', 'Exigir letras maiúsculas na senha'),
('password_require_numbers', 'true', 'Exigir números na senha'),
('password_require_special', 'false', 'Exigir caracteres especiais na senha')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- =====================================================
-- PROCEDURES: CRIAR SESSÃO
-- =====================================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS create_session(
  IN p_user_id INT,
  IN p_session_token VARCHAR(255),
  IN p_refresh_token VARCHAR(255),
  IN p_ip_address VARCHAR(45),
  IN p_user_agent VARCHAR(500)
)
BEGIN
  DECLARE v_session_timeout INT;
  
  -- Obter timeout da sessão em minutos
  SELECT CAST(setting_value AS UNSIGNED) INTO v_session_timeout
  FROM security_settings
  WHERE setting_name = 'session_timeout_minutes';
  
  -- Inserir nova sessão
  INSERT INTO active_sessions (
    user_id,
    session_token,
    refresh_token,
    ip_address,
    user_agent,
    expires_at,
    is_active
  ) VALUES (
    p_user_id,
    p_session_token,
    p_refresh_token,
    p_ip_address,
    p_user_agent,
    DATE_ADD(NOW(), INTERVAL v_session_timeout MINUTE),
    TRUE
  );
  
  -- Atualizar último login do usuário
  UPDATE users SET last_login = NOW() WHERE id = p_user_id;
END //

-- =====================================================
-- PROCEDURES: VALIDAR SESSÃO
-- =====================================================
CREATE PROCEDURE IF NOT EXISTS validate_session(
  IN p_session_token VARCHAR(255)
)
BEGIN
  SELECT 
    s.id,
    s.user_id,
    s.session_token,
    s.expires_at,
    s.is_active,
    u.email,
    u.first_name,
    u.last_name
  FROM active_sessions s
  INNER JOIN users u ON s.user_id = u.id
  WHERE s.session_token = p_session_token
    AND s.is_active = TRUE
    AND s.expires_at > NOW()
    AND u.is_active = TRUE;
END //

-- =====================================================
-- PROCEDURES: AUTO-LOGIN
-- =====================================================
CREATE PROCEDURE IF NOT EXISTS auto_login(
  IN p_session_token VARCHAR(255)
)
BEGIN
  DECLARE v_auto_login_enabled VARCHAR(10);
  
  -- Verificar se auto-login está habilitado
  SELECT setting_value INTO v_auto_login_enabled
  FROM security_settings
  WHERE setting_name = 'auto_login_enabled';
  
  IF v_auto_login_enabled = 'true' THEN
    SELECT 
      s.id as session_id,
      s.user_id,
      s.session_token,
      s.expires_at,
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      u.gender
    FROM active_sessions s
    INNER JOIN users u ON s.user_id = u.id
    WHERE s.session_token = p_session_token
      AND s.is_active = TRUE
      AND s.expires_at > NOW()
      AND u.is_active = TRUE
    LIMIT 1;
  END IF;
END //

-- =====================================================
-- PROCEDURES: EXPIRAR SESSÃO
-- =====================================================
CREATE PROCEDURE IF NOT EXISTS expire_session(
  IN p_session_token VARCHAR(255)
)
BEGIN
  UPDATE active_sessions
  SET is_active = FALSE
  WHERE session_token = p_session_token;
END //

-- =====================================================
-- PROCEDURES: ENCERRAR TODAS AS SESSÕES DO USUÁRIO
-- =====================================================
CREATE PROCEDURE IF NOT EXISTS logout_all_user_sessions(
  IN p_user_id INT
)
BEGIN
  UPDATE active_sessions
  SET is_active = FALSE
  WHERE user_id = p_user_id;
END //

-- =====================================================
-- PROCEDURES: LIMPAR SESSÕES EXPIRADAS
-- =====================================================
CREATE PROCEDURE IF NOT EXISTS cleanup_expired_sessions()
BEGIN
  DELETE FROM active_sessions
  WHERE expires_at < NOW() OR is_active = FALSE;
END //

-- =====================================================
-- PROCEDURES: REGISTRAR LOGIN
-- =====================================================
CREATE PROCEDURE IF NOT EXISTS log_login(
  IN p_user_id INT,
  IN p_email VARCHAR(255),
  IN p_ip_address VARCHAR(45),
  IN p_user_agent VARCHAR(500),
  IN p_login_method VARCHAR(50),
  IN p_success BOOLEAN,
  IN p_failure_reason VARCHAR(255)
)
BEGIN
  INSERT INTO login_history (
    user_id,
    email,
    ip_address,
    user_agent,
    login_method,
    success,
    failure_reason
  ) VALUES (
    p_user_id,
    p_email,
    p_ip_address,
    p_user_agent,
    p_login_method,
    p_success,
    p_failure_reason
  );
END //

DELIMITER ;

-- =====================================================
-- ÍNDICES DE PERFORMANCE
-- =====================================================
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_sessions_user_active ON active_sessions(user_id, is_active);
CREATE INDEX idx_login_history_recent ON login_history(user_id, login_time DESC);

-- =====================================================
-- EXEMPLO DE USUÁRIO PARA TESTES
-- =====================================================
-- Senha: Test@123 (hash SHA256)
INSERT INTO users (email, password_hash, first_name, last_name, gender, phone)
VALUES (
  'usuario@urbanwear.com',
  SHA2('Test@123', 256),
  'João',
  'Silva',
  'masculina',
  '11999999999'
);

-- =====================================================
-- CONSULTAS ÚTEIS PARA DESENVOLVIMENTO
-- =====================================================

-- 1. Verificar todas as sessões ativas
-- SELECT u.email, s.session_token, s.expires_at, s.is_active 
-- FROM active_sessions s
-- JOIN users u ON s.user_id = u.id
-- WHERE s.is_active = TRUE AND s.expires_at > NOW();

-- 2. Contar sessões ativas por usuário
-- SELECT u.email, COUNT(s.id) as sessions_count
-- FROM users u
-- LEFT JOIN active_sessions s ON u.id = s.user_id AND s.is_active = TRUE
-- GROUP BY u.id;

-- 3. Histórico de login do usuário
-- SELECT email, login_time, ip_address, login_method, success
-- FROM login_history
-- WHERE user_id = 1
-- ORDER BY login_time DESC
-- LIMIT 20;

-- 4. Sessões expiradas
-- SELECT u.email, s.expires_at
-- FROM active_sessions s
-- JOIN users u ON s.user_id = u.id
-- WHERE s.expires_at < NOW();
