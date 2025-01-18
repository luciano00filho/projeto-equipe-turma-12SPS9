import Carrinho from "./Carrinho.js";
import Produto from "./Produto.js";

const _$ = vid => document.getElementById(vid) || document.querySelector(vid);

const dados = [
    { id: 1, imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike.png', marca: 'Nike', nome: 'Nike Dunk 3 Panda', preco: 299.99, descricao: "Descrição do prod" },
    { id: 2, imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike2.png', marca: 'Nike', nome: 'Jaqueta Windrunner Masculina', preco: 579.99, descricao: "Descrição prod" },
    { id: 3, imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/adidas2.png', marca: 'Adidas', nome: 'Chuteira X SpeedFlow Campo', preco: 439.99, descricao: "Descrição prod" }
];

const produtos = new Array();

dados.forEach(produto => {
    const produtoObject = new Produto(produto.id, produto.nome, produto.marca, produto.descricao, produto.preco, produto.imagem);
    produtos.push(produtoObject);
});
console.log(produtos);
const carrinho = new Carrinho();

const init = () => {
    const containerProdutos = _$('.container-produtos');
    const carrinhoDiv = _$('.lista-produtos');
    const totalCarrinho = _$('.carrinho > h2');
    const valorTotal = _$('.valor-total-carrinho');
    
    produtos.forEach(produto => {
        const card = criarCard(produto);
        containerProdutos.appendChild(card);
    });

    function criarCard(produto) {
        const card = document.createElement('div');
        card.className = 'card-produto col-4';
        card.dataset.id = produto.id;

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

        btnAddToCart.addEventListener('click', () => {
            btnController.style.display = 'flex';
            btnAddToCart.style.display = 'none';
            carrinho.addProduto(produto);
            quantidadeElement.textContent = produto.quantidade;
            atualizarCarrinho();
        });

        btnDecrement.addEventListener('click', () => {
            produto.decrementar();
            if (produto.quantidade > 0) {
                quantidadeElement.textContent = produto.quantidade;
            } else {
                btnController.style.display = 'none';
                btnAddToCart.style.display = 'flex';
                carrinho.removerProduto(produto);
            }
            atualizarCarrinho();
        });

        btnIncrement.addEventListener('click', () => {
            produto.incrementar();
            quantidadeElement.textContent = produto.quantidade;
            atualizarCarrinho();
        });

        return card;
    }

    function atualizarCarrinho() {
        carrinhoDiv.innerHTML = '';

        carrinho.listaProdutos.forEach(produto => {
            const totalItem = produto.quantidade * produto.preco;
            carrinhoDiv.innerHTML += `
                <div class="produto-carrinho">
                    <span>${produto.nome} - Quantidade: ${produto.quantidade} - Total: R$ ${totalItem.toFixed(2)}</span>
                </div>
            `;
        });

        valorTotal.innerHTML = `<h5>Valor Total: R$ ${carrinho.getValorTotal().toFixed(2)}</h5>`;

        totalCarrinho.textContent = `Your Cart (${carrinho.getQuantidadeProdutos()})`;

        const btnConfirmar = _$('.btn-confirmar');
        if (carrinho.getValorTotal() > 0) {
            if (!btnConfirmar) {
                const confirmarBtn = document.createElement('button');
                confirmarBtn.className = 'btn btn-success btn-confirmar';
                confirmarBtn.textContent = 'Confirmar Pedido';
                confirmarBtn.addEventListener('click', confirmarPedido);
                carrinhoDiv.appendChild(confirmarBtn);
            }
        } else if (btnConfirmar) {
            btnConfirmar.remove();
        }
        
        if (carrinho.getValorTotal() == 0) {
            carrinhoDiv.innerHTML = `<img src="assets/carrinho.png" class="vazio">`;
        }
    }

    function confirmarPedido() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        let total = 0;
        let produtosHTML = '';

        carrinho.listaProdutos.forEach(produto => {
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
                <h2>Pedido Confirmado</h2>
                <p>Agradecemos por comprar conosco!</p>
                ${produtosHTML}
                <h5>Valor Total do Pedido: R$ ${total.toFixed(2)}</h5>
                <button class="btn btn-novo-pedido">Iniciar Novo Pedido</button>
            </div>
        `;

        document.body.appendChild(modal);

        _$('.btn-novo-pedido').addEventListener('click', () => {
            modal.remove();
            carrinho.limpar();
            atualizarCarrinho();
        });

        document.body.classList.add('modal-open');
    }
};

document.addEventListener('DOMContentLoaded', init);