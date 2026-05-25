//- Ao excluir produto, vendas antigas continuavam no relatório
//- Causava inconsistência e erro ao tentar editar vendas órfãs

//Solução implementada:
//1. Identifica vendas relacionadas ao produto
//2. Remove todas antes de excluir o produto
//3. Exibe mensagem informando quantas vendas foram removidas
//4. Mantém integridade referencial dos dados

//Método: vendas.filter(v => v.produto !== nomeProduto)"

// COM remoção de vendas relacionadas
function confirmarExclusao() {
    if (produtoParaExcluir !== null && produtoParaExcluir < produtos.length) {
        const produtoRemovido = produtos[produtoParaExcluir];
        const nomeProduto = produtoRemovido.nome;
        
        // CORREÇÃO BUG #5: Identificar vendas relacionadas
        const vendasRelacionadas = vendas.filter(v => v.produto.toLowerCase() === nomeProduto.toLowerCase());
        const qtdVendasRemovidas = vendasRelacionadas.length;
        
        // CORREÇÃO BUG #5: Remover todas as vendas do produto
        vendas = vendas.filter(v => v.produto.toLowerCase() !== nomeProduto.toLowerCase());
        
        // Remover o produto
        produtos.splice(produtoParaExcluir, 1);
        
        // Atualizar as listas
        atualizarListaProdutos();
        atualizarListaVendas();
        atualizarSelectProdutos();
        
        // Mensagem informando quantas vendas foram removidas
        let msg = `✅ Produto "${nomeProduto}" excluído com sucesso!`;
        if (qtdVendasRemovidas > 0) {
            msg += ` ${qtdVendasRemovidas} venda(s) relacionada(s) também foram removidas.`;
        }
        mostrarMensagem(msg, 'warning');
    }
    fecharModal();
}