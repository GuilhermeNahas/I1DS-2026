// Inicio protótipo em java script do site urban wear store

// Função para animação de fade-in ao scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".collection-card, .product-card, .signup-card",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 },
  );

  elements.forEach((el) => observer.observe(el));
}

// Função para efeitos de hover nos cards
function addHoverEffects() {
  const cards = document.querySelectorAll(".collection-card, .product-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.05)";
      card.style.transition = "transform 0.3s ease";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "scale(1)";
    });
  });
}

// Função para scroll suave nos links de navegação
function smoothScroll() {
  const navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      // Verificar se o elemento existe antes de scroll
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn(`Elemento ${targetId} não encontrado`);
      }
    });
  });
}

// Função para validação e login com integração ao backend
function validateLoginForm() {
  const form = document.querySelector(".login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Desabilitar botão durante o login
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Autenticando...";

    // Tentar login
    const result = await authService.login(email, password, true);

    submitButton.disabled = false;
    submitButton.textContent = "Entrar";

    if (result.success) {
      showContent(result.user);
    } else {
      alert(`Erro ao fazer login: ${result.error}`);
    }
  });
}

// Função para mostrar o conteúdo após login bem-sucedido
function showContent(user = null) {
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".collections").style.display = "block";
  // Inicialmente ocultar catalog
  document.querySelector(".catalog").style.display = "none";

  // Atualizar navegação com nome do usuário se disponível
  const userName = user ? user.first_name || user.email : "Usuário";
  document.querySelector(".main-nav").innerHTML = `
    <a href="#home">Início</a>
    <a href="#catalogo">Catálogo</a>
    <span class="user-name">Olá, ${userName}</span>
    <a href="#logout">Sair</a>
  `;

  // Adicionar listener para logout
  document.querySelector('a[href="#logout"]').addEventListener("click", logout);
  // Adicionar listeners para os collection cards
  addCollectionCardListeners();
}

// Função para adicionar listeners aos collection cards
function addCollectionCardListeners() {
  const collectionCards = document.querySelectorAll(".collection-card");
  collectionCards.forEach((card) => {
    card.addEventListener("click", () => {
      showProducts();
    });
  });
}

// Função para mostrar os produtos
function showProducts() {
  document.querySelector(".catalog").style.display = "block";
}

// Função para logout com integração ao backend
async function logout(e) {
  e.preventDefault();

  // Fazer logout no servidor
  await authService.logout();

  document.querySelector(".hero").style.display = "block";
  document.querySelector(".collections").style.display = "none";
  document.querySelector(".catalog").style.display = "none";
  // Resetar navegação
  document.querySelector(".main-nav").innerHTML = `
    <a href="#home">Início</a>
    <a href="#catalogo">Catálogo</a>
  `;

  // Re-aplicar smooth scroll aos links
  smoothScroll();

  // Limpar formulários
  document.querySelector(".login-form").reset();
}

// Listener para quando a autenticação é inicializada
window.addEventListener("authInitialized", (event) => {
  const user = event.detail.user;
  if (user) {
    // Se há sessão ativa, mostrar conteúdo
    showContent(user);
  }
});

// =====================================================
// FUNÇÕES DE CADASTRO
// =====================================================

/**
 * Abrir modal de cadastro
 */
function openRegisterModal() {
  const modal = document.getElementById("register-modal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

/**
 * Fechar modal de cadastro
 */
function closeRegisterModal() {
  const modal = document.getElementById("register-modal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * Validar e enviar formulário de cadastro
 */
function validateRegisterForm() {
  const form = document.querySelector(".register-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const firstName = document.getElementById("register-firstname").value;
    const lastName = document.getElementById("register-lastname").value;
    const gender = document.getElementById("register-gender").value;
    const phone = document.getElementById("register-phone").value;

    if (!email || !password || !firstName || !lastName) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Desabilitar botão durante o cadastro
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Criando conta...";

    // Tentar registro
    const result = await authService.login(email, password, true);

    const registerResult = await authService.register(email, password, {
      firstName,
      lastName,
      gender,
      phone,
    });

    submitButton.disabled = false;
    submitButton.textContent = "CRIAR CONTA";

    if (registerResult.success) {
      alert("Conta criada com sucesso! Bem-vindo!");
      closeRegisterModal();
      form.reset();
      showContent(registerResult.user);
    } else {
      alert(`Erro ao criar conta: ${registerResult.error}`);
    }
  });
}

/**
 * Adicionar listeners aos links de login/cadastro
 */
function setupModalListeners() {
  // Link para abrir modal de cadastro
  const registerLink = document.querySelector(".register-link");
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      openRegisterModal();
    });
  }

  // Link para voltar ao login
  const loginLink = document.querySelector(".login-link");
  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      closeRegisterModal();
    });
  }

  // Botão de fechar modal
  const closeButton = document.querySelector(".modal-close");
  if (closeButton) {
    closeButton.addEventListener("click", closeRegisterModal);
  }

  // Fechar modal ao clicar fora dele
  const modal = document.getElementById("register-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeRegisterModal();
      }
    });
  }
}

// Inicializar todas as funções quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll();
  addHoverEffects();
  smoothScroll();
  validateLoginForm();
  validateRegisterForm();
  setupModalListeners();

  // Verificar se já existe sessão ativa
  if (sessionManager.hasActiveSession()) {
    showContent(sessionManager.userData);
  }
});
