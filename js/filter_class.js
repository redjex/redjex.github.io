document.addEventListener('DOMContentLoaded', function () {
    const settingsButton = document.querySelector('.settings');
    const filterMenu = document.querySelector('.filter-menu');
    const filterClose = document.querySelector('.filter-menu .filter-close');
    const profileName = document.querySelector('.profile_name');
    const scheduleContainer = document.querySelector('.schedule-container');
    const scheduleClass = document.querySelector('.schedule-class'); // Новый элемент для класса

    const TRANSITION_DURATION = 300; // ms — должен соответствовать CSS transition

    // Список классов
    const classes = ['5А', '5Б', '6А', '6Б', '7А', '7Б', '8А', '8Б', '9А', '9Б', '9В', '10А', '11А'];

    // Примерные расписания для каждого класса
    const schedules = {
        '5А': [
            { subject: 'Математика', time: '08:30 - 09:15' },
            { subject: 'Русский язык', time: '09:25 - 10:10' },
            { subject: 'Литература', time: '10:20 - 11:05' },
            { subject: 'Физкультура', time: '11:15 - 12:00' }
        ],
        '5Б': [
            { subject: 'Русский язык', time: '08:30 - 09:15' },
            { subject: 'Математика', time: '09:25 - 10:10' },
            { subject: 'История', time: '10:20 - 11:05' },
            { subject: 'Физкультура', time: '11:15 - 12:00' }
        ],
        '6А': [
            { subject: 'Математика', time: '08:30 - 09:15' },
            { subject: 'Физика', time: '09:25 - 10:10' },
            { subject: 'Русский язык', time: '10:20 - 11:05' },
            { subject: 'География', time: '11:15 - 12:00' }
        ],
        '6Б': [
            { subject: 'Физика', time: '08:30 - 09:15' },
            { subject: 'Математика', time: '09:25 - 10:10' },
            { subject: 'География', time: '10:20 - 11:05' },
            { subject: 'Русский язык', time: '11:15 - 12:00' }
        ],
        '7А': [
            { subject: 'Алгебра', time: '08:30 - 09:15' },
            { subject: 'Физика', time: '09:25 - 10:10' },
            { subject: 'Химия', time: '10:20 - 11:05' },
            { subject: 'История', time: '11:15 - 12:00' }
        ],
        '7Б': [
            { subject: 'Химия', time: '08:30 - 09:15' },
            { subject: 'Алгебра', time: '09:25 - 10:10' },
            { subject: 'Физика', time: '10:20 - 11:05' },
            { subject: 'История', time: '11:15 - 12:00' }
        ],
        '8А': [
            { subject: 'Алгебра', time: '08:30 - 09:15' },
            { subject: 'Геометрия', time: '09:25 - 10:10' },
            { subject: 'Химия', time: '10:20 - 11:05' },
            { subject: 'Биология', time: '11:15 - 12:00' }
        ],
        '8Б': [
            { subject: 'Геометрия', time: '08:30 - 09:15' },
            { subject: 'Алгебра', time: '09:25 - 10:10' },
            { subject: 'Биология', time: '10:20 - 11:05' },
            { subject: 'Химия', time: '11:15 - 12:00' }
        ],
        '9А': [
            { subject: 'Алгебра', time: '08:30 - 09:15' },
            { subject: 'Физика', time: '09:25 - 10:10' },
            { subject: 'Химия', time: '10:20 - 11:05' },
            { subject: 'Обществознание', time: '11:15 - 12:00' }
        ],
        '9Б': [
            { subject: 'Физика', time: '08:30 - 09:15' },
            { subject: 'Алгебра', time: '09:25 - 10:10' },
            { subject: 'Обществознание', time: '10:20 - 11:05' },
            { subject: 'Химия', time: '11:15 - 12:00' }
        ],
        '9В': [
            { subject: 'Химия', time: '08:30 - 09:15' },
            { subject: 'Физика', time: '09:25 - 10:10' },
            { subject: 'Алгебра', time: '10:20 - 11:05' },
            { subject: 'Обществознание', time: '11:15 - 12:00' }
        ],
        '10А': [
            { subject: 'Алгебра', time: '08:30 - 09:15' },
            { subject: 'Геометрия', time: '09:25 - 10:10' },
            { subject: 'Физика', time: '10:20 - 11:05' },
            { subject: 'Химия', time: '11:15 - 12:00' }
        ],
        '11А': [
            { subject: 'Физика', time: '08:30 - 09:15' },
            { subject: 'Алгебра', time: '09:25 - 10:10' },
            { subject: 'Геометрия', time: '10:20 - 11:05' },
            { subject: 'Обществознание', time: '11:15 - 12:00' }
        ]
    };

    // Функция для генерации кнопок классов
    function generateClassButtons() {
        const buttonsContainer = document.querySelector('.filter-menu .filter-buttons-container');
        buttonsContainer.innerHTML = ''; // Очищаем контейнер
        classes.forEach(className => {
            const button = document.createElement('button');
            button.classList.add('filter-option');
            button.setAttribute('data-class', className);
            button.textContent = className;
            buttonsContainer.appendChild(button);
        });
    }

    // Функция для обновления расписания и класса в заголовке
    function updateSchedule(selectedClass) {
        scheduleContainer.innerHTML = ''; // Очищаем контейнер
        if (!selectedClass || !schedules[selectedClass]) {
            scheduleContainer.innerHTML = '<div class="no-class-message">Выберите свой класс в меню 3 — настройки — класс</div>';
            scheduleClass.textContent = ''; // Очищаем класс, если не выбран
        } else {
            schedules[selectedClass].forEach(item => {
                const row = document.createElement('div');
                row.classList.add('schedule-row');
                row.innerHTML = `
                    <div class="schedule-subject">${item.subject}</div>
                    <div class="schedule-time">${item.time}</div>
                `;
                scheduleContainer.appendChild(row);
            });
            scheduleClass.textContent = `, ${selectedClass}`; // Обновляем класс в заголовке
        }
    }

    // Инициализация
    generateClassButtons();
    const savedClass = localStorage.getItem('selectedClass');
    if (savedClass) {
        profileName.textContent = `Иван Иванов, ${savedClass}`;
        updateSchedule(savedClass);
    } else {
        updateSchedule(null);
    }

    // Открытие/закрытие меню настроек
    settingsButton.addEventListener('click', function () {
        filterMenu.style.display = 'flex';
        setTimeout(() => filterMenu.classList.add('active'), 10);
    });

    filterClose.addEventListener('click', function () {
        filterMenu.classList.remove('active');
        setTimeout(() => { filterMenu.style.display = 'none'; }, TRANSITION_DURATION);
    });

    // Обработка выбора класса
    document.querySelectorAll('.filter-menu .filter-option').forEach(option => {
        option.addEventListener('click', function () {
            const selectedClass = this.getAttribute('data-class');
            const scrollPosition = window.scrollY;

            // Сохраняем класс и обновляем данные
            localStorage.setItem('selectedClass', selectedClass);
            profileName.textContent = `Иван Иванов, ${selectedClass}`;
            updateSchedule(selectedClass);

            // Закрываем меню
            filterMenu.classList.remove('active');
            setTimeout(() => {
                filterMenu.style.display = 'none';
                window.scrollTo(0, scrollPosition);
            }, TRANSITION_DURATION);
        });
    });
});