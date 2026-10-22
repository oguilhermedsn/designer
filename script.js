// Menu mobile acessível + animações de entrada ao rolar a página
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = nav ? nav.querySelectorAll("a") : [];

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const elements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  elements.forEach((el) => {
    const delay = Number.parseInt(el.dataset.delay || "0", 10);
    if (delay) el.style.transitionDelay = `${delay}ms`;
    observer.observe(el);
  });
});
