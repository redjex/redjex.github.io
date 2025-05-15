const slider = document.getElementById('myRange');
const totalDisplay = document.getElementById('total');
const doneDisplay = document.getElementById('done');
const circle1 = document.getElementById('circle1');
const circle2 = document.getElementById('circle2');

// Определяем все предметы
const items = [
    { id: 'item1', name: 'Glock-18', price: 500, image: 'img/Glock.webp', backgroundColor: '#4B69FF' },
    { id: 'item2', name: 'M4A1-S', price: 1488, image: 'img/M4A1-S.webp', backgroundColor: '#8847FF' },
    { id: 'item3', name: 'Nova', price: 1501, image: 'img/Nova.webp', backgroundColor: '#4B69FF' },
    { id: 'item4', name: 'SSG 08', price: 3400, image: 'img/SSG.webp', backgroundColor: '#8847FF' },
    { id: 'item5', name: 'AK-47', price: 1200, image: 'img/AK.webp', backgroundColor: '#ff595a' },
    { id: 'item6', name: 'AWP', price: 1600, image: 'img/AWP.webp', backgroundColor: '#ff595a' },
    { id: 'item7', name: 'Bayonet', price: 3600, image: 'img/Bayonet.webp', backgroundColor: '#ff595a' },
    { id: 'item8', name: 'USP-S', price: 1800, image: 'img/USP.webp', backgroundColor: '#ff595a' }
];

let selectedItemPrice = 0;
let sliderValue = 0;
let selectedItem = null; // Храним выбранный скин

// Устанавливаем белый фон для circle1 и circle2 изначально
circle1.style.background = '#ffffff';
circle2.style.background = '#ffffff';

// Создаем новые элементы .item для новых скинов
items.forEach(item => {
    if (document.getElementById(item.id)) {
        const button = document.getElementById(item.id).querySelector('button');
        if (button) {
            button.addEventListener('click', () => {
                selectedItemPrice = item.price;
                selectedItem = item; // Сохраняем выбранный скин
                circle1.style.background = `${item.backgroundColor} url(${item.image}) no-repeat center/80%`;
                updateTotal();
            });
        }
    } else {
        // Создаем новый .item только для новых скинов (item5-item8) и скрываем их
        if (parseInt(item.id.replace('item', '')) > 4) {
            const newItem = document.createElement('div');
            newItem.id = item.id;
            newItem.className = 'item';
            newItem.style.display = 'none'; // Скрываем элемент
            newItem.innerHTML = `
                <h1>${item.name}</h1>
                <p>${item.name} (Price: ${item.price})</p>
                <button>Добавить</button>
            `;
            document.getElementById('panel').appendChild(newItem);
            newItem.querySelector('button').addEventListener('click', () => {
                selectedItemPrice = item.price;
                selectedItem = item; // Сохраняем выбранный скин
                circle1.style.background = `${item.backgroundColor} url(${item.image}) no-repeat center/80%`;
                updateTotal();
            });
        }
    }
});
// Функция обновления total и выбора скина
function updateTotal() {
    const total = selectedItemPrice + sliderValue;
    totalDisplay.textContent = Math.ceil(total);
    const doneValue = Math.ceil(total * 0.85);
    doneDisplay.textContent = doneValue;

    // Обновляем circle1 только если выбран скин
    if (selectedItem) {
        circle1.style.background = `${selectedItem.backgroundColor} url(${selectedItem.image}) no-repeat center/80%`;
    } else {
        circle1.style.background = '#ffffff'; // Белый фон, если скин не выбран
    }

    // Обновляем circle2 в зависимости от doneValue
    if (doneValue < 1200) {
        circle2.style.background = '#ffffff'; // Пустой, если done < 1200
    } else {
        const sortedItems = [...items].sort((a, b) => a.price - b.price);
        let selectedCircle2Item = null;
        for (let i = 0; i < sortedItems.length; i++) {
            // Начинаем с AK-47 (price: 1200)
            if (sortedItems[i].price >= 1200 && doneValue >= sortedItems[i].price) {
                selectedCircle2Item = sortedItems[i];
            } else if (doneValue < sortedItems[i].price) {
                break;
            }
        }
        if (selectedCircle2Item) {
            circle2.style.background = `${selectedCircle2Item.backgroundColor} url(${selectedCircle2Item.image}) no-repeat center/80%`;
        } else {
            circle2.style.background = '#ffffff'; // Пустой, если нет подходящего скина
        }
    }
}

// Обработчик слайдера
slider.addEventListener('input', () => {
    sliderValue = parseInt(slider.value);
    updateTotal();
});

// Инициализация при загрузке
updateTotal();
