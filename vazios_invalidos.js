//Problemas corrigidos:
//✅ Impede cadastro com nome vazio
//✅ Impede preço menor ou igual a zero
//✅ Impede quantidade negativa

//Validações adicionadas:
//- if (!nome) → 'Informe o nome do produto'
// if (preco <= 0) → 'Informe um preço válido'
//- if (estoque < 0) → 'Informe uma quantidade válida'"

// COM validação completa de campos
function cadastrarProduto() {
    const nome = document.getElementById('prodNome').value.trim();
    const preco = parseFloat(document.getElementById('prodPreco').value);
    const estoque = parseInt(document.getElementById('prodQtd').value);

    // CORREÇÃO BUG #2: Validação de campos vazios
    if (!nome) {
        mostrarMensagem('❌ Por favor, informe o nome do produto!', 'error');
        return;
    }
    
    // CORREÇÃO BUG #2: Validação de preço inválido
    if (isNaN(preco) || preco <= 0) {
        mostrarMensagem('❌ Por favor, informe um preço válido!', 'error');
        return;
    }
    
    // CORREÇÃO BUG #2: Validação de quantidade negativa
    if (isNaN(estoque) || estoque < 0) {
        mostrarMensagem('❌ Por favor, informe uma quantidade válida!', 'error');
        return;
    }

    produtos.push({ nome, preco, estoque });
    mostrarMensagem(`✅ Produto "${nome}" cadastrado com sucesso!`, 'success');
}
