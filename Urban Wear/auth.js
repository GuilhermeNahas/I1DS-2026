/**
 * =====================================================
 * AUTENTICAÇÃO E GERENCIAMENTO DE SESSÕES
 * Sistema de Login com Auto-Login para Urban Wear Store
 * =====================================================
 */

// Configuração de timeout e tokens
const AUTH_CONFIG = {
  SESSION_STORAGE_KEY: "urbanWearSessionToken",
  REFRESH_TOKEN_KEY: "urbanWearRefreshToken",
  USER_DATA_KEY: "urbanWearUserData",
  CHECK_SESSION_INTERVAL: 5 * 60 * 1000, // 5 minutos
  AUTO_LOGIN_ENABLED: true,
};

// =====================================================
// GERENCIADOR DE SESSÕES
// =====================================================
class SessionManager {
  constructor() {
    this.sessionToken = this.getStoredSessionToken();
    this.userData = this.getStoredUserData();
    this.checkSessionInterval = null;
  }

  /**
   * Obter token de sessão armazenado
   */
  getStoredSessionToken() {
    return (
      localStorage.getItem(AUTH_CONFIG.SESSION_STORAGE_KEY) ||
      sessionStorage.getItem(AUTH_CONFIG.SESSION_STORAGE_KEY)
    );
  }

  /**
   * Obter dados do usuário armazenados
   */
  getStoredUserData() {
    const data = localStorage.getItem(AUTH_CONFIG.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Armazenar sessão
   */
  storeSession(sessionToken, userData, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(AUTH_CONFIG.SESSION_STORAGE_KEY, sessionToken);
    storage.setItem(AUTH_CONFIG.USER_DATA_KEY, JSON.stringify(userData));

    this.sessionToken = sessionToken;
    this.userData = userData;
  }

  /**
   * Limpar sessão
   */
  clearSession() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_STORAGE_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_DATA_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.USER_DATA_KEY);

    this.sessionToken = null;
    this.userData = null;
  }

  /**
   * Verificar se há sessão ativa
   */
  hasActiveSession() {
    return !!this.sessionToken && !!this.userData;
  }

  /**
   * Iniciar verificação periódica da sessão
   */
  startSessionCheck() {
    if (this.checkSessionInterval) return;

    this.checkSessionInterval = setInterval(() => {
      if (this.hasActiveSession()) {
        this.validateSession();
      }
    }, AUTH_CONFIG.CHECK_SESSION_INTERVAL);
  }

  /**
   * Parar verificação periódica
   */
  stopSessionCheck() {
    if (this.checkSessionInterval) {
      clearInterval(this.checkSessionInterval);
      this.checkSessionInterval = null;
    }
  }
}

// Instância global do gerenciador de sessões
const sessionManager = new SessionManager();

// =====================================================
// SERVIÇO DE AUTENTICAÇÃO
// =====================================================
class AuthService {
  constructor() {
    this.apiBaseUrl = "/api/auth"; // URL da API backend
  }

  /**
   * Registrar novo usuário
   */
  async register(email, password, userData = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          gender: userData.gender || "não-especificado",
          phone: userData.phone || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar");
      }

      // Armazenar sessão
      sessionManager.storeSession(data.sessionToken, data.user, true);

      // Iniciar verificação de sessão
      sessionManager.startSessionCheck();

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Login com email e senha
   */
  async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Armazenar sessão
      sessionManager.storeSession(data.sessionToken, data.user, rememberMe);

