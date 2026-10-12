const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const year = document.getElementById('year');

// Header tint follows scroll without changing the page layout.
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener('click', () => {
  const open = primaryNav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});

primaryNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  primaryNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
}));

// Subtle entrance motion: content remains visible if JS or the observer is unavailable.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// The form composes an email; it does not claim to store or send data server-side.
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const artist = String(data.get('artist') || '').trim();
  const project = String(data.get('project') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = encodeURIComponent(`DVRKFLOW MUSIC — ${project || 'Demande de distribution'}`);
  const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\nArtiste / Label : ${artist}\nType de projet : ${project}\n\nMessage :\n${message}`);
  if (status) {
    status.style.display = 'block';
    status.textContent = 'Ton application e-mail va s’ouvrir. Vérifie le message puis appuie sur Envoyer.';
  }
  window.location.href = `mailto:contact@dvrkflowmusic.space?subject=${subject}&body=${body}`;
});
if (year) year.textContent = String(new Date().getFullYear());
