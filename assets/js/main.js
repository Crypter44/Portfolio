// header background on scroll
const header = document.querySelector('header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// mobile nav
const burger = document.querySelector('.burger');
const mobilePanel = document.querySelector('.mobile-panel');
if (burger && mobilePanel) {
  const closePanel = () => {
    burger.classList.remove('open');
    mobilePanel.classList.remove('open');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const isOpen = mobilePanel.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closePanel));
}

// scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// click-to-play video overlays
document.querySelectorAll('.video-frame').forEach(frame => {
  const video = frame.querySelector('video');
  const btn = frame.querySelector('.play-btn');
  if (!video || !btn) return;
  btn.addEventListener('click', () => {
    video.controls = true;
    video.play();
    btn.classList.add('hidden');
  });
  video.addEventListener('pause', () => {
    if (video.currentTime > 0 && !video.ended) return;
  });
  video.addEventListener('ended', () => {
    btn.classList.remove('hidden');
    video.controls = false;
  });
});

// renders carousel
document.querySelectorAll('.carousel').forEach(car => {
  const track = car.querySelector('.carousel-track');
  const slides = [...track.children];
  const count = car.querySelector('.car-count');
  const current = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  };
  const go = (i) => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const s = slides[i];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' });
  };
  track.addEventListener('scroll', () => { count.textContent = (current() + 1) + ' / ' + slides.length; }, { passive: true });
  car.querySelectorAll('.car-btn').forEach(b => b.addEventListener('click', () => go(current() + Number(b.dataset.dir))));
  car.tabIndex = 0;
  car.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(current() + 1);
    if (e.key === 'ArrowLeft') go(current() - 1);
  });
  // only load/play looping clips once visible
  const vids = car.querySelectorAll('video');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.preload = 'auto'; e.target.play().catch(() => {}); }
      else e.target.pause();
    }), { threshold: 0.3 });
    vids.forEach(v => vio.observe(v));
  }
});
