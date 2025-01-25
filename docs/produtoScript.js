import Carrinho from "./Carrinho.js";
import Produto from "./Produto.js";

const pagina = new URLSearchParams(window.location.search);
const id = pagina.get('id');

const seletor = element => document.querySelector(element);

const carrinhoStorage = localStorage;
const carrinho = iniciarCarrinho();

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
const dadosPromise = getJSON("./dados.json");

async function init() {
    let qtdProduto = 0;

    const btnDecrement = seletor('.decrement');
    const btnIncrement = seletor('.increment');

    const quantidadeElement = seletor('.contador');

    // Informações do produto

    const imagensProduto = document.querySelectorAll('.detalheProduto img');
    const nomeProduto = seletor('.infos-produto > h1');
    const marcaProduto = seletor('.infos-produto > h4');
    const precoProduto = seletor('.infos-produto > span');
    const descricaoProduto = seletor('.infos-produto > p');
    const addCartIndividual = seletor('.addCart-individual');

    let produto;

    await dadosPromise.then(dados => {

        produto = dados.filter(prod => prod.id == id)[0];

        const produtoNoCarrinho = carrinho.listaProdutos.find(prod => prod.id === produto.id);

        if (produtoNoCarrinho) {
            produto = produtoNoCarrinho;
        } else {
            produto = new Produto(produto.id, produto.nome, produto.marca, produto.descricao, produto.preco, produto.imagem, 0);
        }

    })

    Array.from(imagensProduto).forEach(img => img.src = produto.imagem);

    nomeProduto.textContent = produto.nome;
    marcaProduto.textContent = produto.marca;
    descricaoProduto.textContent = produto.descricao;
    precoProduto.textContent = `R$ ${produto.preco.toFixed(2)}`;
    quantidadeElement.textContent = produto.quantidade;

    btnDecrement.addEventListener('click', () => {

        if (produto.quantidade > 0) {
            produto.quantidade--;
            quantidadeElement.textContent = produto.quantidade;

            if (produto.quantidade < 1) {
                carrinho.removerProduto(produto);
            }

            atualizarStorage();
        }

        console.log(produto.quantidade);

        if (produto.quantidade == 0) {
            addCartIndividual.classList.add('habilitado');
            addCartIndividual.classList.remove('desabilitado');
        }

    });

    btnIncrement.addEventListener('click', () => {

        const produtoNoCarrinho = carrinho.listaProdutos.find(prod => prod.id === produto.id);

        produto.quantidade++;
        quantidadeElement.textContent = produto.quantidade;
        
        if (produtoNoCarrinho == null) {
            addCartIndividual.classList.remove('desabilitado');
            addCartIndividual.classList.add('habilitado');
        }

        atualizarStorage();

    });

    addCartIndividual.addEventListener('click',function(){

        if (addCartIndividual.classList.contains('habilitado')) {

            carrinho.addProduto(produto);
            addCartIndividual.classList.remove('habilitado');
            addCartIndividual.classList.add('desabilitado')
            atualizarStorage();

        }

    });
}

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

function atualizarStorage() {

    carrinhoStorage.setItem('carrinho', JSON.stringify(carrinho.listaProdutos));

}

document.addEventListener('DOMContentLoaded', init);