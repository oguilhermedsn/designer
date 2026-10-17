(() => {
  const start = () => {
    document.documentElement.classList.add('js-motion');
    const menuButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    menuButton?.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      nav?.classList.toggle('open', !isOpen);
    });
    nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Abrir menu');
    }));

    const revealItems = [...document.querySelectorAll('.reveal')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(el => el.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
      revealItems.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 3) * 100}ms`;
        observer.observe(el);
      });
      // Mantém cada elemento aguardando sua entrada na viewport para animar ao rolar.
      // Se um elemento já estiver visível no primeiro quadro, revela-o após um frame.
      requestAnimationFrame(() => {
        revealItems.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      });
    }

    const year = document.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
    const sections = [...document.querySelectorAll('main section[id], header[id]')];
    const links = [...document.querySelectorAll('.nav a')];
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
          }
        });
      }, { rootMargin: '-25% 0px -65% 0px' });
      sections.forEach(section => sectionObserver.observe(section));
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
