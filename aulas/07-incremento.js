// Operadores de incremento e decremento | pré e pós incremento
// incremento = somar algo a alguma variavel
// decremento = subtrair algo de alguma variavel

let idade = 16;
console.log(idade);

//idade = idade + 1; //somei +1 na idade
idade++;
console.log(idade);

idade++;
console.log(idade);
console.log("-------------------------------------");
//idade = idade - 1; //subtrai -1 na idade
idade--;
console.log(idade);
idade--;
console.log(idade);
idade--;
console.log(idade);

let novaIdade = idade + 1;// idade++ soma na mesma variavel
console.log("Idade: ", idade, "| Nova Idade: ", novaIdade);

novaIdade = idade ++;
console.log("Idade: ", idade, "| Nova Idade: ", novaIdade);
