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
