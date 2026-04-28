/*function olaMundo() {
  alert("Olá Mundo!"); 
  //Alert -> faz um alerta com o que tiver dentro de ("")
}*/

//ARROW FUNCTION
const olaMundo = () => {
  alert("Olá Mundo!");
};

const mudarTexto = () => {
  //Criar uma variavel para armazenar o elemento do documento

  let elementoAlvo = document.getElementById("texto");

  elementoAlvo.innerHTML = "Novo texto com Java Script🔥";
  elementoAlvo.style.color = "red";
  elementoAlvo.style.background = "black";
};

const enviarNome = () => {
  let nomeDigitado = document.getElementById("nome").value;

  alert("Ola, " + nomeDigitado);
};

const somar = () => {



  //buscou elementos por ID



  let numero1 = document.getElementById("n1").value;
  let numero2 = document.getElementById("n2").value;

  //Realizou a soma dos valores
  let result = parseInt(numero1) + parseInt(numero2);

  //Devolveu o resultado para o formulário
  document.getElementById("resultado").innerHTML = result;
  alert(result)
};
