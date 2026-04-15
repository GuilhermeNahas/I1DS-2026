# Explicação do JavaScript - Urban Wear Store

Este documento explica passo a passo as funcionalidades implementadas em JavaScript para o site Urban Wear Store.

## 1. Animação de Entrada ao Scroll (animateOnScroll)

**Objetivo:** Criar um efeito de fade-in quando os elementos entram na viewport durante o scroll.

**Como funciona:**

- Utiliza a API `IntersectionObserver` para detectar quando elementos específicos entram na tela.
- Os elementos observados são: `.collection-card`, `.product-card` e `.signup-card`.
- Quando um elemento intersecta a viewport (threshold de 10%), a classe `animate` é adicionada.
- No CSS, a classe `animate` define `opacity: 1` e `transform: translateY(0)`, criando o efeito de fade-in.

**Código:**

```javascript
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
```

## 2. Efeitos de Hover nos Cards (addHoverEffects)

**Objetivo:** Adicionar interatividade visual aos cards de coleção e produto ao passar o mouse.

**Como funciona:**

- Seleciona todos os elementos `.collection-card` e `.product-card`.
- Adiciona event listeners para `mouseenter` e `mouseleave`.
- No hover, aplica `transform: scale(1.05)` para um efeito de zoom sutil.
- No mouseleave, volta ao tamanho original.

**Código:**

```javascript
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
```

## 3. Scroll Suave na Navegação (smoothScroll)

**Objetivo:** Permitir navegação suave entre seções do site ao clicar nos links do menu.

**Como funciona:**

- Seleciona todos os links da navegação principal (`.main-nav a`).
- Previne o comportamento padrão do link.
- Obtém o ID da seção alvo do atributo `href`.
- Usa `scrollIntoView` com `behavior: 'smooth'` para rolagem suave.

**Código:**

```javascript
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
```

## 4. Validação do Formulário de Login (validateLoginForm)

**Objetivo:** Validar que os campos obrigatórios do formulário de login estejam preenchidos e simular login bem-sucedido.

**Como funciona:**

- Seleciona o formulário de login (`.login-form`).
- Adiciona event listener para o evento `submit`.
- Previne o comportamento padrão.
- Verifica se os campos `email` e `password` estão preenchidos.
- Se preenchidos, chama `showContent()` para exibir o conteúdo principal.
- Se não, mostra alerta.

**Código:**

```javascript
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
```

## 5. Validação do Formulário de Cadastro (validateSignupForm)

**Objetivo:** Validar que os campos obrigatórios do formulário de cadastro estejam preenchidos e simular cadastro bem-sucedido.

**Como funciona:**

- Similar ao login, mas para `.signup-form`.
- Verifica campos `new-email` e `new-password`.
- Se válido, chama `showContent()`.

**Código:**

```javascript
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
```

## 6. Mostrar Conteúdo Após Login/Cadastro (showContent)

**Objetivo:** Ocultar a seção hero e exibir apenas a seção de coleções inicialmente.

**Como funciona:**

- Oculta `.hero`.
- Exibe `.collections`.
- Mantém `.catalog` e `.signup` ocultos.
- Atualiza a navegação.
- Adiciona listeners para logout e para os collection cards.

**Código:**

```javascript
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
```

## 7. Adicionar Listeners aos Collection Cards (addCollectionCardListeners)

**Objetivo:** Permitir que clicar nos cards de coleção revele os produtos.

**Como funciona:**

- Seleciona todos os `.collection-card`.
- Adiciona event listener de click que chama `showProducts()`.

**Código:**

```javascript
function addCollectionCardListeners() {
  const collectionCards = document.querySelectorAll(".collection-card");
  collectionCards.forEach((card) => {
    card.addEventListener("click", () => {
      showProducts();
    });
  });
}
```

## 8. Mostrar Produtos (showProducts)

**Objetivo:** Exibir a seção de catálogo e cadastro após clicar em um collection card.

**Como funciona:**

- Exibe `.catalog` e `.signup`.

**Código:**

```javascript
function showProducts() {
  document.querySelector(".catalog").style.display = "block";
  document.querySelector(".signup").style.display = "block";
}
```

- Verifica se os campos `email` e `password` estão preenchidos.
- Se não estiverem, previne o envio e mostra um alerta.

**Código:**

```javascript
function validateLoginForm() {
  const form = document.querySelector(".login-form");
  form.addEventListener("submit", (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      e.preventDefault();
      alert("Por favor, preencha todos os campos.");
    }
  });
}
```

## 5. Validação do Formulário de Cadastro (validateSignupForm)

**Objetivo:** Validar que os campos obrigatórios do formulário de cadastro estejam preenchidos.

**Como funciona:**

- Similar ao formulário de login, mas para `.signup-form`.
- Verifica campos `new-email` e `new-password`.

**Código:**

```javascript
function validateSignupForm() {
  const form = document.querySelector(".signup-form");
  form.addEventListener("submit", (e) => {
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;
    if (!email || !password) {
      e.preventDefault();
      alert("Por favor, preencha todos os campos.");
    }
  });
}
```

## 6. Inicialização (DOMContentLoaded)

**Objetivo:** Garantir que todas as funções sejam executadas apenas após o carregamento completo do DOM.

**Como funciona:**

- Usa `document.addEventListener('DOMContentLoaded', ...)` para executar todas as funções de inicialização.
- Chama todas as funções definidas anteriormente.

**Código:**

```javascript
document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll();
  addHoverEffects();
  smoothScroll();
  validateLoginForm();
  validateSignupForm();
});
```

## Considerações Finais

- Todas as animações são otimizadas para performance usando CSS transitions.
- A validação de formulários é básica; em produção, considere validações mais robustas.
- O código é modular e fácil de manter.
- Compatível com navegadores modernos que suportam IntersectionObserver.
