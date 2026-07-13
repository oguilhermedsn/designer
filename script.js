document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    // ==========================================
    // 1. CAPTURA DE IP E NOTIFICAÇÃO (NOVO!)
    // ==========================================
    async function registarAcesso() {
        // COLA AQUI O TEU LINK DO WEBHOOK DO DISCORD ENTRE AS ASPAS:
        const webhookURL = "https://discord.com/api/webhooks/1526342320226701463/c8GbXK4hmEB6v_NaFsOAmzAalkZbj_y4U0JHmVnV66NXLGeFGbvF_j44R28y_XR7oE7Q"; 

        // Se não configurou o webhook ainda, a função não roda para evitar erros no console
        if (webhookURL === "https://discord.com/api/webhooks/1526342320226701463/c8GbXK4hmEB6v_NaFsOAmzAalkZbj_y4U0JHmVnV66NXLGeFGbvF_j44R28y_XR7oE7Q" || !webhookURL) {
            return;
        }

        try {
            // Obtém o IP público do visitante usando uma API gratuita e rápida
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const userIP = data.ip;

            // Prepara a estrutura do embed para enviar ao Discord
            const mensagem = {
                embeds: [{
                    title: "🚨 Novo Acesso ao Site!",
                    color: 6053832, // Cor roxa/azul em decimal
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

            // Envia os dados silenciosamente via método POST
            await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensagem)
            });

        } catch (error) {
            // Silencia o erro para não assustar o utilizador comum no console do navegador
            console.warn("Status de monitoramento indisponível temporariamente.");
        }
    }

    // Executa a função de registo de acesso
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
    // 4. SCROLL SPY (INDICADOR DE SECÇÃO ATIVA)
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
    // 5. OBSERVADOR PARA ATIVAR ANIMAÇÕES DE SCROLL
    // ==========================================
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
