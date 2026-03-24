// Laço de repetição - FOR (Para)
// O professor te colocou de castigo e pediu para você escrever mil vezes a frase
// "Eu vou prestar a atenção as aulas e anotar tudo!"
/* let i = 0 => primeiro utilizo uma variavel de controle
i < 1000 => condição da repetição
i++ => aumenta a variavel de controle para não travar
*/
for (let i = 0; i < 1000; i++) {
  console.log("Eu vou prestar a atenção as aulas e anotar tudo! ");
}
console.log("---------------------------------------------------------------");

// Escreva todos os numeros de 1 a 20
for (let i = 1; i <= 20; i++) {
  //utilizamos o comando for loop e criamos a variavel e mudamos nosa condicional sendo i = 1, sendo o i <= 20, fazendo o programa contar até 20
  console.log(i);
}
console.log("---------------------------------------------");

//escreva todos os numeros pares entre 1 e 20
for (let i = 0; i < 20; i += 2) {
  // Começamos em 2, continuamos enquanto i for menor ou igual a 20, e somamos 2 a cada volta.
  console.log(i);
}
// Outra solução de numeros pares
for (let i = 1; i <= 20; i++) {
  if (i % 2 == 0) console.log(i); // % = resto da divisão
  // i % 2 == 0 => se o resto da divisão de i por 2 for 0, ele mostra i
}
console.log("------------------------------------------------------------------",);
// Dado um vetor[array], calcule e exiba o somatório de seus elementos
var numeros = [5, 6, 8, 14, 0, 6, 9, 7, 2];
let soma = 0;

console.log(numeros.length);
// numeros.length mostra a quantidade de itens no array

for (let i = 0; i < numeros.length; i++) {
  soma += numeros[i];
}
console.log(soma);
