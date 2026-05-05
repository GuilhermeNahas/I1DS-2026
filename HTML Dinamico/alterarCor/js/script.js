/*Criando uma variavel para armazenar a div com Id = "lampada"
let lampada = document.getElementById("lampada");

//criando função para mudar a cor da div lampada para verde
function acenderVerde() {
  lampada.style.backgroundColor = "green";
}

function acenderVermelho() {
  lampada.style.backgroundColor = "red";
}

function acenderAmarelo() {
  lampada.style.backgroundColor = "yellow";
}

function acenderBranco() {
  lampada.style.backgroundColor = "white";
}
*/

//Forma mais utlizada ARROW FUNCTION, para trocar cor de acordo com o parametro
const acender = (cor) => {
  lampada.style.backgroundColor = cor;
};