      // Iniciar verificação de sessão
      sessionManager.startSessionCheck();

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Auto-login com token armazenado
   */
  async autoLogin() {
    if (!sessionManager.hasActiveSession()) {
      return { success: false };
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/auto-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionManager.sessionToken}`,
        },
        body: JSON.stringify({
          sessionToken: sessionManager.sessionToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Sessão inválida ou expirada
        sessionManager.clearSession();
        return { success: false };
      }

      // Atualizar dados do usuário
      sessionManager.storeSession(sessionManager.sessionToken, data.user, true);

      sessionManager.startSessionCheck();

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Erro ao fazer auto-login:", error);
      return { success: false };
    }
  }

  /**
   * Validar sessão com o servidor
   */
  async validateSession() {
    if (!sessionManager.hasActiveSession()) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/validate-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionManager.sessionToken}`,
        },
      });

      if (!response.ok) {
        sessionManager.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao validar sessão:", error);
      return false;
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      if (sessionManager.hasActiveSession()) {
        await fetch(`${this.apiBaseUrl}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionManager.sessionToken}`,
          },
          body: JSON.stringify({
            sessionToken: sessionManager.sessionToken,
          }),
        });
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      sessionManager.stopSessionCheck();
      sessionManager.clearSession();
    }
  }

  /**
   * Logout de todas as sessões
   */
  async logoutAll() {
    try {
      if (sessionManager.hasActiveSession()) {
        await fetch(`${this.apiBaseUrl}/logout-all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionManager.sessionToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao fazer logout de todas as sessões:", error);
    } finally {
      sessionManager.stopSessionCheck();
      sessionManager.clearSession();
    }
  }

  /**
   * Login com Google
   */
  async loginWithGoogle(googleToken) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/login/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login com Google");
      }

      sessionManager.storeSession(data.sessionToken, data.user, true);
      sessionManager.startSessionCheck();

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Login com Apple
   */
  async loginWithApple(appleToken) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/login/apple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appleToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login com Apple");
      }

      sessionManager.storeSession(data.sessionToken, data.user, true);
      sessionManager.startSessionCheck();

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Renovar token (refresh token)
   */
  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Token inválido");
      }

      sessionManager.storeSession(data.sessionToken, data.user, true);

      return {
        success: true,
        sessionToken: data.sessionToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Instância global do serviço de autenticação
const authService = new AuthService();

// =====================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// =====================================================

/**
 * Adicionar token à requisição
 */
function getAuthHeader() {
  if (sessionManager.hasActiveSession()) {
    return {
      Authorization: `Bearer ${sessionManager.sessionToken}`,
    };
  }
  return {};
}

/**
 * Fazer requisição autenticada
 */
async function authenticatedFetch(url, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Se receber 401, tentar renovar token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    if (refreshToken) {
      const result = await authService.refreshToken(refreshToken);
      if (result.success) {
        // Tentar novamente com novo token
        return authenticatedFetch(url, options);
      } else {
        // Token inválido, fazer logout
        await authService.logout();
        window.location.href = "/login";
      }
    }
  }

  return response;
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

/**
 * Inicializar autenticação ao carregar a página
 */
async function initializeAuth() {
  // Tentar auto-login se não estiver autenticado
  if (!sessionManager.hasActiveSession() && AUTH_CONFIG.AUTO_LOGIN_ENABLED) {
    console.log("Tentando auto-login...");
    await authService.autoLogin();
  } else if (sessionManager.hasActiveSession()) {
    console.log("Sessão ativa encontrada");
    sessionManager.startSessionCheck();
  }

  // Disparar evento de autenticação
  window.dispatchEvent(
    new CustomEvent("authInitialized", {
      detail: { user: sessionManager.userData },
    }),
  );
}

/**
 * Listener para quando a página recebe foco
 */
window.addEventListener("focus", async () => {
  if (sessionManager.hasActiveSession()) {
    const isValid = await authService.validateSession();
    if (!isValid) {
      console.log("Sessão expirada");
      await authService.logout();
      window.location.href = "/login";
    }
  }
});

/**
 * Listener para descarregar página
 */
window.addEventListener("beforeunload", () => {
  sessionManager.stopSessionCheck();
});

// Inicializar autenticação quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAuth);
} else {
  initializeAuth();
}

// =====================================================
// EXPORTAR PARA USO GLOBAL
// =====================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SessionManager,
    AuthService,
    sessionManager,
    authService,
    getAuthHeader,
    authenticatedFetch,
    initializeAuth,
  };
}
