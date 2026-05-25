
//- Problema: Sistema permitia cadastrar dois produtos com mesmo nome
//- Impacto: Inconsistência no estoque e vendas
//- Status: Pendente de correção

//Solução: Adicionada validação no cadastro que verifica se já existe
//produto com mesmo nome (case insensitive)

// COM validação de produtos duplicados
function cadastrarProduto() {
    const nome = document.getElementById('prodNome').value.trim();
    const preco = parseFloat(document.getElementById('prodPreco').value);
    const estoque = parseInt(document.getElementById('prodQtd').value);

    // CORREÇÃO BUG #1: Verificar se produto já existe (case insensitive)
    const produtoExistente = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (produtoExistente) {
        mostrarMensagem('❌ Já existe um produto com este nome!', 'error');
        return; // Impede o cadastro
    }

    produtos.push({ nome, preco, estoque });
    mostrarMensagem(`✅ Produto "${nome}" cadastrado com sucesso!`, 'success');
}
