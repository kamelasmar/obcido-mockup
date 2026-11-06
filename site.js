// Shared site chrome: sticky nav state, Capabilities dropdown, full-screen menu, current-page marker.
(() => {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mark current section in the primary nav
  const page = document.body.dataset.page;
  if (page) document.querySelectorAll(`[data-nav="${page}"]`).forEach(el => el.setAttribute('aria-current', 'page'));

  // Capabilities dropdown: hover on desktop, click/keyboard everywhere
  const dd = document.getElementById('dd'), ddBtn = dd.querySelector('.dd-btn');
  const setDD = open => { dd.classList.toggle('open', open); ddBtn.setAttribute('aria-expanded', open); };
  ddBtn.addEventListener('click', () => setDD(!dd.classList.contains('open')));
  dd.addEventListener('mouseenter', () => matchMedia('(hover: hover)').matches && setDD(true));
  dd.addEventListener('mouseleave', () => setDD(false));
  dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) setDD(false); });
  document.addEventListener('click', e => { if (!dd.contains(e.target)) setDD(false); });

  // Full-screen menu
  const menu = document.getElementById('menu'), openBtn = document.getElementById('menuOpen'), closeBtn = document.getElementById('menuClose');
  const setMenu = open => {
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('open')); closeBtn.focus(); }
    else { menu.classList.remove('open'); setTimeout(() => (menu.hidden = true), 350); openBtn.focus(); }
    openBtn.setAttribute('aria-expanded', open);
    document.documentElement.classList.toggle('menu-lock', open);
  };
  openBtn.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) setMenu(false);
    setDD(false);
  });
  // Keep focus inside the open menu
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...menu.querySelectorAll('a, button')], first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Scroll reveal for inner pages (homepage has its own richer version)
  if (!document.body.dataset.home) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
})();
