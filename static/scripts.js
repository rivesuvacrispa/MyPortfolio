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

let selectedNavlink = null;

function updateNavigator() {

    function selectNavlink(link)
    {
        if (selectedNavlink === link) return;

        selectedNavlink = link;
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Включить скролл навигатора, только если он в виде топ-бара
        if (window.innerWidth <= 1440)
            navigator.scrollLeft = link.offsetLeft - 20;
    }

    const scrollPosition = window.scrollY;
    const navLinks = document.querySelectorAll('.nav-link');
    const navigator = document.querySelector('.navigator');

    // Если наверху страницы, подсвечиваем первый блок
    if (scrollPosition < 50) // Порог 50 пикселей для верхней части
    {
        const link = document.querySelector('.nav-link[href="#about"]');
        selectNavlink(link);
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
                selectNavlink(link);
            }
        }
    });
}

// Переход по навигатору
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

            if (isActive)
            {
                content.classList.remove('active')
                toggle.classList.remove('active')
                content.style.maxHeight = '0'; // Сбрасываем при повторном клике
            } else {
                content.classList.add('active');
                toggle.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px'; // Устанавливаем высоту для открытия
            }
        });
    });
});

// Загрузка scripts.js для фона с подсветкой
document.addEventListener('DOMContentLoaded', () =>
{
    // На слабых устройствах код фона не загружается
    if (window.innerWidth <= 425 || navigator.hardwareConcurrency < 4) return;

    // Т.к. центральная страница на всю ширину, загрузка кода идет без анимации
    if (window.innerWidth <= 1440)
    {
        fetch('/static/scripts.js')
            .then(response => response.text())
            .then(data =>
            {
                const codeElement = document.getElementById('background-code');
                codeElement.textContent = data;
                Prism.highlightElement(codeElement);
            });

        return;
    }

    fetch('/static/scripts.js')
        .then(response => response.text())
        .then(data =>
        {
            const codeElement = document.getElementById('background-code');
            const lines = data.split('\n');
            let index = 0;

            function addLine()
            {
                if (index < lines.length)
                {
                    const line = lines[index];
                    const highlightedLine = Prism.highlight(line, Prism.languages.javascript, 'javascript');
                    const lineElement = document.createElement('span');
                    lineElement.className = 'line';
                    lineElement.innerHTML = highlightedLine;
                    codeElement.appendChild(lineElement);
                    index++;
                    setTimeout(addLine, 20);
                }
            }

            codeElement.innerHTML = '';
            addLine();
        });
});

// Параллакс для фонового кода
function updateParallax()
{
    // Отключаем параллакс на мобильных или слабых устройствах
    if (window.innerWidth <= 425 || navigator.hardwareConcurrency < 4)
    {
        return;
    }

    const scrollPosition = window.scrollY;
    const codeBackground = document.querySelector('.code-background');
    codeBackground.style.transform = `translateY(-${scrollPosition * 0.5}px)`; // Прокрутка в 2 раза медленнее
}

document.addEventListener('DOMContentLoaded', () =>
{
    window.addEventListener('scroll', updateParallax);
});

// Модальное окно для полноэкранного просмотра
let currentProjectIndex = 0;
let currentSlideIndex = 0;

function openModal(projectIndex, slideIndex)
{
    currentProjectIndex = projectIndex;
    currentSlideIndex = slideIndex;

    const modal = document.getElementById('imageModal');
    const modalSlides = document.getElementById('modalSlides');
    const projectSlides = document.querySelector(`#slides-${projectIndex}`).children;

    document.body.style.overflow = 'hidden';
    modal.classList.add('active');

    // Заполняем модальный слайдер изображениями текущего проекта
    modalSlides.innerHTML = '';
    Array.from(projectSlides).forEach((img, index) =>
    {
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalImg.className = 'modal-slide';
        if (index === slideIndex) modalImg.className += ' active';
        modalSlides.appendChild(modalImg);
    });

    // Скрываем кнопки, если только одно изображение
    const prevBtn = document.querySelector('.modal-btn.prev-btn');
    const nextBtn = document.querySelector('.modal-btn.next-btn');
    if (projectSlides.length <= 1)
    {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }

    // Клик на модальную картинку для закрытия
    modalSlides.addEventListener('click', closeModal);

    // Перелистывание картинок скроллом
    const wheelHandler = (e) =>
    {
        e.preventDefault();
        moveModalSlide(e.deltaY > 0 ? 1 : -1);
    };
    document.addEventListener('wheel', wheelHandler, { passive: false });

    // Перелистывание картинок клавиатурой для стрелок
    const keyHandler = (e) =>
    {
        if (e.key === 'ArrowRight') moveModalSlide(1);
        else if (e.key === 'ArrowLeft') moveModalSlide(-1);
        else if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', keyHandler);

    // Сохраняем обработчики для удаления
    modal.wheelHandler = wheelHandler;
    modal.keyHandler = keyHandler;

    updateModalSlide();
}

function moveModalSlide(direction)
{
    const modalSlides = document.querySelectorAll('.modal-slide');
    const projectSlides = document.querySelector(`#slides-${currentProjectIndex}`).children;

    currentSlideIndex = (currentSlideIndex + direction + modalSlides.length) % modalSlides.length;

    // Обновляем картинку в модалке
    updateModalSlide();

    // Синхронизируем исходный слайдер
    Array.from(projectSlides).forEach((slide, index) =>
    {
        slide.classList.toggle('active', index === currentSlideIndex);
    });
}

function updateModalSlide()
{
    const modalSlides = document.querySelectorAll('.modal-slide');
    modalSlides.forEach((slide, index) =>
    {
        slide.classList.toggle('active', index === currentSlideIndex);
    });
}

function closeModal()
{
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    if (modal.wheelHandler) document.removeEventListener('wheel', modal.wheelHandler, { passive: false });
    if (modal.keyHandler) document.removeEventListener('keydown', modal.keyHandler);
}