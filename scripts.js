document.addEventListener('DOMContentLoaded', () => {
    // Выбираем иконки в панели
    const diamondIcon = document.querySelector('.panel img[src="img/diamond.png"]');
    const peoplesIcon = document.querySelector('.panel img[src="img/peoples.png"]');
    
    // Выбираем элементы для скрытия/показа
    const h1 = document.querySelector('h1:not(.cristal h1)');
    const p = document.querySelector('p:not(.square p):not(.cristal p)');
    const squareContainer = document.querySelector('.square-container');
    const squares = document.querySelectorAll('.square');
    const cristalIcon = document.querySelector('.cristal');
    const cristalImage = document.querySelector('.cristal img');
    const cristalH1 = document.querySelector('.cristal h1');

    // Определяем начальную высоту body в зависимости от размера экрана
    let initialBodyHeight;
    if (window.matchMedia('(max-width: 568px)').matches) {
        initialBodyHeight = '320vh';
    } else if (window.matchMedia('(max-width: 736px)').matches) {
        initialBodyHeight = '120vh';
    } else {
        initialBodyHeight = '140vh';
    }

    // Debugging: Log if elements are found
    console.log('diamondIcon:', diamondIcon);
    console.log('peoplesIcon:', peoplesIcon);
    console.log('cristalImage:', cristalImage);
    console.log('cristalH1:', cristalH1);
    console.log('initialBodyHeight:', initialBodyHeight);

    if (diamondIcon) {
        diamondIcon.addEventListener('click', () => {
            console.log('Клик по Diamond');
            h1.classList.add('hidden');
            p.classList.add('hidden');
            squareContainer.classList.add('hidden');
            squares.forEach(square => square.classList.add('hidden'));
            if (cristalIcon) {
                cristalIcon.style.display = 'block';
            }
            // Уменьшаем высоту body в 2 раза
            const currentHeight = parseFloat(initialBodyHeight) / 2;
            document.body.style.height = `${currentHeight}vh`;
        });
    } else {
        console.warn('Diamond icon not found');
    }

    if (peoplesIcon) {
        peoplesIcon.addEventListener('click', () => {
            console.log('Клик по Peoples');
            h1.classList.remove('hidden');
            p.classList.remove('hidden');
            squareContainer.classList.remove('hidden');
            squares.forEach(square => square.classList.remove('hidden'));
            if (cristalIcon) {
                cristalIcon.style.display = 'none';
            }
            // Восстанавливаем исходную высоту body
            document.body.style.height = initialBodyHeight;
        });
    } else {
        console.warn('Peoples icon not found');
    }

    if (cristalImage && cristalH1) {
        cristalImage.addEventListener('click', () => {
            console.log('Клик по Crystal');
            let currentValue = parseInt(cristalH1.textContent) || 0;
            cristalH1.textContent = currentValue + 1;
        });
    } else {
        console.warn('Crystal image or h1 not found:', { cristalImage, cristalH1 });
    }
});
