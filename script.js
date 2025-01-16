const init = () => {
    const produtos = [
        { imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike.png', marca: 'Nike', nome: 'Nike Dunk 3 Panda', preco: 299.99 },
        { imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike2.png', marca: 'Nike', nome: 'Jaqueta Windrunner Masculina', preco: 579.99 },
        { imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/adidas2.png', marca: 'Adidas', nome: 'Chuteira X SpeedFlow Campo', preco: 439.99 }
    ];

    const carrinho = [];
    const containerProdutos = document.querySelector('.container-produtos');
    const carrinhoDiv = document.querySelector('.lista-produtos');

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

                <div class="btn-controller" style="display: none;">
                    <div class="controller decrement"><img src="assets/icon-decrement-quantity.svg"></div>
                    <span class="quantidade">1</span>
                    <div class="controller increment"><img src="assets/icon-increment-quantity.svg"></div>
                </div>
            </div>
            <div class="infos">
                <span class="marca">${produto.marca}</span>
                <span class="nome">${produto.nome}</span>
                <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
            </div>
        `;

        const btnAddToCart = card.querySelector('.btn-add');
        const btnController = card.querySelector('.btn-controller');
        const quantidadeElement = card.querySelector('.quantidade');
        const btnDecrement = card.querySelector('.decrement');
        const btnIncrement = card.querySelector('.increment');

        let quantidade = parseInt(quantidadeElement.innerText);

        btnAddToCart.addEventListener('click', () => {
            btnController.style.display = 'flex';
            btnAddToCart.style.display = 'none';
            quantidade = 1; 
            quantidadeElement.textContent = quantidade;
            adicionarAoCarrinho(produto);
        });

        btnDecrement.addEventListener('click', () => {
            if (quantidade > 1) {
                quantidade--;
                quantidadeElement.textContent = quantidade;
                atualizarCarrinhoProduto(produto, quantidade);
            }
        });

        btnIncrement.addEventListener('click', () => {
            quantidade++;
            quantidadeElement.textContent = quantidade;
            atualizarCarrinhoProduto(produto, quantidade);
        });

        return card;
    }

    function adicionarAoCarrinho(produto) {
        const item = carrinho.find(item => item.nome === produto.nome);
        if (!item) {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        atualizarCarrinho();
    }

    function atualizarCarrinhoProduto(produto, quantidade) {
        const item = carrinho.find(item => item.nome === produto.nome);
        if (item) {
            item.quantidade = quantidade;
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

        carrinhoDiv.innerHTML += `<h5>Valor Total: R$ ${total.toFixed(2)}</h5>`;
    }
};

document.addEventListener('DOMContentLoaded', init);
