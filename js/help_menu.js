document.addEventListener('DOMContentLoaded', function () {
    const helpButton = document.querySelector('.help_me');
    const helpMenu = document.querySelector('.help-menu');
    const helpClose = document.querySelector('.help-menu .filter-close');
    const TRANSITION_DURATION = 300; // ms — должен соответствовать CSS transition

    // Открытие меню помощи
    helpButton.addEventListener('click', function () {
        helpMenu.style.display = 'flex';
        setTimeout(() => helpMenu.classList.add('active'), 10);
    });

    // Закрытие меню помощи
    helpClose.addEventListener('click', function () {
        helpMenu.classList.remove('active');
        setTimeout(() => { helpMenu.style.display = 'none'; }, TRANSITION_DURATION);
    });
});