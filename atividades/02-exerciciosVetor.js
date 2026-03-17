/*
    1. Crie um array de frutas com os seguintes elementos: Banana, Maçã,
    Pera, Uva, Morango.
    2. Adicione Tangerina no final.
    3. Adicione Goiaba no início.
    4. Exiba o conteúdo do índice 5.
    5. Exclua o elemento uva.
    6. Crie uma cópia do array apenas com os elementos com índices 2, 3 e 4.
*/

//Criando variaveis
let frutas = ["Maçã", "Banana", "Pera", "Uva", "Morango"];
console.log(frutas);
console.table(frutas);

//Adicionar no final
frutas.push("Tangerina");
console.table(frutas);

//adicionar no inicio
frutas.unshift("Goiaba");
console.table(frutas);

//exibir o conteudo
console.log("5ª posição:", frutas[5]);
console.table(frutas);

//excluir uva
let indiceUva = frutas.indexOf("Uva");
frutas.splice(indiceUva, 1); //indice que eu quero excluir no caso indiceUva e a quantidade
console.table(frutas);


//copiando indice
let copia = frutas.slice(2, 5);
console.table(copia);

 