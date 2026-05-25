//Necessidade identificada:
//- Usuários precisavam excluir e recriar produtos para corrigir erros
//- Perda de histórico de vendas ao recriar produto

//Solução implementada:
//✅ Botão 'Editar' em cada produto
//✅ Modal de edição com dados pré-preenchidos
//✅ Validação para evitar nomes duplicados durante edição
//✅ Atualização automática do nome nas vendas existentes
//✅ Feedback visual com mensagem de sucesso

//Funções adicionadas:
//- abrirModalEdicao()
//- fecharModalEdicao()
//- salvarEdicao()"

// NOVA FUNCIONALIDADE: Edição de produtos

// Variável para controlar qual produto está sendo editado
let produtoParaEditar = null;

// Abrir modal de edição com dados do produto
function abrirModalEdicao(indice) {
    const produto = produtos[indice];
    if (!produto) return;
    
    produtoParaEditar = indice;
    
    // Preencher formulário com dados atuais
    document.getElementById('editProdNome').value = produto.nome;
    document.getElementById('editProdPreco').value = produto.preco;
    document.getElementById('editProdQtd').value = produto.estoque;
    
    document.getElementById('modalEdicao').style.display = 'block';
}

// Fechar modal de edição
function fecharModalEdicao() {
    document.getElementById('modalEdicao').style.display = 'none';
    produtoParaEditar = null;
}

// Salvar alterações do produto
function salvarEdicao() {
    if (produtoParaEditar === null) return;
    
    const nome = document.getElementById('editProdNome').value.trim();
    const preco = parseFloat(document.getElementById('editProdPreco').value);
    const estoque = parseInt(document.getElementById('editProdQtd').value);
    
    // Validações
    if (!nome) {
        mostrarMensagem('❌ Por favor, informe o nome do produto!', 'error');
        return;
    }
    if (isNaN(preco) || preco <= 0) {
        mostrarMensagem('❌ Por favor, informe um preço válido!', 'error');
        return;
    }
    if (isNaN(estoque) || estoque < 0) {
        mostrarMensagem('❌ Por favor, informe uma quantidade válida!', 'error');
        return;
    }
    
    // Verificar nome duplicado (exceto o próprio produto)
    const produtoExistente = produtos.find((p, index) => 
        p.nome.toLowerCase() === nome.toLowerCase() && index !== produtoParaEditar
    );
    
    if (produtoExistente) {
        mostrarMensagem('❌ Já existe outro produto com este nome!', 'error');
        return;
    }
    
    const nomeAntigo = produtos[produtoParaEditar].nome;
    
    // Atualizar produto
    produtos[produtoParaEditar] = {
        nome: nome,
        preco: preco,
        estoque: estoque
    };
    
    // Atualizar vendas com o novo nome
    vendas.forEach(venda => {
        if (venda.produto === nomeAntigo) {
            venda.produto = nome;
        }
    });
    
    // Atualizar interfaces
    atualizarListaProdutos();
    atualizarListaVendas();
    atualizarSelectProdutos();
    
    fecharModalEdicao();
    mostrarMensagem(`✏️ Produto "${nomeAntigo}" foi atualizado para "${nome}" com sucesso!`, 'success');
}