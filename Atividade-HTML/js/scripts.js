let userCount = 0;

const cadastrar = (event) => {
    event.preventDefault();

    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;

    if (!nome || !email) return;

    let lista = document.getElementById('lista');

    let novoItem = document.createElement('li');

    let span = document.createElement('span');
    span.innerText = nome + " - " + email;
    novoItem.appendChild(span);

    // Botão Editar
    
    let editBtn = document.createElement('button');
    editBtn.innerText = 'Editar';
    editBtn.onclick = () => editUser(novoItem);
    novoItem.appendChild(editBtn);

    // Botão Deletar
    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Deletar';
    deleteBtn.onclick = () => deleteUser(novoItem);
    novoItem.appendChild(deleteBtn);

    lista.appendChild(novoItem);

    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';

    userCount++;
    document.getElementById('userCount').innerText = userCount;
};

const editUser = (li) => {
    let span = li.querySelector('span');
    let text = span.innerText;

    let [nome, email] = text.split(' - ');

    let newNome = prompt('Novo nome:', nome);
    let newEmail = prompt('Novo email:', email);

    if (newNome && newEmail) {
        span.innerText = newNome.trim() + " - " + newEmail.trim();
    }
};

const deleteUser = (li) => {
    li.remove();
    userCount--;
    document.getElementById('userCount').innerText = userCount;
};