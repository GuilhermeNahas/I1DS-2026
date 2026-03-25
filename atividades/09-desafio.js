//PARTE 1
let nome = "Cristiano de Paula";
let idade = 15;
let cidade = "Igaraçu do tiete";
console.log("Olá", nome, " você tem ", idade, "anos, e mora em", cidade);

console.log("---------------------------");

//EXERCICIO 2
let num1 = 30;
let num2 = 15;

let soma = num1 + num2;
let subtracao = num1 - num2;
let multiplicacao = num1 * num2;
let divisao = num1 / num2;
console.log("A soma desse valor é :", soma);
console.log("A subtração desse valor é :", subtracao);
console.log("A multiplicação desse valor é :", multiplicacao);
console.log("A divisão desse valor é :", divisao);
console.log("---------------------------");
//EXERCICIO 3
let areaRetangulo = "A = b * h";
console.log("Para calcular a area do retangulo a formula é :", areaRetangulo);
console.log("---------------------------");

//EXERCICIO 4
let volumeParalelepipedo = "V = C * L * A";
console.log(
  "Para calcular o volume de um paralelepípedo a forma utilizada é: ",
  volumeParalelepipedo,
);
console.log("--------------------------");

//EXERCICIO 5 - Dado o valor de um produto, calcule: 10% de desconto | valor final
let valorProduto = 1000;
let porcentagemDesconto = 10;
let desconto = valorProduto * (porcentagemDesconto / 100);
let valorFinal = valorProduto - desconto;
console.log("O valor do produto é: R$", valorProduto);
console.log("Seu desconto é de:", porcentagemDesconto, "%");
console.log("Valor final com desconto é: R$", valorFinal);
console.log("----------------------------------");

//EXERCICIO 6 - Converta temperatura de Celsius para Fahrenheit.
let temperaturaCelsius = 35;
//fórmula: (Celsius * 1.8) + 32
let converter = temperaturaCelsius * 1.8 + 32;
console.log(temperaturaCelsius + "°C equivalem a " + converter + "°F");
console.log("--------------------------");

//EXERCICIO 7- Calcule o IMC e exiba o valor.
let peso = 70;
let altura = 1.8 * 1.8;
let resultado = 70 / (1.8 * 1.8);
let imc = resultado;
console.log("Seu IMC é igual a: ", resultado);
console.log("----------------------------------");
//EXERCICIO 8- Calcule a media de 3 notas
let nota1 = 8;
let nota2 = 10;
let nota3 = 7;
let media = (nota1 + nota2 + nota3) / 3;
console.log("Sua média final é =", media);
console.log("----------------------------------");

//EXERCICIO 9- delta
let a = 2;
let b = 6;
let c = 4;

let delta = b * b - 4 * a * c;

console.log("Valor de a: " + a);
console.log("Valor de b: " + b);
console.log("Valor de c: " + c);
console.log("Delta (Δ): " + delta);
console.log("-----------------------------");

//EXERCICIO 10-
let horas = 2;
let minutos = horas * 60;
let segundos = horas * 3600;

console.log("Horas: " + horas);
console.log("Minutos: " + minutos);
console.log("Segundos: " + segundos);
console.log("-------------------------------");

//PARTE 2. EXERCICIO 11-
let num = -5;
if (num > 0) console.log("Positivo");
else if (num < 0) console.log("Negativo");
else console.log("Zero");
console.log("--------------------------------");

// 12
if (num % 2 === 0) console.log("Par");
else console.log("Ímpar");
console.log("--------------------------------");
// 13
if (num % 3 === 0) console.log("Múltiplo de 3");
console.log("--------------------------------");
// 14
let nota = 6;
if (nota >= 7) console.log("Aprovado");
else if (nota >= 5) console.log("Recuperação");
else console.log("Reprovado");
console.log("--------------------------------");
// 15
let idadePessoa = 20;
if (idadePessoa >= 18 && idadePessoa <= 70) console.log("Voto obrigatório");
else if (idadePessoa >= 16) console.log("Voto opcional");
else console.log("Não pode votar");
console.log("--------------------------------");
// 16
if (num >= 10 && num <= 50) console.log("Está entre 10 e 50");
console.log("--------------------------------");
// 17
let user = "admin";
let senha = "1234";
if (user === "admin" && senha === "1234") console.log("Login OK");
else console.log("Erro");
console.log("--------------------------------");
// 18
let x = 10,
  y = 20;
console.log("Maior:", x > y ? x : y);
console.log("--------------------------------");
// 19
let p = 10,
  q = 20,
  r = 5;
let maior = p;
if (q > maior) maior = q;
if (r > maior) maior = r;
console.log("Maior:", maior);
console.log("--------------------------------");
// 20
let idadeClass = 30;
if (idadeClass <= 12) console.log("Criança");
else if (idadeClass <= 17) console.log("Adolescente");
else if (idadeClass <= 59) console.log("Adulto");
else console.log("Idoso\n");
console.log("--------------------------------");

//PARTE 3. 21
let dia = 3;
switch (dia) {
  case 1:
    console.log("Domingo");
    break;
  case 2:
    console.log("Segunda");
    break;
  case 3:
    console.log("Terça");
    break;
  case 4:
    console.log("Quarta");
    break;
  case 5:
    console.log("Quinta");
    break;
  case 6:
    console.log("Sexta");
    break;
  case 7:
    console.log("Sábado");
    break;
}
console.log("--------------------------------");

// 22
let mes = 5;
switch (mes) {
  case 1:
    console.log("Janeiro");
    break;
  case 5:
    console.log("Maio");
    break;
  // completar conforme necessário
}
console.log("--------------------------------");

