document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    // ==========================================
    // 1. CAPTURA DE IP E NOTIFICAÇÃO DO DISCORD
    // ==========================================
    async function registarAcesso() {
        const webhookURL = "https://discord.com/api/webhooks/1526342320226701463/c8GbXK4hmEB6v_NaFsOAmzAalkZbj_y4U0JHmVnV66NXLGeFGbvF_j44R28y_XR7oE7Q"; 

        try {
            // Faz a requisição para obter o IP do visitante
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const userIP = data.ip;

            // Estrutura a mensagem que vai aparecer no seu Discord
            const mensagem = {
                embeds: [{
                    title: "🚨 Novo Acesso ao Site!",
                    color: 6053832, 
                    fields: [
                        {
                            name: "📍 Endereço IP",
                            value: `\`${userIP}\``,
                            inline: true
                        },
                        {
                            name: "📱 Navegador / Dispositivo",
                            value: navigator.userAgent,
                            inline: false
                        },
                        {
                            name: "⏰ Horário",
                            value: new Date().toLocaleString("pt-BR"),
                            inline: true
                        }
                    ]
                }]
            };

            // Envia para o Discord de forma silenciosa
            await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensagem)
            });

        } catch (error) {
            console.warn("Status de monitorização indisponível.");
        }
    }

    // Executa a função de capturar IP logo ao abrir
    registarAcesso();


    // ==========================================
    // 2. ABRIR E FECHAR MENU MOBILE
    // ==========================================
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


    // ==========================================
    // 3. ROLAGEM SUAVE PARA OS LINKS
    // ==========================================
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


    // ==========================================
    // 4. SCROLL SPY (INDICADOR DE SEÇÃO ATIVA)
    // ==========================================
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


    // ==========================================
    // 5. OBSERVADOR PARA ATIVAR ANIMAÇÕES DE SCROLL (RESTAURADO!)
    // ==========================================
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Pára de observar para melhorar performance
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
});
