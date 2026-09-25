const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

primaryNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

/* Lightweight reveal: elements are observed once and then removed. */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* Counters */
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 800;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.7 });

document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));

/* Contact: no external form service required. */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form?.addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "");
  const email = String(data.get("email") || "");
  const artist = String(data.get("artist") || "");
  const message = String(data.get("message") || "");

  const subject = encodeURIComponent(`DVRKFLOW MUSIC — Nouvelle demande de distribution`);
  const body = encodeURIComponent(
`Nom : ${name}
Email : ${email}
Artiste / Label : ${artist}

Projet :
${message}`
  );

  status.style.display = "block";
  status.textContent = "Ouverture de votre application email…";

  window.location.href =
    `mailto:contact@dvrkflowmusic.spac?subject=${subject}&body=${body}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
