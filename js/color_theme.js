function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            try {
                func.apply(this, args);
            } catch (error) {
                console.error('Debounced function error:', error);
            }
        }, wait);
    };
}

// Function to get the element under the control-panel at its current position
function getElementUnderControlPanel() {
    try {
        const controlPanel = document.querySelector('.control-panel');
        if (!controlPanel) {
            console.warn('Control panel not found');
            return document.body;
        }

        const rect = controlPanel.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
            console.warn('Invalid coordinates for elementFromPoint:', { x, y });
            return document.body;
        }

        const originalVisibility = controlPanel.style.visibility;
        controlPanel.style.visibility = 'hidden';
        const elementUnder = document.elementFromPoint(x, y) || document.body;
        controlPanel.style.visibility = originalVisibility;

        return elementUnder;
    } catch (error) {
        console.error('Error in getElementUnderControlPanel:', error);
        return document.body;
    }
}

// Function to determine if a background color is light or dark
function isLightBackground(element) {
    try {
        if (!element) {
            console.warn('No element provided for background check');
            return false;
        }

        let currentElement = element;
        let bgColor = window.getComputedStyle(currentElement).backgroundColor;

        while (currentElement && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
            currentElement = currentElement.parentElement || document.body;
            bgColor = window.getComputedStyle(currentElement).backgroundColor;
        }

        const rgb = bgColor.match(/\d+/g);
        if (!rgb) {
            console.warn('Unable to parse background color:', bgColor);
            return false;
        }

        const [r, g, b] = rgb.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    } catch (error) {
        console.error('Error in isLightBackground:', error);
        return false;
    }
}

// Function to update control panel based on background
function updateControlPanelTextColor() {
    try {
        const controlPanel = document.querySelector('.control-panel');
        if (!controlPanel) {
            console.warn('Control panel not found for text color update');
            return;
        }

        const elementUnder = getElementUnderControlPanel();
        const isLight = isLightBackground(elementUnder);
        controlPanel.setAttribute('data-bg', isLight ? 'white' : 'dark');

        // Update image sources based on background
        const buttons = document.querySelectorAll('.menu-button');
        buttons.forEach((button, index) => {
            const img = button.querySelector('.menu-icon');
            if (img) {
                if (isLight) {
                    // Light background: use original images
                    if (index === 0) img.src = 'img/home.png';
                    if (index === 1) img.src = 'img/+5.png';
                    if (index === 2) img.src = 'img/user.png';
                } else {
                    // Dark background: use alternate images
                    if (index === 0) img.src = 'img/home1.png';
                    if (index === 1) img.src = 'img/+5_1.png';
                    if (index === 2) img.src = 'img/user1.png';
                }
            }
        });
    } catch (error) {
        console.error('Error in updateControlPanelTextColor:', error);
    }
}

// Debounced version of the update function for scroll events
const debouncedUpdateControlPanelTextColor = debounce(updateControlPanelTextColor, 200);

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateControlPanelTextColor();
    } catch (error) {
        console.error('Error on DOMContentLoaded:', error);
    }
});

// Update on scroll
window.addEventListener('scroll', debouncedUpdateControlPanelTextColor);

// Observe changes to the control-panel's style or class
try {
    const observerTarget = document.querySelector('.control-panel') || document.body;
    const observer = new MutationObserver(debouncedUpdateControlPanelTextColor);
    observer.observe(observerTarget, {
        attributes: true,
        attributeFilter: ['style', 'class'],
    });
} catch (error) {
    console.error('Error setting up MutationObserver:', error);
}

// Re-check on window resize
window.addEventListener('resize', () => {
    try {
        updateControlPanelTextColor();
    } catch (error) {
        console.error('Error on resize:', error);
    }
});