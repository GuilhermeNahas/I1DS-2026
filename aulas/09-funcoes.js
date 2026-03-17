/* 
    Introdução a funções em JavaScript
    função -> Uma função em JavaScript é um bloco de código reutilizável que executa uma tarefa quando é chamado.
*/

// Criar um função que soma dois valores e retorna um resultado
function somar(valor1, valor2) {
  return valor1 + valor2;
}

console.log("'5 + 3 ='", somar(5, 3));
console.log('15 + 32" =', somar(15, 32));

let v1 = 10;
let v2 = 35;

console.log("A soma de v1 + v2 =", somar(v1, v2));

/* Criar um função que escreve bom dia */

function bomDia() {
  console.log("Olá, muito bom dia para você!");
}

bomDia();
bomDia();
bomDia();

/* Função para apresentar uma pessoa */

function apresentarPessoa(nome, idade, cidade) {
  console.log(
    "Apresento a vocês:",
    nome,
    " que tem",
    idade,
    "anos, e mora em",
    cidade,
    ".",
  );
}

apresentarPessoa("José", 31, "Brotas");
apresentarPessoa("Pafúncio", 16, "Jaú");
apresentarPessoa("Maria", 62, "São Paulo");

/* Criar uma função que calcula e retorna o desconto em uma venda */
function desconto(valorVenda, percentualDesconto) {
  let valorDesconto = valorVenda * (percentualDesconto / 100);
  return valorDesconto;
}

let totalPedido = 530.0;
let totalDesconto = desconto(totalPedido, 7.5);
let valorFinal = totalPedido - totalDesconto;

console.log("------------------------------------------");
console.log("Total do Pedido:", totalPedido);
console.log("Total do Desconto:", totalDesconto);
console.log("Valor Final do Pedido:", valorFinal);
console.log("------------------------------------------");
