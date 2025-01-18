import Carrinho from "./Carrinho.js";
import Produto from "./Produto.js";
const _$ = vid => document.getElementById(vid) || document.querySelector(vid);

// const dados = [
//     { id: 1, imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike.png', marca: 'Nike', nome: 'Nike Dunk 3 Panda', preco: 299.99, descricao: "Descrição do prod" },
//     { id: 2, imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/nike2.png', marca: 'Nike', nome: 'Jaqueta Windrunner Masculina', preco: 579.99, descricao: "Descrição prod" },
//     { id: 3, imagem: 'https://nossaempresa.netlify.app/loja/assets/produtos/adidas2.png', marca: 'Adidas', nome: 'Chuteira X SpeedFlow Campo', preco: 439.99, descricao: "Descrição prod" }
// ];

const getJSON = async (caminho) => {
    try {
        const response = await fetch(caminho);
        if (!response.ok) {
            throw new Error("Erro ao carregar o arquivo JSON");
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Erro ao carregar o arquivo JSON:", error);
        return null;
    }
}
const dadosPromise = getJSON ("./dados.json")
const ArrProdutos = new Array();
const carrinho = new Carrinho(new Array());

let carrinhoStorage = localStorage.getItem('carrinho');

const init = async () => {

    await dadosPromise.then(dados => {

    
        dados.forEach(produto => {
            const produtoObject = new Produto(produto.id, produto.nome, produto.marca, produto.descricao, produto.preco, produto.imagem);
            ArrProdutos.push(produtoObject);
        });
    
    });

    

    const containerProdutos = _$('.container-produtos');
    const carrinhoDiv = _$('.lista-produtos');
    const totalCarrinho = _$('.carrinho > h2');
    const valorTotal = _$('.valor-total-carrinho');
    ArrProdutos.forEach(produto => {
        const card = criarCard(produto);
        containerProdutos.appendChild(card);
    });

    function criarCard(produto) {
        const card = document.createElement('div');
        card.className = 'card-produto col-4';
        card.dataset.id = produto.id;

        card.innerHTML = `
            <div class="produto">
                <a href='./produto.html?id=${produto.id}'><img src="${produto.imagem}"></a>
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
            carrinhoDiv.innerHTML += `
                <div class="card-carrinho">

                    <span class="produto-carrinho">${produto.nome}</span>

                    <div class="infos-carrinho">

                        <span class="quantidade-carrinho">${produto.quantidade}x</span>
                        <span class="valor-individual">R$${produto.preco}</span>
                        <span class="valor-total">R$${(produto.preco * produto.quantidade).toFixed(2)}</span>

                    </div>

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
            valorTotal.innerHTML = "";
        }


        if (carrinhoStorage == null) {
            let carrinhoStorage = carrinho;
            localStorage.setItem('carrinho',JSON.stringify(carrinhoStorage));
            console.log(JSON.parse(localStorage.getItem('carrinho')));
        }else{
            let carrinhoTemp = [...JSON.parse(carrinhoStorage.listaProdutos), ...carrinho.listaProdutos];
            localStorage.setItem('carrinho', JSON.stringify(new Carrinho(carrinhoTemp)));
            console.log(JSON.parse(localStorage.getItem('carrinho')));
        } 

    }
    console.log(carrinhoStorage)
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
 
    





