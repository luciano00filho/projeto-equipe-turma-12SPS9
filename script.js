document.addEventListener('DOMContentLoaded',function(){

    const addToCard = document.querySelectorAll('.btn-add');
    const btnController = document.querySelectorAll('.btn-controller');

    addToCard.forEach((btn, index) => { 

        btn.addEventListener('click', function() {
            btnController[index].style.display = 'flex';
            btn.style.display = 'none';
        });

    });

});