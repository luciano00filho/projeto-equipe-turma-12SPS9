import Carrinho from "./Carrinho.js";
import Produto from "./Produto.js";

const _$ = vid => document.getElementById(vid) || document.querySelector(vid);

//função para consumir o JSON
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
const dadosPromise = getJSON("./dados.json")
const ArrProdutos = new Array();

const carrinhoStorage = localStorage;
const carrinho = iniciarCarrinho();

const init = async () => {

    await dadosPromise.then(dados => {


        dados.forEach(produto => {

            const produtoNoCarrinho = carrinho.listaProdutos.find(prod => prod.id === produto.id);

            if (produtoNoCarrinho) {
                ArrProdutos.push(produtoNoCarrinho);
            } else {
                const produtoObject = new Produto(produto.id, produto.nome, produto.marca, produto.descricao, produto.preco, produto.imagem, 0);
                ArrProdutos.push(produtoObject);
            }

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

    atualizarCarrinho();

    //Impressão dos produtos no HTML
    function criarCard(produto) {
        const card = document.createElement('div');
        card.className = 'card-produto col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12';
        card.dataset.id = produto.id;

        card.innerHTML = `
            <div class="produto">
                <a href='./produtos.html?id=${produto.id}'> <img src="${produto.imagem}"> </a>
                <button class="btn-add"> <img src="assets/icon-add-to-cart.svg" alt="">Comprar</button>

                <div class="btn-controller" style="display: none;">
                    <div class="controller decrement"><img src="assets/icon-decrement-quantity.svg"></div>
                    <span class="quantidade">${produto.quantidade}</span>
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

        if (produto.quantidade > 0) {
            btnController.style.display = 'flex';
            btnAddToCart.style.display = 'none';
        }

        btnAddToCart.addEventListener('click', () => {
            btnController.style.display = 'flex';
            btnAddToCart.style.display = 'none';
            produto.incrementar();
            carrinho.addProduto(produto);
            quantidadeElement.textContent = produto.quantidade;
            atualizarStorage();
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
            atualizarStorage();
            atualizarCarrinho();
        });

        btnIncrement.addEventListener('click', () => {
            produto.incrementar();
            quantidadeElement.textContent = produto.quantidade;
            atualizarStorage();
            console.log(carrinhoStorage);
            atualizarCarrinho();
        });

        return card;
    }

    //Função que adiciona os produtos inseridos no carrinho ao menu lateral da página
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

        valorTotal.innerHTML = `
            <div class="cupom-container">
                <div>
                    <label for="inputCupomDesconto">Cupom de Desconto</label>
                    <div>
                        <input type="text" id="inputCupomDesconto" class="input-control inputCupomDesconto" placeholder='Digite o cupom'>
                        <button class="btn-cupomDesconto">Aplicar</button><br>
                    </div>
                </div>
            </div>
        `;

        const btnCupomDesconto = valorTotal.querySelector('.btn-cupomDesconto');
        btnCupomDesconto.addEventListener('click', inserirDesconto);

        totalCarrinho.textContent = `Seu carrinho (${carrinho.getQuantidadeProdutos()})`;

        const btnConfirmar = _$('.btn-confirmar');
        if (carrinho.getValorTotal() > 0) {
            if (!btnConfirmar) {
                const confirmarBtn = document.createElement('button');
                confirmarBtn.className = 'btn-confirmar';
                confirmarBtn.textContent = 'Confirmar Pedido';
                confirmarBtn.addEventListener('click', confirmarPedido);
                valorTotal.appendChild(confirmarBtn);

                const textoValorTotal = document.createElement('div');
                const spanValorTotal = document.createElement('span');
                const pValorTotal = document.createElement('p');
                textoValorTotal.appendChild(spanValorTotal);
                textoValorTotal.appendChild(pValorTotal);
                textoValorTotal.className = 'textoValorTotal';
                spanValorTotal.textContent = `Total do Pedido`;
                pValorTotal.textContent = `R$${(carrinho.getValorTotal()).toFixed(2)}`
                textoValorTotal.style = 'margin-top: 10px'
                valorTotal.appendChild(textoValorTotal);
            }
        } else if (btnConfirmar) {
            btnConfirmar.remove();
        }

        if (carrinho.getValorTotal() == 0) {
            carrinhoDiv.innerHTML = `<img src="assets/carrinho.png" class="vazio">`;
            valorTotal.innerHTML = "";
        }
    }

    // Função que aplica o desconto para os cupons BLACKFRIDAY, DIADASMÃES, CARNAVAL
    function inserirDesconto() {

        const inputCupom = document.querySelector('.inputCupomDesconto');
        const pValorTotal = document.querySelector('.textoValorTotal > p');
        let desconto = 1;
        switch (inputCupom.value) {
            case 'BLACKFRIDAY':
                desconto = 0.75;
                alert('25% de desconto!')
                break;

            case 'DIADASMÃES':
                desconto = 0.9;
                alert('10% de desconto!')
                break;

            case 'CARNAVAL':
                desconto = 0.95;
                alert('5% de desconto!')
                break;
        }

        console.log(desconto)

        pValorTotal.textContent = `R$${(carrinho.getValorTotal() * desconto).toFixed(2)}`;
    }


    function confirmarPedido() {
        //Modal foi a função utilizada para sobrepor a página principal, mostrando a tela de confirmação do pedido
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

        const modalValorTotal = document.querySelector('.textoValorTotal > p');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Pedido Confirmado</h2>
                <p>Agradecemos por comprar conosco!</p>
                ${produtosHTML}
                <h5>Valor Total do Pedido: R$ ${modalValorTotal.textContent}</h5>
                <button class="btn btn-novo-pedido">Iniciar Novo Pedido</button>
            </div>
        `;

        document.body.appendChild(modal);

        _$('.btn-novo-pedido').addEventListener('click', () => {
            document.body.classList.remove('modal-open');
            modal.remove();
            carrinho.limpar();
            atualizarStorage();
            atualizarCarrinho();
        });

        document.body.classList.add('modal-open');
    }
}

document.addEventListener('DOMContentLoaded', init);

// Função para verificar se o cliente possui um carrinho ativo
function iniciarCarrinho() {

    const valoresCarrinho = new Array();
    const valoresStorage = JSON.parse(carrinhoStorage.getItem('carrinho'));

    if (valoresStorage != null) {

        valoresStorage.forEach(obj => {

            const produtoObject = new Produto(obj.id, obj.nome, obj.marca, obj.descricao, obj.preco, obj.imagem, obj.quantidade);
            valoresCarrinho.push(produtoObject);

        });

    }

    return new Carrinho(valoresCarrinho);

}

// Associa o carrinho com o local storage
function atualizarStorage() {

    carrinhoStorage.setItem('carrinho', JSON.stringify(carrinho.listaProdutos));

}