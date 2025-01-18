import Produto from "./Produto.js";

export default class Carrinho {

    listaProdutos;

    constructor(vetor) {
        this.listaProdutos = vetor;
    }

    addProduto(produto) {
        this.listaProdutos.push(produto);
        produto.incrementar();
    }

    removerProduto(produto) {
        this.listaProdutos.splice(this.listaProdutos.indexOf(produto), 1);
    }

    getQuantidadeProdutos() {
        return this.listaProdutos.reduce((total, produto) => total + produto.quantidade, 0);
    }

    getValorTotal() {
        return this.listaProdutos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
    }

    limpar() {
        this.listaProdutos.forEach(produto => produto.resetQuantidadeExibida()); // Zerar as quantidades dos produtos e atualizar o DOM
        this.listaProdutos = [];
    }
}