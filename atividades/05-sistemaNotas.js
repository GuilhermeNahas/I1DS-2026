function verificarSituacao(nota) {
    if (nota < 5){
        return "Reprovado";
    }else if (nota < 7) {
        return "Recuperação";
    } else {
        return "Aprovado";
    }
}
console.log(verificarSituacao(5));
console.log(verificarSituacao(7));



// PARTE 02 - extra (MÉDIA) (SOLUÇÃO MEIO)

function situacaoFinal(n1,n2,n3,n4) {
    let media = (n1 + n2 + n3 + n4) / 4;

    if (media < 5){
        return "Reprovado";
    }else if (media < 7) {
        return "Recuperação";
    } else {
        return "Aprovado";
    }
}

console.log(situacaoFinal(7, 8, 6, 5));
console.log(situacaoFinal(7, 7, 7, 7));

// PARTE 03 - SOMA DA MÉDIA (SOLUÇÃO FINAL)

function final (n1,n2,n3,n4) {
    let media = (n1 + n2 + n3 + n4) / 4;
    let situacao;

    if(media < 5) situacao = "Reprovado";
    else if (media < 7) situacao = "Recuperação";
    else situacao = "Aprovado";

    return "Média: " + media + "- Situação: " + situacao;
}

console.log(final(7, 8, 6, 5));