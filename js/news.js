document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'img/news/1.png',
        'img/news/2.png',
        'img/news/3.png'
    ];
    const newsImage = document.querySelector('.news-image');
    const dotsContainer = document.querySelector('.dots-container');
    let currentIndex = 1; // Начальная активная точка (вторая по счёту)
    let intervalId = null;

    // Функция для создания точек
    function createDots() {
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                clearInterval(intervalId); // Останавливаем автоматическое переключение
                currentIndex = index;
                updateImageAndDots();
                startAutoCycle(); // Перезапускаем автоматическое переключение
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Функция для обновления изображения и точек
    function updateImageAndDots() {
        newsImage.src = images[currentIndex];
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Функция для автоматического переключения
    function startAutoCycle() {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImageAndDots();
        }, 10000);
    }

    // Инициализация
    createDots();
    updateImageAndDots();
    startAutoCycle();
});
