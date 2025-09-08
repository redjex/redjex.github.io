document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("main-content");

    // Имитация загрузки (3 секунды)
    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            loader.style.display = "none";
            mainContent.style.display = "block";

            // Плавное появление главного меню
            setTimeout(() => {
                mainContent.style.opacity = "1";
            }, 50);
        }, 500);
    }, 3000);
});