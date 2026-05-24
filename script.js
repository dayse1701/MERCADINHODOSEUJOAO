// Banco de dados local
let produtos = [];
let vendas = [];
let mensagemTimeout = null;
let produtoParaExcluir = null; // Armazena o índice do produto a ser excluído
let produtoParaEditar = null; // Armazena o índice do produto a ser editado

// Função para atualizar o select de produtos
function atualizarSelectProdutos() {
    const select = document.getElementById('vendaProduto');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    
    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (Estoque: ${produto.estoque})`;
        select.appendChild(option);
    });
}

// Função para exibir mensagens
function mostrarMensagem(texto, tipo = 'success') {
    const container = document.querySelector('.grid');
    const msgDiv = document.createElement('div');
    msgDiv.className = `alert alert-${tipo}`;
    msgDiv.textContent = texto;
    container.parentNode.insertBefore(msgDiv, container);
    
    if (mensagemTimeout) clearTimeout(mensagemTimeout);
    mensagemTimeout = setTimeout(() => {
        msgDiv.remove();
    }, 3000);
}

// Função para cadastrar produto
function cadastrarProduto() {
    const nome = document.getElementById('prodNome').value.trim();
    const preco = parseFloat(document.getElementById('prodPreco').value);
    const estoque = parseInt(document.getElementById('prodQtd').value);

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

    // Verificar se produto já existe
    const produtoExistente = produtos.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (produtoExistente) {
        mostrarMensagem('❌ Já existe um produto com este nome!', 'error');
        return;
    }

    produtos.push({ nome, preco, estoque });
    atualizarListaProdutos();
    atualizarSelectProdutos();
    
    // Limpar campos
    document.getElementById('prodNome').value = '';
    document.getElementById('prodPreco').value = '';
    document.getElementById('prodQtd').value = '';
    
    mostrarMensagem(`✅ Produto "${nome}" cadastrado com sucesso!`, 'success');
}

// ==================== FUNÇÕES DE EDIÇÃO ====================

// Função para abrir modal de edição
function abrirModalEdicao(indice) {
    const produto = produtos[indice];
    if (!produto) return;
    
    produtoParaEditar = indice;
    
    // Preencher o formulário com os dados atuais
    document.getElementById('editProdNome').value = produto.nome;
    document.getElementById('editProdPreco').value = produto.preco;
    document.getElementById('editProdQtd').value = produto.estoque;
    
    // Mostrar o modal
    document.getElementById('modalEdicao').style.display = 'block';
}

// Função para fechar modal de edição
function fecharModalEdicao() {
    document.getElementById('modalEdicao').style.display = 'none';
    produtoParaEditar = null;
}

// Função para salvar a edição
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
    
    // Verificar se o novo nome já existe em outro produto
    const produtoExistente = produtos.find((p, index) => 
        p.nome.toLowerCase() === nome.toLowerCase() && index !== produtoParaEditar
    );
    
    if (produtoExistente) {
        mostrarMensagem('❌ Já existe outro produto com este nome!', 'error');
        return;
    }
    
    // Salvar o nome antigo para mensagem
    const nomeAntigo = produtos[produtoParaEditar].nome;
    
    // Atualizar o produto
    produtos[produtoParaEditar] = {
        nome: nome,
        preco: preco,
        estoque: estoque
    };
    
    // Atualizar as vendas que tinham o nome antigo
    vendas.forEach(venda => {
        if (venda.produto === nomeAntigo) {
            venda.produto = nome;
        }
    });
    
    // Atualizar as listas
    atualizarListaProdutos();
    atualizarListaVendas();
    atualizarSelectProdutos();
    
    // Fechar modal e mostrar mensagem
    fecharModalEdicao();
    mostrarMensagem(`✏️ Produto "${nomeAntigo}" foi atualizado para "${nome}" com sucesso!`, 'success');
}

// ==================== FUNÇÕES DE EXCLUSÃO ====================

// Função para abrir modal de exclusão
function abrirModalExclusao(indice, nomeProduto) {
    produtoParaExcluir = indice;
    document.getElementById('modalMensagem').innerHTML = `Tem certeza que deseja excluir o produto <strong>"${nomeProduto}"</strong>?<br><br>⚠️ <strong>ATENÇÃO:</strong> Todas as vendas relacionadas a este produto também serão excluídas!`;
    document.getElementById('modalExclusao').style.display = 'block';
}

// Função para fechar modal de exclusão
function fecharModal() {
    document.getElementById('modalExclusao').style.display = 'none';
    produtoParaExcluir = null;
}

// Função para confirmar e executar exclusão
function confirmarExclusao() {
    if (produtoParaExcluir !== null && produtoParaExcluir < produtos.length) {
        const produtoRemovido = produtos[produtoParaExcluir];
        const nomeProduto = produtoRemovido.nome;
        
        // Remover todas as vendas relacionadas a este produto
        const vendasRelacionadas = vendas.filter(v => v.produto.toLowerCase() === nomeProduto.toLowerCase());
        const qtdVendasRemovidas = vendasRelacionadas.length;
        
        vendas = vendas.filter(v => v.produto.toLowerCase() !== nomeProduto.toLowerCase());
        
        // Remover o produto
        produtos.splice(produtoParaExcluir, 1);
        
        // Atualizar as listas
        atualizarListaProdutos();
        atualizarListaVendas();
        atualizarSelectProdutos();
        
        // Mensagem de sucesso
        let msg = `✅ Produto "${nomeProduto}" excluído com sucesso!`;
        if (qtdVendasRemovidas > 0) {
            msg += ` ${qtdVendasRemovidas} venda(s) relacionada(s) também foram removidas.`;
        }
        mostrarMensagem(msg, 'warning');
    }
    fecharModal();
}

// ==================== FUNÇÕES DE VENDAS ====================

// Função para registrar venda
function registrarVenda() {
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
    if (isNaN(qtdVendida) || qtdVendida <= 0) {
        mostrarMensagem('❌ Informe uma quantidade válida!', 'error');
        return;
    }

    const produto = produtos[indice];
    
    if (qtdVendida > produto.estoque) {
        mostrarMensagem(`❌ Estoque insuficiente! Tem apenas ${produto.estoque} unidades.`, 'error');
        return;
    }

    // Registrar venda
    produto.estoque -= qtdVendida;
    const valorTotal = qtdVendida * produto.preco;
    vendas.push({
        produto: produto.nome,
        qtd: qtdVendida,
        total: valorTotal,
        data: new Date().toLocaleString()
    });

    // Limpar campo quantidade
    document.getElementById('vendaQtd').value = '';
    
    atualizarListaProdutos();
    atualizarListaVendas();
    atualizarSelectProdutos();
    
    mostrarMensagem(`✅ Venda registrada! Total: R$ ${valorTotal.toFixed(2)}`, 'success');
}

// ==================== FUNÇÕES DE ATUALIZAÇÃO DE LISTAS ====================

// Função para atualizar lista de produtos (com botões de editar e excluir)
function atualizarListaProdutos() {
    const container = document.getElementById('listaProdutos');
    
    if (produtos.length === 0) {
        container.innerHTML = '<p style="color: #718096;">Nenhum produto cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = '';
    produtos.forEach((produto, index) => {
        const div = document.createElement('div');
        div.className = 'produto-item';
        const estoqueClass = produto.estoque < 5 ? 'estoque-baixo' : '';
        
        div.innerHTML = `
            <div class="produto-info">
                <strong>${produto.nome}</strong><br>
                💰 Preço: R$ ${produto.preco.toFixed(2)}<br>
                📦 Estoque: <span class="${estoqueClass}">${produto.estoque} unidades</span>
                ${produto.estoque < 5 ? '<br>⚠️ <small>Estoque baixo!</small>' : ''}
            </div>
            <div class="produto-actions">
                <button class="btn-editar" onclick="abrirModalEdicao(${index})">✏️ Editar</button>
                <button class="btn-excluir" onclick="abrirModalExclusao(${index}, '${produto.nome.replace(/'/g, "\\'")}')">🗑️ Excluir</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Função para atualizar lista de vendas
