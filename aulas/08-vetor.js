// Criando variáveis do tipo array (Vetor)

var dinos = ["Tiranossauro Rex", "Estegossauro", "Brontossauro", "Tricerátops"];

//Imprimindo os dados em forma de linha console.log
console.log(dinos);
//Imprimindo os dados em formato de tabela
console.table(dinos);

//length -> "Tamanho" do Array (Quantidade de elementos)
console.log("O vetor tem", dinos.length, "Elementos");

//Imprimir elementos a partir do indíce
console.log(dinos[1]);
console.log(dinos[3]);
console.log(dinos[2]);

// push -> adiciona um novo elemento ao final da final
dinos.push("Anquilossauro");
console.table(dinos);
console.log("O vetor agora tem", dinos.length, "Elementos");

//unshift -> adiciona um novo elemento no início da fila
dinos.unshift("Velociraptor");
console.table(dinos);
console.log("O vetor agora tem", dinos.length, "Elementos");

//Obter um elemento a partir do seu indíce
console.log("1ª posição:", dinos[0]);
console.log("2ª posição:", dinos[3]);
console.log("20ª posição: (não existe)", dinos[20]);

