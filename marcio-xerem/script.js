const _$ = vid => document.getElementById(vid) || document.querySelector(vid);

const init = () => {
    const produtos = [
        {imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike.png', marca: 'Nike', nome: 'Nike Dunk 3 Panda', preco: 299.99},
        {imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike2.png', marca: 'Nike', nome: 'Jaqueta Windrunner Masculina', preco: 579.99},
        {imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/adidas2.png', marca: 'Adidas', nome: 'Chuteira X SpeedFlow Campo', preco: 439.99}
    ];

    const carrinho = [];
    const containerProdutos = _$('.container-produtos');
    const carrinhoDiv = _$('.lista-produtos');

    produtos.forEach(produto => {
        const card = criarCard(produto);
        containerProdutos.appendChild(card);
    });

    function criarCard(produto) {
        const card = document.createElement('div');
        card.className = 'card-produto col-4';

        card.innerHTML = `
            <div class="produto">
                <img src="${produto.imagem}">
                <button class="btn-add"> <img src="assets/icon-add-to-cart.svg" alt="">Add to cart</button>

                <button class="btn-controller" type="button">
                    <div class="controller"><img src="assets/icon-decrement-quantity.svg"></div>
                    <span class="quantidade">1</span>
                    <div class="controller"><img src="assets/icon-increment-quantity.svg"></div>
                </button>
            </div>
            <div class="infos">
                <span class="marca">${produto.marca}</span>
                <span class="nome">${produto.nome}</span>
                <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
            </div>
        `;

        card.querySelector('.btn-add').addEventListener('click', () => {
            adicionarAoCarrinho(produto);
        });

        card.querySelectorAll('.controller img').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const quantidadeElement = card.querySelector('.quantidade');
                let quantidade = parseInt(quantidadeElement.innerText);
                if (index === 0 && quantidade > 1) {
                    quantidade--;
                } else if (index === 1) {
                    quantidade++;
                }
                quantidadeElement.innerText = quantidade;
            });
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
        carrinhoDiv.innerHTML = '';
        let total = 0;

        carrinho.forEach(produto => {
            const totalItem = produto.quantidade * produto.preco;
            carrinhoDiv.innerHTML += `
                <div class="produto-carrinho">
                    <span>${produto.nome} - Quantidade: ${produto.quantidade} - Total: R$ ${totalItem.toFixed(2)}</span>
                </div>
            `;
            total += totalItem;
        });

        carrinhoDiv.innerHTML += `
            <h5>Valor Total: R$ ${total.toFixed(2)}</h5>
            <button class="btn btn-success btn-confirmar">Confirmar Pedido</button>
        `;

        const btnConfirmar = _$('.btn-confirmar');
        btnConfirmar.addEventListener('click', confirmarPedido);
    }

    function confirmarPedido() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        let total = 0; //Acumulador para o total das compras
        let produtosHTML = '';

        carrinho.forEach(produto => {
            const totalItem = produto.quantidade * produto.preco;
            produtosHTML += `
                <div class="produto-confirmacao">
                    <img src="${produto.imagem}" class="imagem-produto">
                    <div class="produto-info">
                        <span class="produto-nome">${produto.nome}</span>
                        <span class="produto-detalhes">Quantidade: ${produto.quantidade} - Preço Unitário: R$ ${produto.preco.toFixed(2)} - Total: R$ ${totalItem.toFixed(2)}</span>
                    </div>
                </div>
            `;
            total += totalItem;
        });

        modal.innerHTML = `
            <div class="modal-content">
                <h2>Order Confirmed</h2>
                <p>We hope you enjoy your food!</p>
                ${produtosHTML}
                <h5>Valor Total do Pedido: R$ ${total.toFixed(2)}</h5>
                <button class="btn btn-novo-pedido">Start New Order</button>
            </div>
        `;

        document.body.appendChild(modal);

        _$('.btn-novo-pedido').addEventListener('click', () => {
            modal.remove();
            carrinho.length = 0; // Limpar o carrinho
            atualizarCarrinho(); // Atualizar o carrinho visualmente
        });

        // Adiciona a classe para congelar o fundo
        document.body.classList.add('modal-open');
    }
};

document.addEventListener('DOMContentLoaded', init);
