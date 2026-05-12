let userCount = 0;

const cadastrar = (event) => {
  event.preventDefault();

  let nome = document.getElementById("nome").value;
  let email = document.getElementById("email").value;

  if (!nome || !email) return;

  let lista = document.getElementById("lista");

  let novoItem = document.createElement("li");

  let span = document.createElement("span");
  span.innerText = nome + " - " + email;
  novoItem.appendChild(span);

  // Botão Editar

  let editBtn = document.createElement("button");
  editBtn.innerText = "Editar";
  editBtn.onclick = () => editUser(novoItem);
  novoItem.appendChild(editBtn);

  // Botão Deletar
  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Deletar";
  deleteBtn.onclick = () => deleteUser(novoItem);
  novoItem.appendChild(deleteBtn);

  lista.appendChild(novoItem);

  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";

  userCount++;
  document.getElementById("userCount").innerText = userCount;
};

const editUser = (li) => {
  let span = li.querySelector("span");
  let text = span.innerText;

  let [nome, email] = text.split(" - ");

  let newNome = prompt("Novo nome:", nome);
  let newEmail = prompt("Novo email:", email);

  if (newNome && newEmail) {
    span.innerText = newNome.trim() + " - " + newEmail.trim();
  }
};

const deleteUser = (li) => {
  li.remove();
  userCount--;
  document.getElementById("userCount").innerText = userCount;
};

// 1- Criar um array para armazenar os produtos
let listaProdutos = [];

const adicionarProduto = () => {
  // Captura os elementos do HTML
  const inputNome = document.getElementById("produto");
  const inputQtd = document.getElementById("quantidade");
  const inputValor = document.getElementById("valor");

  // Converter para valores numéricos e limpar espaços
  const nome = inputNome.value.trim();
  const qtd = parseInt(inputQtd.value);
  const valor = parseFloat(inputValor.value);

  // 2 - Validação: impede campos vazios ou valores menores/iguais a zero
  if (!nome || isNaN(qtd) || isNaN(valor) || qtd <= 0 || valor <= 0) {
    alert("Preencha todos os campos com valores válidos!");
    return;
  }

  // 3 - Criar objeto do produto e calcular total individual
  const totalItem = qtd * valor;
  const novoProduto = { nome, qtd, valor, totalItem };

  // ADICIONADO: Agora as ações ocorrem dentro da função adicionarProduto
  listaProdutos.push(novoProduto);

  // Chamada das funções que atualizam a tela
  renderizarTabela();
  atualizarTotalGeral();

  // Limpar campos e focar no primeiro input para agilizar a digitação
  inputNome.value = "";
  inputQtd.value = "";
  inputValor.value = "";
  inputNome.focus();
};

// 4 - Função para desenhar as linhas da tabela no HTML tbody
const renderizarTabela = () => {
  const tbody = document.querySelector("#tabelaProdutos tbody");
  
  // Limpamos o conteúdo atual para não duplicar itens antigos 
  tbody.innerHTML = "";

  // Percorre o array e cria uma string de HTML para cada produto
  listaProdutos.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.qtd}</td>
        <td>R$ ${item.valor.toFixed(2)}</td>
        <td>R$ ${item.totalItem.toFixed(2)}</td>
      </tr>
    `;
  });
};

// 5 - Função para somar tudo e atualizar o "Total" e o "Valor Líquido"
const atualizarTotalGeral = () => {
  // O reduce soma todos os 'totalItem' do array começando em 0
  const totalSoma = listaProdutos.reduce((acc, p) => acc + p.totalItem, 0);
  
  document.getElementById("total").innerText = totalSoma.toFixed(2);
  
  // Sempre que o total muda, chamamos o cálculo de desconto para atualizar o líquido
  aplicarDesconto();
};

// 6 - Função para calcular descontos (Moeda ou Porcentagem)
const aplicarDesconto = () => {
  const totalBruto = parseFloat(document.getElementById("total").innerText) || 0;
  const descDinheiro = parseFloat(document.getElementById("descontoValor").value) || 0;
  const descPorcentagem = parseFloat(document.getElementById("descontoPercentual").value) || 0;

  // Cálculo: Subtrai o valor fixo e depois aplica a porcentagem sobre o resto
  let valorLiquido = totalBruto - descDinheiro;
  valorLiquido = valorLiquido - (valorLiquido * (descPorcentagem / 100));

  // Exibe o resultado final, garantindo que não seja menor que zero (Math.max)
  document.getElementById("valorLiquido").innerText = Math.max(0, valorLiquido).toFixed(2);
};

// 7 - Função de limpeza/finalização
const finalizarCompra = () => {
  if (listaProdutos.length === 0) return alert("Adicione produtos primeiro!");
  
  alert(`Compra finalizada! Valor a pagar: R$ ${document.getElementById("valorLiquido").innerText}`);
  
  // Limpa o estado da aplicação
  listaProdutos = [];
  renderizarTabela();
  atualizarTotalGeral();
};