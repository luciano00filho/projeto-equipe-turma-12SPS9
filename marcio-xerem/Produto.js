export default class Produto {

    id;
    nome;
    marca;
    descricao;
    preco;
    imagem;
    quantidade;

    constructor(id, nome, marca, descricao, preco, imagem) {
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.descricao = descricao;
        this.preco = preco;
        this.imagem = imagem;
        this.quantidade = 0;
    }

    incrementar() {
        this.quantidade++;
    }

    decrementar() {
        this.quantidade--;
    }

    resetQuantidadeExibida() {
        this.quantidade = 0;
        const card = document.querySelector(`.card-produto[data-id='${this.id}']`);
        if (card) {
            const quantidadeElement = card.querySelector('.quantidade');
            const btnController = card.querySelector('.btn-controller');
            const btnAddToCart = card.querySelector('.btn-add');
            quantidadeElement.textContent = 1;
            btnController.style.display = 'none';
            btnAddToCart.style.display = 'flex';
        }
    }
}