/* 
🧠 Desafio de Programação – Sistema de Média Escolar Switch Case
🎯 Objetivo


Criar um programa em JavaScript com switch case que calcule a média final de um aluno e informe sua situação no final do ano.


📌 Regras do programa
1. O programa deve receber 4 notas (de 0 a 10).
2. Calcular a média das notas.
3. Informar a situação do aluno de acordo com a média:


Média                   Situação
menor que 5             Reprovado
entre 5 e 6.9           Recuperação
maior ou igual a 7      Aprovado


*/

//RESOLUÇÂO GUSTAVO
let n1 = 7;
let n2 = 8;
let n3 = 6;
let n4 = 5;


// Calculando a média
let media = (n1 + n2 + n3 + n4) / 4;


//Usando switch case com boolean (true)
switch (true) {
  case media < 5:
    console.log("Média: " + media.toFixed(2));
    console.log("Situação: Reprovado");
    break;


  case media < 7:
    console.log("Média: " + media.toFixed(2));
    console.log("Situação: Recuperação");
    break;


  case media >= 7:
    console.log("Média: " + media.toFixed(2));
    console.log("Situação: Aprovado");
    break;


  default:
    console.log("Erro no cálculo");
    break;
}




