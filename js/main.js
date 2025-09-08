// main.js
setTimeout(() => {
    const factElement = document.getElementById('random-fact');
    if (factElement) {
        factElement.textContent = getRandomFact();
    }
}, 0);
// Здесь будет твоя логика для главного меню
console.log("Главное меню загружено!");