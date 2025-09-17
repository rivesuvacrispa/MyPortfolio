// Храним текущий индекс слайда для каждого проекта
const slideIndices = {};

// Инициализация слайдеров
document.querySelectorAll('.slides').forEach(slides =>
{
    const slideId = slides.id;
    slideIndices[slideId] = 0;
    updateSlides(slideId);
});

// Функция для переключения слайдов
function moveSlide(sliderIndex, direction)
{
    const slideId = `slides-${sliderIndex}`;
    const slides = document.querySelector(`#${slideId}`).querySelectorAll('.slide');
    slideIndices[slideId] += direction;

    // Циклическая навигация
    if (slideIndices[slideId] >= slides.length)
    {
        slideIndices[slideId] = 0;
    }
    if (slideIndices[slideId] < 0)
    {
        slideIndices[slideId] = slides.length - 1;
    }

    updateSlides(slideId);
}

// Обновление отображаемого слайда
function updateSlides(slideId)
{
    const slides = document.querySelector(`#${slideId}`).querySelectorAll('.slide');
    slides.forEach((slide, index) =>
    {
        slide.classList.remove('active');
        if (index === slideIndices[slideId])
        {
            slide.classList.add('active');
        }
    });
}

function updateNavigator() {
    const scrollPosition = window.scrollY;
    const navLinks = document.querySelectorAll('.nav-link');

    // Если наверху страницы, подсвечиваем первый блок
    if (scrollPosition < 50) // Порог 50 пикселей для верхней части
    {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[href="#about"]').classList.add('active');
        return;
    }

    // Логика для остальных секций
    navLinks.forEach(link =>
    {
        const section = document.querySelector(link.getAttribute('href'));
        if (section)
        {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2)
            {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () =>
{
    const navLinks = document.querySelectorAll('.nav-link');

    // Плавная прокрутка при клике
    navLinks.forEach(link =>
    {
        link.addEventListener('click', (e) =>
        {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({behavior: 'smooth'});
        });
    });

    updateNavigator();
    // Обновление активного пункта навигатора при скролле
    window.addEventListener('scroll', updateNavigator);
});

// Сворачивание-разворачивание дропдаунов
document.addEventListener('DOMContentLoaded', () =>
{
    const toggles = document.querySelectorAll('.dropdown-toggle');
    toggles.forEach(toggle =>
    {
        toggle.addEventListener('click', () =>
        {
            const content = toggle.nextElementSibling;
            const isActive = content.classList.contains('active');
            document.querySelectorAll('.dropdown-content').forEach(item =>
            {
                item.classList.remove('active');
                item.previousElementSibling.classList.remove('active');
                item.style.maxHeight = '0'; // Сбрасываем max-height для всех
            });
            if (!isActive)
            {
                content.classList.add('active');
                toggle.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px'; // Устанавливаем высоту для открытия
            } else {
                content.style.maxHeight = '0'; // Сбрасываем при повторном клике
            }
        });
    });
});

// Загрузка scripts.js для фона с подсветкой
document.addEventListener('DOMContentLoaded', () =>
{
    fetch('/static/scripts.js')
        .then(response => response.text())
        .then(data =>
        {
            const codeElement = document.getElementById('background-code');
            codeElement.textContent = data; // Вставляем код
            Prism.highlightElement(codeElement); // Запускаем подсветку
        });
});

// Параллакс для фонового кода
function updateParallax() {
    const scrollPosition = window.scrollY;
    const codeBackground = document.querySelector('.code-background');
    codeBackground.style.transform = `translateY(-${scrollPosition * 0.5}px)`; // Прокрутка в 2 раза медленнее
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', updateParallax);
});