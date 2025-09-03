const startBtn = document.getElementById("startBtn");
const textElement = document.getElementById("text");
const qrElement = document.getElementById("qr");
const backBtn = document.getElementById("backBtn");
const music = document.getElementById("music");
const canvas = document.getElementById("starrySky");
const ctx = canvas.getContext("2d");

// Starry sky animation
let stars = [];
const numStars = 100;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createStar() {
    return {
        x: Math.random() * canvas.width, // Start anywhere along the width
        y: -10, // Start above the canvas
        size: Math.random() * 2 + 1, // Random size between 1 and 3
        speed: Math.random() * 2 + 1, // Random speed
        opacity: Math.random() * 0.5 + 0.5, // Random opacity for twinkling
        twinkleSpeed: Math.random() * 0.05 + 0.02 // Random twinkling speed
    };
}

function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set rotation transform with pivot at bottom-right corner
    const pivotX = canvas.width;
    const pivotY = canvas.height;
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(Math.PI / 4); // 45-degree rotation for right-to-bottom motion

    stars.forEach(star => {
        // Update star position
        star.y += star.speed;
        star.x -= star.speed * 0.5; // Slight leftward drift for natural flow

        // Twinkle effect
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.1;
        if (star.opacity < 0.3) star.opacity = 0.3;
        if (star.opacity > 1) star.opacity = 1;

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Reset star if it moves off-screen
        if (star.y > canvas.height || star.x < 0) {
            Object.assign(star, createStar());
        }
    });

    ctx.restore();
    requestAnimationFrame(animateStars);
}

initStars();
animateStars();

/*
   Формат строки:
   ["Текст", [время_показа_в_секундах], [задержка_перед_появлением_в_секундах]]
*/
const lines = [
    ["Ну а ты пахнешь цветами", [3.0], [0.0]],
    ["Самыми вкусными травами", [2.0], [0.0]],
    ["Самыми яркими красками", [2.0], [0.0]],
    ["О-о-о, как глоток пива «Дон»", [1.5], [0.0]],
    ["(У-е)", [2.0], [0.0]]
];

startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    textElement.classList.remove("hidden");
    qrElement.classList.add("hidden");
    backBtn.classList.add("hidden");

    // Сбрасываем QR-анимацию
    qrElement.classList.remove("show");

    // Включаем музыку
    try {
        await music.play();
    } catch (error) {
        console.log("Автовоспроизведение заблокировано. Попробуйте снова нажать кнопку.");
    }

    let index = 0;

    const showLine = () => {
        if (index < lines.length) {
            const [text, displayTime, delayTime] = lines[index];

            // Задержка перед показом строки
            setTimeout(() => {
                textElement.style.opacity = 0;

                setTimeout(() => {
                    textElement.textContent = text;
                    textElement.style.opacity = 1;

                    // Ждём время показа строки
                    setTimeout(() => {
                        textElement.style.opacity = 0;

                        setTimeout(() => {
                            index++;
                            showLine();
                        }, 800);
                    }, displayTime * 1000);
                }, 400);
            }, delayTime * 1000);
        } else {
            // Когда текст закончился — показываем QR-код
            setTimeout(() => {
                textElement.style.display = "none";
                qrElement.classList.remove("hidden");

                // Запускаем анимацию плавного появления
                setTimeout(() => {
                    qrElement.classList.add("show");
                }, 100);

                // Показываем кнопку "Назад"
                backBtn.classList.remove("hidden");
            }, 500);
        }
    };

    showLine();
});

// Кнопка "Назад" — возвращаемся на стартовый экран
backBtn.addEventListener("click", () => {
    music.pause();
    music.currentTime = 0;

    qrElement.classList.add("hidden");
    qrElement.classList.remove("show");
    backBtn.classList.add("hidden");

    textElement.textContent = "";
    textElement.style.opacity = 0;
    textElement.classList.add("hidden");

    startBtn.style.display = "inline-block";
});