function atualizarListaVendas() {
    const container = document.getElementById('listaVendas');
    const totalDiv = document.getElementById('totalVendas');
    
    if (vendas.length === 0) {
        container.innerHTML = '<p style="color: #718096;">Nenhuma venda registrada.</p>';
        totalDiv.style.display = 'none';
        return;
    }

    container.innerHTML = '';
    let somaTotal = 0;
    
    vendas.forEach((venda, index) => {
        const div = document.createElement('div');
        div.className = 'venda-item';
        div.innerHTML = `
            <strong>${venda.produto}</strong><br>
            🔢 Quantidade: ${venda.qtd} unidades<br>
            💵 Total: R$ ${venda.total.toFixed(2)}<br>
            <small>🕒 ${venda.data}</small>
        `;
        container.appendChild(div);
        somaTotal += venda.total;
    });
    
    totalDiv.style.display = 'block';
    totalDiv.innerHTML = `💰 TOTAL DE VENDAS: R$ ${somaTotal.toFixed(2)} 💰`;
}

// Função para limpar todos os dados
function limparTudo() {
    if (confirm('⚠️ Tem certeza que deseja limpar TODOS os produtos e vendas? Essa ação não pode ser desfeita!')) {
        produtos = [];
        vendas = [];
        atualizarListaProdutos();
        atualizarListaVendas();
        atualizarSelectProdutos();
        mostrarMensagem('🗑️ Todos os dados foram limpos!', 'success');
    }
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modalExclusao = document.getElementById('modalExclusao');
    const modalEdicao = document.getElementById('modalEdicao');
    
    if (event.target === modalExclusao) {
        fecharModal();
    }
    if (event.target === modalEdicao) {
        fecharModalEdicao();
    }
}

// Inicialização
function init() {
    atualizarListaProdutos();
    atualizarListaVendas();
    atualizarSelectProdutos();
}

init();