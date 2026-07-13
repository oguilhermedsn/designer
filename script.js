document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    // 1. Abrir e Fechar Menu Mobile
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Ativa links de navegação de forma única
    const setActiveLink = (sectionId) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (sectionId === 'inicio' && href === '#') {
                link.classList.add('active');
            } else if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // 2. Rolagem suave para os links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') {
                e.preventDefault();
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                setActiveLink('inicio');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();

                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }

                const sectionName = targetId.replace('#', '');
                setActiveLink(sectionName);

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Scroll Spy
    const scrollTargets = [
        { id: 'inicio', element: document.getElementById('inicio') },
        { id: 'sobre', element: document.getElementById('sobre') },
        { id: 'portfolio', element: document.getElementById('portfolio') }
    ];

    window.addEventListener('scroll', () => {
        let currentSectionId = 'inicio';
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPosition = window.pageYOffset + navbarHeight + 150; 

        scrollTargets.forEach(target => {
            if (target.element) {
                const top = target.element.offsetTop;
                const height = target.element.offsetHeight;

                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSectionId = target.id;
                }
            }
        });

        setActiveLink(currentSectionId);
    });

    // 4. Observador para Ativar Animações de Scroll (NOVO!)
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento estiver visível na janela do utilizador
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Deixa de observar este elemento para poupar desempenho
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Elemento ativa quando 10% dele estiver visível
        rootMargin: "0px 0px -50px 0px" // Ativa um pouco antes de aparecer por completo
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
});