//variavel para armazenar o elemento <p> com id = contador
let contador = document.getElementById("contador");

const adicionar = () => {
  //variavel para armazenar o valor atual
  let valorAtual = parseInt(contador.innerHTML);
  //auemnta o valor atual em +1
  valorAtual++;
  //atualizar o valor do elemento <p> com id=contador
  contador.innerHTML = valorAtual;
};

const diminuir = () => {
  valorAtual = parseInt(contador.innerHTML);
  valorAtual--;
  contador.innerHTML = valorAtual;
};

const zerar = () => {
  valorAtual = parseInt(contador.innerHTML);
  valorAtual = 0;
  contador.innerHTML = valorAtual;
};



