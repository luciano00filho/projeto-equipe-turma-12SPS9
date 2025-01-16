const _$ = vid => document.getElementById(vid) || document.querySelector(vid);

const init = () => {
    const produtos = [
        {imagem: './assets/images/tenis1.jpg', nome: 'Produto 1', descricao: 'Descrição do Produto 1', preco: 150.00},
        {imagem: './assets/images/tenis2.jpg', nome: 'Produto 2', descricao: 'Descrição do Produto 2', preco: 200.00},
        {imagem: './assets/images/roupa1.jpeg', nome: 'Produto 3', descricao: 'Descrição do Produto 3', preco: 250.00},
        {imagem: './assets/images/roupa2.png', nome: 'Produto 4', descricao: 'Descrição do Produto 4', preco: 250.00},
        {imagem: './assets/images/roupa3.png', nome: 'Produto 5', descricao: 'Descrição do Produto 5', preco: 90.00},
        {imagem: './assets/images/tenis3.png', nome: 'Produto 6', descricao: 'Descrição do Produto 6', preco: 230.00}
    ];

    const carrinho = [];

    produtos.forEach((produto, index) => {
        const card = criarCard(produto);
        const coluna = _$(`coluna${(index % 3) + 1}`);
        coluna.appendChild(card);
    });

    function criarCard(produto) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
            <div class="card-body">
                <h5 class="card-title">${produto.nome}</h5>
                <p class="card-text">${produto.descricao}</p>
                <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
                <button class="btn btn-primary">Adicionar ao Carrinho</button>
            </div>
        `;

        card.querySelector('button').addEventListener('click', () => {
            adicionarAoCarrinho(produto);
        });

        return card;
    }

    function adicionarAoCarrinho(produto) {
        const item = carrinho.find(item => item.nome === produto.nome);
        if (item) {
            item.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        atualizarCarrinho();
    }

    function atualizarCarrinho() {
        const carrinhoDiv = _$('carrinho');
        carrinhoDiv.innerHTML = '<h4>Carrinho de Compras</h4>';
        let total = 0;

        carrinho.forEach(produto => {
            const totalItem = produto.quantidade * produto.preco;
            carrinhoDiv.innerHTML += `
                <p>${produto.descricao} - Quantidade: ${produto.quantidade} - Valor Unitário: R$ ${produto.preco.toFixed(2)} - Total: R$ ${totalItem.toFixed(2)}</p>
            `;
            total += totalItem;
        });

        carrinhoDiv.innerHTML += `<h5>Valor Total: R$ ${total.toFixed(2)}</h5>`;
    }
};

document.addEventListener('DOMContentLoaded', init);