// 23
switch (mes) {
  case 1:
  case 2:
  case 3:
    console.log("1º trimestre");
    break;
  case 4:
  case 5:
  case 6:
    console.log("2º trimestre");
    break;
}
console.log("--------------------------------");

// 24
let opcao = 1;
let n1 = 10,
  n2 = 5;
switch (opcao) {
  case 1:
    console.log(n1 + n2);
    break;
  case 2:
    console.log(n1 - n2);
    break;
  case 3:
    console.log(n1 * n2);
    break;
  case 4:
    console.log(n1 / n2);
    break;
}
console.log("--------------------------------");

// 25
switch (nota) {
  case "A":
  case "a":
    console.log("Excelente");
    break;

  case "B":
  case "b":
    console.log("Bom");
    break;

  case "C":
  case "c":
    console.log("Regular");
    break;

  case "D":
  case "d":
    console.log("Ruim");
    break;

  default:
    console.log("Nota inválida!");
    break;
}
console.log("-----------------------------------");

//PARTE 4. 26 (mostre numeros de 1 a 100)
for (let i = 1; i < 100; i++) {
  console.log(i);
}
console.log("-----------------------------------");

//27
for (let i = 100; i >= 1; i--) console.log(i);
console.log("-----------------------------------");

//28
for (let i = 1; i <= 50; i++) {
  if (i % 2 === 0) console.log(i);
}
console.log("-----------------------------------");

//29
for (let i = 1; i <= 50; i++) {
  if (i % 2 !== 0) console.log(i);
}
console.log("-----------------------------------");

//30
let adicao = 0;
for (let i = 1; i <= 100; i++) adicao += i;
console.log(adicao);

//31
let f = 5,
  fat = 1;
for (let i = 1; i <= f; i++) fat *= i;
console.log(fat);
console.log("-----------------------------------");

//32- tabuada de qualquer numero
let tab = 5;
for (let i = 1; i <= 10; i++) {
  console.log(`${tab} x ${i} = ${tab * i}`);
}
console.log("-----------------------------------");

//33 - conte quantos numeros pares existem de 1 a 100
let conteNum = 0;
for (let i = 1; i <= 100; i++) {
  if (i % 2 === 0) conteNum++;
}
console.log(conteNum);
console.log("-----------------------------------");

//34-Exiba todos os múltiplos de 5 entre 0 e 100.
for (let i = 0; i <= 100; i++) {
  if (i % 5 === 0) console.log(i);
}
console.log("----------------------------------------");

//35- desenho
for (let i = 1; i <= 5; i++) {
  let linha = "";
  for (let j = 1; j <= i; j++) {
    linha += "*";
  }
  console.log(linha);
}
console.log("-------------------------------");

//PARTE 5
//36-
let numbers1 = [5, 12, 8, 3, 20, 7, 9, 14, 2, 10];
for (let i = 0; i < numbers1.length; i++) {
  //elementos
  console.log(numbers1[i]);
}
console.log("-------------------------");
//37
let valores = [5, 12, 8, 3, 20, 7, 9, 14, 2, 10];
let result = 0;

for (let i = 0; i < valores.length; i++) {
  result += valores[i];
}
console.log("A soma dos vetores é =", result);
console.log("-----------------------------------");

//38   media dos vetores
let mediaVetor = result / valores.length;
console.log("A média dos vetores é =", mediaVetor);
console.log("-------------------------------");

//39- encontrar o maior valor
let maior1 = valores[0];

for (let i = 1; i < valores.length; i++) {
  if (valores[i] > maior1) {
    maior1 = valores[i];
  }
}

console.log("O maior valor é:", maior1);
console.log("-------------------------------------------");

//40- encontre o menor valor
let valores1 = [5, 12, 8, 3, 20, 7, 9, 14, 2, 10];
let menor1 = valores[0]; // Começamos com o primeiro
for (let i = 1; i < valores.length; i++) {
  if (valores[i] < menor1) {
    menor1 = valores[i];
  }
}
console.log("O menor valor é =", menor1);
console.log("----------------------------");

//41- conte quantos numeros são impares e pares
let valor1 = [5, 12, 8, 3, 20, 7, 9, 14, 2, 10];
let paresVetor = 0;
let imparesVetor = 0;

for (let i = 0; i < valor1.length; i++) {
  if (valores[i] % 2 === 0) {
    paresVetor++;
  } else {
    imparesVetor++;
  }
}
console.log("Em seu vetor tem :", paresVetor, " pares");
console.log("Em seu vetor tem :", imparesVetor, " impares");

//42- Multiplique todos os elementos por 2
console.log("Dobrando os valores do vetor...");
for (let i = 0; i < valor1.length; i++) {
  // pega o valor e multiplicamos por 2
  valor1[i] = valor1[i] * 2;
}
console.log("Novo vetor com valores dobrados:", valor1);
console.log("--------------------------------");

//PARTE 6-
//43 Crie uma matriz 3x3 e exiba todos os valores
var matriz = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// 44
for (let i = 0; i < 3; i++) console.log(matriz[i][i]);

// 45
for (let i = 0; i < 3; i++) console.log(matriz[i][2 - i]);

// 46
let somaM = 0;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) somaM += matriz[i][j];
}
console.log("Soma:", somaM);

// 47
let maiorM = matriz[0][0];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (matriz[i][j] > maiorM) maiorM = matriz[i][j];
  }
}
console.log("Maior:", maiorM);

// 48
let X = 2;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) matriz[i][j] *= X;
}
console.log(matriz);

// 49
let count = 0;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (matriz[i][j] > 10) count++;
  }
}
console.log("Maiores que 10:", count);

// 50
for (let i = 0; i < 3; i++) {
  let linha = "[ ";
  for (let j = 0; j < 3; j++) {
    linha += matriz[i][j] + " ";
  }
  linha += "]";
  console.log(linha);
}
