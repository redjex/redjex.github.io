document.addEventListener('DOMContentLoaded', function () {
    const showMoreButton = document.querySelector('.show-more');
    const filterButton = document.querySelector('.filter-button');
    const gradesFilterMenu = document.querySelector('.grades-filter-menu');
    const filterClose = document.querySelector('.grades-filter-menu .filter-close');
    const filterOptions = document.querySelectorAll('.grades-filter-menu .filter-option');
    const cardsContainer = document.querySelector('.cards-container');
    const buttonContainer = document.querySelector('.button-container');
    const controlPanel = document.querySelector('.control-panel');

    const TRANSITION_DURATION = 300; // ms — должен соответствовать CSS transition
    const MOBILE_SHOW_COUNT = 3;

    function isMobile() { return window.innerWidth <= 600; }

    function adjustButtonContainerMargin() {
        const controlPanelHeight = controlPanel.getBoundingClientRect().height;
        const isExpanded = showMoreButton.classList.contains('expanded');
        buttonContainer.style.marginBottom = isExpanded ? `${controlPanelHeight - 20}px` : '30px';
    }

    // Анимированное скрытие
    function hideCardAnimated(card) {
        if (card.classList.contains('hidden')) return;
        card.classList.add('revealing');
        setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
            card.classList.remove('revealing');
        }, TRANSITION_DURATION);
    }

    // Анимированное появление
    function showCardAnimated(card) {
        if (!card.classList.contains('hidden')) return;
        card.style.display = 'block';
        card.classList.remove('hidden');
        card.classList.add('revealing');
        requestAnimationFrame(() => {
            card.classList.remove('revealing');
        });
    }

    // Инициализация карточек
    function updateHiddenStateCollapsed() {
        const cards = Array.from(cardsContainer.querySelectorAll('.card'));
        if (isMobile()) {
            cards.forEach((card, idx) => {
                if (idx >= MOBILE_SHOW_COUNT) hideCardAnimated(card);
                else showCardAnimated(card);
            });
        } else {
            cards.forEach(card => showCardAnimated(card));
        }
        adjustButtonContainerMargin();
    }

    // Инициализация скрытых карточек
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
            const cards = Array.from(cardsContainer.querySelectorAll('.card'));
            cards.forEach(card => showCardAnimated(card));
            buttonContainer.classList.remove('pushed-down');
        } else {
            updateHiddenStateCollapsed();
            buttonContainer.classList.remove('pushed-down');
        }
    });

    // Открытие/закрытие меню фильтров
    filterButton.addEventListener('click', function () {
        gradesFilterMenu.style.display = 'flex';
        setTimeout(() => gradesFilterMenu.classList.add('active'), 10);
    });

    filterClose.addEventListener('click', function () {
        gradesFilterMenu.classList.remove('active');
        setTimeout(() => { gradesFilterMenu.style.display = 'none'; }, TRANSITION_DURATION);
    });

    // Обработка сортировки/фильтров
    filterOptions.forEach(option => {
        option.addEventListener('click', function () {
            const scrollPosition = window.scrollY;
            const sortType = this.getAttribute('data-sort');
            const cards = Array.from(document.querySelectorAll('.card'));

            cards.sort((a, b) => {
                const aMatch = a.querySelector('.card-image').src.match(/(\d+)\.png$/);
                const bMatch = b.querySelector('.card-image').src.match(/(\d+)\.png$/);
                const aGrade = aMatch ? parseInt(aMatch[1]) : 0;
                const bGrade = bMatch ? parseInt(bMatch[1]) : 0;
                return sortType === 'best' ? bGrade - aGrade : aGrade - bGrade;
            });

            cardsContainer.innerHTML = '';
            cards.forEach(card => cardsContainer.appendChild(card));

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

            adjustButtonContainerMargin();
            gradesFilterMenu.classList.remove('active');
            setTimeout(() => {
                gradesFilterMenu.style.display = 'none';
                window.scrollTo(0, scrollPosition);
            }, TRANSITION_DURATION);
        });
    });
});