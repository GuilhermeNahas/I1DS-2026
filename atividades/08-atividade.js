/*****************************************************
Lista de Exercícios
*****************************************************/
/*
Dada a matriz abaixo, faça um programa em JavaScript
que imprima os elementos da sua diagonal principal.
| 3 5 8 |
| 1 9 2 |
| 7 1 4 |
********************************************************
Dada a matriz abaixo, faça um programa em JavaScript
que multiplique seus elementos por um valor x e imprima
a matriz antes e após a multiplicação.
| 8 1 3 |
| 2 9 1 |
| 4 6 2 |
*/
//              EXERCICIO 1
let matriz1 = [
  [3, 5, 8],
  [1, 9, 2],
  [7, 1, 4]
];

// Diagonal principal
for (let i = 0; i < matriz1.length; i++) {
  console.log(matriz1[i][i]);
}

//           EXERCICIO 2 
let matriz = [
  [8, 1, 3],
  [2, 9, 1],
  [4, 6, 2]
];

let x = 2;

// Matriz original
console.log("Matriz original:");

for (let i = 0; i < matriz.length; i++) {
  console.log(matriz[i][0] + " " + matriz[i][1] + " " + matriz[i][2]);
}

// Multiplicando por x
for (let i = 0; i < matriz.length; i++) {
  matriz[i][0] = matriz[i][0] * x;
  matriz[i][1] = matriz[i][1] * x;
  matriz[i][2] = matriz[i][2] * x;
}

// Matriz após multiplicação
console.log("Matriz após multiplicação por " + x + ":");

for (let i = 0; i < matriz.length; i++) {
  console.log(matriz[i][0] + " " + matriz[i][1] + " " + matriz[i][2]);
}