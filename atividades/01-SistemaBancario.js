/***************************************************** 
Exercícios para fixação 
*****************************************************/
/* 
1. Crie uma variável e atribua o nome de uma pessoa; 
2. Crie uma variável e atribua o nome de um banco; 
3. Crie uma variável e atribua o número da agência; 
4. Crie uma variável e atribua o número da conta; 
5. Crie uma variável e atribua o saldo da conta; 
6. Imprima os dados e o saldo da conta; 
7. Efetue e imprima 5 movimentações na conta; 
8. Imprima novamente os dados e o saldo da conta; 
*/

let nome = "Guilherme";
let banco = "Bradesco";
let agencia = "001";
let conta = 12345 - 6;
let saldo = 500;

//Imprimindo dados e saldo bancario
console.log("***********", banco, "*************");
console.log("Cliente:", nome);
console.log("Agência:", agencia, "| Conta: ", conta);
console.log("Saldo: R$", saldo);
console.log("*************************************");

//Efetuando e imprimindo transações
console.log("Pix recebido: R$75,00");
saldo = saldo + 75;
console.log("Novo saldo é de R$", saldo);
console.log("Pix enviado: R$120");
saldo = saldo - 120;
console.log("Novo saldo é de R$:", saldo);
console.log("Pix recebido de Cristiano: R$20000");
saldo += 20000;
console.log("Novo saldo é de R$: ", saldo);
console.log("Pix enviado para Marcio: R$10000");
saldo -= 10000;
console.log("Seu saldo é de: ", saldo);

//Imprimindo os dados e saldo bancário
console.log("***********", banco, "*************");
console.log("Cliente:", nome);
console.log("Agência:", agencia, "| Conta: ", conta);
console.log("Saldo: R$", saldo);
console.log("*************************************");
