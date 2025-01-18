import Carrinho from "./Carrinho.js";
import Produto from "./Produto.js";
const pagina = new URLSearchParams(window.location.search);
const id = pagina.get('id');
document.addEventListener('DOMContentLoaded', function () {
    const getCarrinho = new Carrinho(JSON.parse(localStorage.getItem('carrinho')))
    console.log(getCarrinho)
    fetch('dados.json')
        .then(response => response.json())
        .then(dados => {
            let produto = dados.filter(produto => produto.id == id)[0];
            produto = new Produto(produto.id, produto.nome, produto.marca, produto.descricao, produto.preco, produto.imagem);
            const tela = document.querySelector('.produto');
            tela.innerHTML = `${produto.nome} <br> <button> add to cart </button>`;
            const btnAdd = document.querySelector('button');
            btnAdd.addEventListener('click', function () {
                getCarrinho.addProduto(produto);
            })

        });
});