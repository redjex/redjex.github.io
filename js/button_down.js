document.addEventListener('DOMContentLoaded', function () {
    const showMoreButton = document.querySelector('.show-more');
    const filterButton = document.querySelector('.filter-button');
    const filterMenu = document.querySelector('.filter-menu');
    const filterClose = document.querySelector('.filter-close');
    const filterOptions = document.querySelectorAll('.filter-option');
    const cardsContainer = document.querySelector('.cards-container');
    const buttonContainer = document.querySelector('.button-container');
    const controlPanel = document.querySelector('.control-panel');

    const TRANSITION_DURATION = 100; // ms — должен соответствовать CSS transition
    const MOBILE_SHOW_COUNT = 3;

    function isMobile() { return window.innerWidth <= 600; }

    function adjustButtonContainerMargin() {
        const controlPanelHeight = controlPanel.getBoundingClientRect().height;
        const isExpanded = showMoreButton.classList.contains('expanded');
        // Use 110px as default to match CSS, adjust only when expanded
        buttonContainer.style.marginBottom = isExpanded ? `${controlPanelHeight - 30}px` : '50px'; // Increase margin slightly when expanded
    }

    // Анимированное скрытие (после анимации ставим display:none)
    function hideCardAnimated(card) {
        if (card.classList.contains('hidden')) return;
        // Запускаем анимацию скрытия через вспомогательный класс
        card.classList.add('revealing');
        setTimeout(() => {
            // После анимации прячем из layout
            card.classList.add('hidden');
            card.style.display = 'none';
            card.classList.remove('revealing');
        }, TRANSITION_DURATION);
    }

    // Анимированное появление (сначала display:block, затем плавно убираем revealing)
    function showCardAnimated(card) {
        if (!card.classList.contains('hidden')) return;
        card.style.display = 'block';        // элемент должен занять место в layout
        card.classList.remove('hidden');     // пометка, что он видимая карточка
        card.classList.add('revealing');     // начальное состояние для анимации
        requestAnimationFrame(() => {
            card.classList.remove('revealing'); // переход к видимому состоянию
        });
    }

    // Приведём состояние карточек в свернутое (первые MOBILE_SHOW_COUNT видны, остальные скрыты на мобильных)
    function updateHiddenStateCollapsed() {
        const cards = Array.from(cardsContainer.querySelectorAll('.card'));
        if (isMobile()) {
            cards.forEach((card, idx) => {
                if (idx >= MOBILE_SHOW_COUNT) hideCardAnimated(card);
                else showCardAnimated(card);
            });
        } else {
            // На десктопе показываем все
            cards.forEach(card => showCardAnimated(card));
        }
        adjustButtonContainerMargin();
    }

    // Инициализация: скрываем те карточки, которые в разметке помечены как hidden
    (function initHidden() {
        const cards = Array.from(cardsContainer.querySelectorAll('.card'));
        cards.forEach(card => {
            if (card.classList.contains('hidden')) {
                card.style.display = 'none';
            }
        });
        updateHiddenStateCollapsed();
    })();

    // Логика кнопки "Узнать больше"
    showMoreButton.addEventListener('click', function () {
        const expanded = this.classList.toggle('expanded');
        if (expanded) {
            // Показать все карточки
            const cards = Array.from(cardsContainer.querySelectorAll('.card'));
            cards.forEach(card => showCardAnimated(card));
            buttonContainer.classList.remove('pushed-down'); // Remove pushed-down class
        } else {
            // Вернуться в свернутое состояние
            updateHiddenStateCollapsed();
            buttonContainer.classList.remove('pushed-down'); // Remove pushed-down class
        }
    });

    // Открытие/закрытие меню фильтров
    filterButton.addEventListener('click', function () {
        filterMenu.style.display = 'flex';
        setTimeout(() => filterMenu.classList.add('active'), 10);
    });
    filterClose.addEventListener('click', function () {
        filterMenu.classList.remove('active');
        setTimeout(() => { filterMenu.style.display = 'none'; }, 300);
    });

    // Обработка сортировки/фильтров
    filterOptions.forEach(option => {
        option.addEventListener('click', function () {
            const scrollPosition = window.scrollY; // Save current scroll position
            const sortType = this.getAttribute('data-sort');
            const cards = Array.from(document.querySelectorAll('.card'));

            // Сортируем по цифре в имени картинки (например rus5.png -> 5)
            cards.sort((a, b) => {
                const aMatch = a.querySelector('.card-image').src.match(/(\d+)\.png$/);
                const bMatch = b.querySelector('.card-image').src.match(/(\d+)\.png$/);
                const aGrade = aMatch ? parseInt(aMatch[1]) : 0;
                const bGrade = bMatch ? parseInt(bMatch[1]) : 0;
                return sortType === 'best' ? bGrade - aGrade : aGrade - bGrade;
            });

            // Перенаполняем контейнер в новом порядке
            cardsContainer.innerHTML = '';
            cards.forEach(card => cardsContainer.appendChild(card));

            // Применяем видимость в зависимости от состояния кнопки "Узнать больше"
            const isExpanded = showMoreButton.classList.contains('expanded');
            const newCards = Array.from(cardsContainer.querySelectorAll('.card'));
            if (isExpanded) {
                newCards.forEach(card => showCardAnimated(card));
            } else {
                if (isMobile()) {
                    newCards.forEach((card, idx) => {
                        if (idx >= MOBILE_SHOW_COUNT) hideCardAnimated(card);
                        else showCardAnimated(card);
                    });
                } else {
                    newCards.forEach(card => showCardAnimated(card));
                }
            }

            // Adjust margin and restore scroll position
            adjustButtonContainerMargin();
            // Закрываем меню фильтров
            filterMenu.classList.remove('active');
            setTimeout(() => {
                filterMenu.style.display = 'none';
                window.scrollTo(0, scrollPosition); // Restore scroll position
            }, 300);
        });
    });
});