/*****************************************************
Lista de Exercícios
*****************************************************/
/*
1. Crie uma função que receba como parâmetro o ano de nascimento de uma pessoa a retorne sua idade.


2. Crie uma função que receba a quantidade de combustível de um carro e retorne quantos Kms ele pode viajar com esse combustível. Considere que o
 veículo faz uma média de 12 Km/L.
*/

// idade da pessoa atraves do ano de nascimento
function obterIdade(anoNascimento) {
  return `Você nasceu em: ${anoNascimento}, e tem : ${2026 - anoNascimento} anos`;
}

console.log(obterIdade(2009));
console.log(obterIdade(1800));

function quantidadeCombustivel(combustivel) {
  return `com ${combustivel}L de combustivel, o carro pode percorrer ${combustivel * 12}km`;
}

console.log(quantidadeCombustivel(30));
console.log(quantidadeCombustivel(80));
