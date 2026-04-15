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
      targetSection.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Função para validação básica do formulário de login
function validateLoginForm() {
  const form = document.querySelector(".login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
    } else {
      // Simular login bem-sucedido
      showContent();
    }
  });
}

// Função para validação do formulário de cadastro
function validateSignupForm() {
  const form = document.querySelector(".signup-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
    } else {
      // Simular cadastro bem-sucedido
      showContent();
    }
  });
}

// Função para mostrar o conteúdo após login/cadastro
function showContent() {
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".collections").style.display = "block";
  // Inicialmente ocultar catalog e signup
  document.querySelector(".catalog").style.display = "none";
  document.querySelector(".signup").style.display = "none";
  // Atualizar navegação
  document.querySelector(".main-nav").innerHTML = `
    <a href="#home">Início</a>
    <a href="#catalogo">Catálogo</a>
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
  document.querySelector(".signup").style.display = "block";
}

// Função para logout
function logout(e) {
  e.preventDefault();
  document.querySelector(".hero").style.display = "block";
  document.querySelector(".collections").style.display = "none";
  document.querySelector(".catalog").style.display = "none";
  document.querySelector(".signup").style.display = "none";
  // Resetar navegação
  document.querySelector(".main-nav").innerHTML = `
    <a href="#home">Início</a>
    <a href="#catalogo">Catálogo</a>
    <a href="#signup">Cadastro</a>
  `;
  // Limpar formulários
  document.querySelector(".login-form").reset();
  document.querySelector(".signup-form").reset();
}

// Inicializar todas as funções quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll();
  addHoverEffects();
  smoothScroll();
  validateLoginForm();
  validateSignupForm();
});
