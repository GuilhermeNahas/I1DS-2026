//Switch Case -> estrutura de decisão usada quando queremos comprar o valor de uma variavel com varios possiveis resultados
//variavel com varios possiveis resiçtadps
//REGRA DO CASTELLO -> se tiver mais que 3 comparadores, faça um switch Case

//EXEMPLO 01 - Menu
//Neste exemplo a variavel menuSelecionado guardara o nome de uma opção de Menu
//o switch verifica qual foi a opção escolhida e exibe uma mensagem correspondente

let menuSelecionado = "Home";
switch (menuSelecionado) {
  case "Home":
    console.log("Você clicou no link 'Quem somos'");
    break;
  case "Contato":
    console.log("Você clicou no link 'Contato'");
    break;

  default:
    console.log("Opção incorreta, selecione uma opção no menu");
    break;
    case "Redes Sociais":
        console.log("Você clicou no link 'redes socias' ")
        break;
        case "Pague um Café":
        console.log("Você acabou de me pagar um cafe!")
        break;
}


//To fixed é utilizado para falar para o codigo quantos numeros decimais seu numero ira ter 
//POR EXEMPLO:
const pi = 3.1415683

console.log(pi)
console.log(pi.toFixed(2))