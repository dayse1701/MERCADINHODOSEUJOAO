//Bug identificado:
//- Produtos com apóstrofo (ex: 'João', 'Pão') quebravam o JavaScript
//- Erro: Uncaught SyntaxError: Unexpected identifier

//Solução técnica:
//- Uso de replace(/'/g, "\\'") para escapar aspas simples
//- Prevenção de injeção de código no onclick
//- Agora nomes como 'Dona Maria', 'Pão Francês' funcionam corretamente

//Antes: onclick='abrirModalExclusao(${index}, '${produto.nome}')'
//Depois: onclick='abrirModalExclusao(${index}, '${produto.nome.replace(/'/g, "\\'")}')'"
// COM tratamento de caracteres especiais
function atualizarListaProdutos() {
    produtos.forEach((produto, index) => {
        // CORREÇÃO BUG #6: Escapar caracteres especiais
        const nomeEscapado = produto.nome.replace(/'/g, "\\'");
        // "João's Pão" vira "João\'s Pão" - não quebra mais!
        
        div.innerHTML = `
            <button onclick="abrirModalExclusao(${index}, '${nomeEscapado}')">
                🗑️ Excluir
            </button>
        `;
        // Agora funciona: onclick="abrirModalExclusao(0, 'João\'s Pão')" ✅
    });
}