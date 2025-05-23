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
    const cristalP = document.querySelector('.panel p');
    const notificationPlaque = document.querySelector('#milestone-notification');
    const milestoneImage = document.querySelector('#milestone-image');

    // Требования по кликам для каждого квадрата
    const clickRequirements = {
        1: 10,
        2: 30,
        3: 50,
        4: 100,
        5: 150,
        6: 200,
        7: 250,
        8: 300,
    };

    // Отслеживаем клики и завершенные квадраты
    let crystalClicks = 0;
    let completedSquares = new Set();
    const initialBodyHeight = document.body.style.height;

    // Обновляем проценты для всех квадратов
    function updatePercentages() {
        Object.keys(clickRequirements).forEach(index => {
            const buttonElement = document.querySelector(`#button-${index}`);
            if (buttonElement && !completedSquares.has(index)) {
                const requiredClicks = clickRequirements[index];
                const percentage = Math.min((crystalClicks / requiredClicks) * 100, 100);
                buttonElement.textContent = percentage >= 100 ? 'Получить' : `${Math.round(percentage)}%`;
    
                if (percentage >= 100) {
                    buttonElement.classList.add('claimable');
                    buttonElement.classList.remove('completed');
                    buttonElement.disabled = false;
                } else {
                    buttonElement.classList.remove('claimable');
                    buttonElement.disabled = true;
                }
            }
        });
    }

    // Показ уведомления при достижении milestone
    function showMilestoneNotification() {
        if (notificationPlaque && milestoneImage) {
            const milestoneIndex = Object.keys(clickRequirements).find(index => clickRequirements[index] === crystalClicks);
            if (milestoneIndex) {
                milestoneImage.src = `img/${milestoneIndex}rank.png`;
                notificationPlaque.classList.add('show');
                setTimeout(() => {
                    notificationPlaque.classList.remove('show');
                }, 3000); // Уведомление исчезает через 3 секунды
            }
        }
    }

    if (diamondIcon) {
        diamondIcon.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            h1.classList.add('hidden');
            p.classList.add('hidden');
            squareContainer.classList.add('hidden');
            squares.forEach(square => square.classList.add('hidden'));
            if (cristalIcon) cristalIcon.style.display = 'block';
            const currentHeight = parseFloat(initialBodyHeight) / 2;
            document.body.style.height = `${currentHeight}vh`;
        });
    }
    
    if (peoplesIcon) {
        peoplesIcon.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            h1.classList.remove('hidden');
            p.classList.remove('hidden');
            squareContainer.classList.remove('hidden');
            squares.forEach(square => square.classList.remove('hidden'));
            if (cristalIcon) cristalIcon.style.display = 'none';
            document.body.style.height = initialBodyHeight;
        });
    }

    if (cristalImage && cristalH1) {
        cristalImage.addEventListener('click', () => {
            crystalClicks++;
            cristalH1.textContent = crystalClicks;
            cristalP.textContent = crystalClicks;
            updatePercentages();
            showMilestoneNotification();
        });
    }

    Object.keys(clickRequirements).forEach(index => {
        const buttonElement = document.querySelector(`#button-${index}`);
        if (buttonElement) {
            buttonElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const requiredClicks = clickRequirements[index];
                const percentage = Math.min((crystalClicks / requiredClicks) * 100, 100);
    
                if (!completedSquares.has(index) && percentage >= 100) {
                    completedSquares.add(index);
                    buttonElement.textContent = 'Пройдено';
                    buttonElement.classList.remove('claimable');
                    buttonElement.classList.add('completed');
                    buttonElement.disabled = true;
                    console.log(`Квадрат ${index} получен`);
                }
            });
        }
    });

    // Инициализация процентов при загрузке
    updatePercentages();
});
