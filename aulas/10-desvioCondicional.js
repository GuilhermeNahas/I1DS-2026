// Desvio Condicional - IF-ELSE

/* Condiçoes simples com IF
 Sintaxe: if( condição ){
    codigo a ser executado, se verdadeiro.
 } 
*/

let anoNascimento = 2003;

if (anoNascimento > 2003) {
  console.log("A pessoa nasceu depois de 2003.");
}
if (anoNascimento < 2003) {
  console.log("A pessoa nasceu antes de 2003.");
}
if (anoNascimento == 2003) {
  console.log("A pessoa nasceu em 2003.");
}

// Condicional IF-ELSE

anoNascimento = 2000;
if (anoNascimento > 2000) {
  console.log("A pessoa nasceu depois de 2000");
} else {
  console.log("A pessoa nasceu antes de 2000");
}

// Condicional Composta com IF

const login = "admin";
const senha = "12345";

let loginUser = "adm";
let senhaUser = "1234";

if (loginUser == login && senhaUser == senha) {
  console.log("Login Realizado com Sucesso!");
}

// Condicional Composta com IF-ELSE
if (loginUser == login && senhaUser == senha) {
  console.log("Acesso Permitido!");
} else {
  console.log("Acesso Negado!");
}

// Desvios aninhados - IF-ELSE-IF-ELSE ...

let semaforo = "nada";

if (semaforo == "vermelho") {
  console.log("Pare");
} else if (semaforo == "amarelo") {
  console.log("Atenção");
} else if (semaforo == "verde") {
  console.log("Siga");
} else {
  console.log("Opção Incorreta");
}

// Criando variaveis locais (  só existem dentro do bloco onde foram criadas )

let mes = "Agosto";
let dia = "15";

if (dia == 15 && mes == "Agosto") {
  let mensagem = "Hoje é dia 15 de Agosto.";
  console.log(mensagem);
}

console.log(
  "Tentando acessar a variavel 'mensagem' fora do escopo do IF, vai dar erro!!!",
);
// console.log(mensagem);

/***************************************************************/
// IF Ternário (IF Inline)
let preco = 500;
let resultado = (preco <= 100) ? "Tá barato" : "Vish, ta caro!";
console.log("Preço:",preco, "-", resultado);
// O codigo acima, faz exatamente a mesma coisa que o código abaixo

if (preco <= 100) {
  resultado = "Tá barato";
} else {
  resultado = "Vish, ta caro!";
}
console.log("Preço:",preco, "-", resultado);

/***************************************************************/
