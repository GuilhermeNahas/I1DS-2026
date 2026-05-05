//criando função para gerar frases aleatórias
function falar() {
  //criando vetor de frases
  const frases = [
    "Hoje esta um dia bonito",
    "Vish, tem prova de matematica",
    "Qual cardapio de hoje?",
    "Falta muito pra sexta-feira",
  ];

  //Criando variavel para armazenar a div com id = tagarela
  let tagarela = document.getElementById("tagarela");

  //Criando variavel de controle para a frase exibida
  let controle = 0;

  //Gerando numero aleatório entre 0 e 1 (Lembrando que 1 não entra na contagem)
  let numero = Math.random(); //Math.random gera numeros aleatórios

  //obtendo indice da frase a ser usada
  if (numero > 0.75) controle = 3;
  else if (numero > 0.5) controle = 2;
  else if (numero > 0.25) controle = 1;

  //Alterando o conteudo da DIV "tagarela"
  tagarela.innerHTML = frases[controle];
}
