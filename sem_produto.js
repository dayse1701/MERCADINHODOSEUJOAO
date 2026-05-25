//-Cenário do bug:
//-1. Usuário abre o sistema
//-2. Tenta registrar venda sem cadastrar produtos
//-3. Sistema quebrava ou não respondia

//-Correção:
//- Verifica if (produtos.length === 0)
//- Mensagem amigável: 'Cadastre um produto primeiro!'
//- Impede abertura do select de produtos"


// COM verificação de produtos cadastrados
function registrarVenda() {
    // CORREÇÃO BUG #4: Bloquear venda sem produtos
    if (produtos.length === 0) {
        mostrarMensagem('❌ Cadastre um produto primeiro!', 'error');
        return;
    }

    const indice = parseInt(document.getElementById('vendaProduto').value);
    const qtdVendida = parseInt(document.getElementById('vendaQtd').value);
    
    if (isNaN(indice) || indice < 0) {
        mostrarMensagem('❌ Selecione um produto!', 'error');
        return;
    }
    
    const produto = produtos[indice];
    
    if (qtdVendida > produto.estoque) {
        mostrarMensagem(`❌ Estoque insuficiente! Tem apenas ${produto.estoque} unidades.`, 'error');
        return;
    }
    
    produto.estoque -= qtdVendida;
    mostrarMensagem(`✅ Venda registrada!`, 'success');
}