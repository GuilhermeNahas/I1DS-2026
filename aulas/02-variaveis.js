//Criando variáveis com "var" (var nome_variavel = <valor>;)
var nome = "Tibúrcio";

//Demonstrando no console somente a variável
console.log(nome);

//Demonstrando no console texto + variável, com virgula
console.log("Meu nome é", nome);

//Criando variável de idade e atribuindo uma idade para ela
var idade = 53;

//Demonstrando no console várias informações e pulo de linha com \n
console.log("Meu nome é", nome, "e eu tenho", idade, "anos \n");

//Linha de divisão
console.log("-----------------------------------------------------------");

//JavaScript trabalha com sistema case sensitive (maiúsculas são diferentes de
// minúsculas)
console.log("Criando uma variável teste e tentando acessar como TESTE");
let teste = "Variável teste!";

//Acessando a variável
//console.log(TESTE);

//Regras para nomear identificadores (variáveis)
//Podem iniciar com "A"-"Z", "a"-"z", "_" ou "$"
//Não podem conter caracter latino (ç,ã,á,à)
let MinhaVariavel = 10;
let outraVariavel = 2.65;
const _minhaConstante = "Uma constante qualquer!";
var $minhaVariavel = -5;

console.log(
  "Tentando criar uma variável que não obedece à regra de nomenclatura (@variavel) obtemos um erro",
);
//var @variavel = 4;

//Variáveis lógicas (boolean)
var nome = "Paulo";
var rico = false;
var eProfessor = true;
console.log("Nome:", nome, "| É professor?", eProfessor, "| É rico?", rico);
 