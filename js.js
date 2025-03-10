document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.navbar li');
    const backBtn = document.querySelector('.back-btn');
    const sections = document.querySelectorAll('.project, .pricing, .rewards, .contact');
    const mainContent = document.querySelector('.content-container');

    // Функция показа секции
    function showSection(targetId) {
        mainContent.style.display = 'none';
        backBtn.style.display = 'block';

        sections.forEach(section => {
            section.style.display = section.id === targetId ? 'block' : 'none';
        });
    }
    
    // Функция возврата в главное меню
    function goBack() {
        mainContent.style.display = 'flex';
        backBtn.style.display = 'none';
        sections.forEach(section => section.style.display = 'none');
    }

    // Обработчики для пунктов меню
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            showSection(target);
        });
    });

    document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылки
            const target = document.getElementById(this.dataset.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Обработчик кнопки назад
    backBtn.addEventListener('click', goBack);
        // Массив фраз для анимации
    const phrases = [
        "Developer",
        "Designer",
        "Desktop developer",
        "Reliable",
        "Responsible",
        "Good guy for Sony",
        "Not involved in shit"
    ];
    
    let currentPhraseIndex = 0;
    const textElement = document.querySelector('.anim-text');
    
    // Функция для анимации набора текста
    function typeText(text, callback) {
        let index = 0;
        const speed = 222; // 3 символа в секунду
        const interval = setInterval(() => {
        if (index < text.length) {
            textElement.textContent = text.slice(0, index + 1);
            index++;
        } else {
            clearInterval(interval);
            setTimeout(callback, 1000); // Пауза перед удалением
        }
        }, speed);
    }
    
    // Функция для анимации удаления текста
    function deleteText(text, callback) {
        let index = text.length;
        const speed = 111; // 1 символ в секунду (медленное удаление)
        const interval = setInterval(() => {
        if (index >= 0) {
            textElement.textContent = text.slice(0, index);
            index--;
        } else {
            clearInterval(interval);
            setTimeout(callback, 1000); // Пауза перед следующей фразой
        }
        }, speed);
    }
    
    // Основной цикл анимации
    function startAnimation() {
        const currentPhrase = phrases[currentPhraseIndex];
        typeText(currentPhrase, () => {
        deleteText(currentPhrase, () => {
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            startAnimation(); // Запуск следующей фразы
        });
        });
    }
    
    // Запуск анимации
    startAnimation();
});