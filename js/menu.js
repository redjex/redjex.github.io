document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".menu-button");
    const menus = document.querySelectorAll(".content");
    const outline = document.querySelector(".button-outline");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const targetMenu = button.getAttribute("data-menu");

            // Скрываем все меню
            menus.forEach(menu => {
                menu.style.display = "none";
            });

            // Показываем нужное меню
            document.getElementById(targetMenu).style.display = "block";

            // Плавно скроллим страницу вверх
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            // Анимация обводки на кнопке
            const rect = button.getBoundingClientRect();
            outline.style.width = `${rect.width}px`;
            outline.style.height = `${rect.height}px`;
            outline.style.left = `${button.offsetLeft}px`;
            outline.style.top = `${button.offsetTop}px`;
            outline.style.opacity = 1;
            outline.classList.add("animate-outline");
            setTimeout(() => outline.classList.remove("animate-outline"), 800);
        });
    });
});
