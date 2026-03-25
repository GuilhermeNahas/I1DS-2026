//operadores lógicos ( verdadeiro ou falso)
let souPobre = true;

console.log("Sou pobre?", souPobre);
console.log("Negação de souPobre:", !souPobre);// !souPobre por exemplo nega o que vem na frente de !

let manha = true;
let sono = true;
console.log("-----------------------------------------");
console.log("Manhã:", manha, "| Estou com sono?", sono);

//Operador E AND e OR
console.log("Operador AND (E):", manha && sono);
console.log("Operador OR (OU):", manha || sono);

manha = false;
console.log("-----------------------------------------");
console.log("Manhã:", manha, "| Estou com sono?", sono);

//Operador E AND e OR
console.log("Operador AND (E):", manha && sono);
console.log("Operador OR (OU):", manha || sono);

sono = false;
console.log("-----------------------------------------");
console.log("Manhã:", manha, "| Estou com sono?", sono);

//Operador E AND e OR
console.log("Operador AND (E):", manha && sono);
console.log("Operador OR (OU):", manha || sono);
