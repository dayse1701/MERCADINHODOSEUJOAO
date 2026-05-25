//Comportamento anterior:
//- Permitia vender mais produtos do que o disponível
//- Resultado: Estoque ficava negativo

//Correção:
//- Validação: if (qtdVendida > produto.estoque)
//- Mensagem: 'Estoque insuficiente! Tem apenas X unidades'
//- Venda não é registrada"

// COM validação de estoque
function registrarVenda() {
    const indice = parseInt(document.getElementById('vendaProduto').value);
    const qtdVendida = parseInt(document.getElementById('vendaQtd').value);
    const produto = produtos[indice];
    
    // CORREÇÃO BUG #3: Verificar estoque insuficiente
    if (qtdVendida > produto.estoque) {
        mostrarMensagem(`❌ Estoque insuficiente! Tem apenas ${produto.estoque} unidades.`, 'error');
        return; // Impede a venda
    }
    
    // Só vende se tiver estoque
    produto.estoque -= qtdVendida;
    mostrarMensagem(`✅ Venda registrada!`, 'success');
}