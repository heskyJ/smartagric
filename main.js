/* ─────────────────────────────────────────────────────────────
   main.js — GSAP animations + cursor + nav scroll
───────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Wait for GSAP to load ───────────────────────────────
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded yet, retrying...');
    setTimeout(() => initAll(), 300);
    return;
  }
  initAll();

  function initAll() {
    gsap.registerPlugin(ScrollTrigger);
    initCursor();
    initNav();
    initHeroAnimation();
    initScrollAnimations();
  }

  // ─── CUSTOM CURSOR ───────────────────────────────────────
  function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.05 });
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      gsap.set(follower, { x: followerX, y: followerY });
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Grow cursor on hover
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor,   { scale: 2, duration: 0.2 });
        gsap.to(follower, { scale: 1.5, opacity: 0.2, duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor,   { scale: 1, duration: 0.2 });
        gsap.to(follower, { scale: 1, opacity: 0.5, duration: 0.3 });
      });
    });
  }

  // ─── NAV SCROLL EFFECT ───────────────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ─── HERO ENTRANCE ───────────────────────────────────────
  function initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Split hero title lines for stagger
    const titleLines = document.querySelectorAll('.hero-title .line');

    tl
      .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
      .from(titleLines, {
        y: 120,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out'
      }, '-=0.4')
      .to('.hero-sub',     { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('.hero-desc',    { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('.hero-scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.3');

    // Set initial states
    gsap.set(['.hero-sub', '.hero-desc', '.hero-actions', '.hero-scroll-hint'], { opacity: 0, y: 20 });
    gsap.set('.hero-eyebrow', { opacity: 0, y: -10 });
  }

  // ─── SCROLL-TRIGGERED ANIMATIONS ─────────────────────────
  function initScrollAnimations() {

    // ── Section eyebrows & titles
    gsap.utils.toArray('.section-eyebrow, .section-title').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ── About image
    gsap.from('.about-image-frame', {
      opacity: 0,
      x: -50,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-image-frame', start: 'top 80%' }
    });
    gsap.from('.image-accent', {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-image-frame', start: 'top 80%' }
    });
    gsap.from('.about-stat-card', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-image-frame', start: 'top 80%' }
    });

    // ── About text stagger
    gsap.from('.about-text', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-content', start: 'top 80%' }
    });
    gsap.from(['.about-tags', '.about-content .btn-primary'], {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-content', start: 'top 75%' }
    });

    // ── Skill cards
    gsap.from('.skill-card', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' }
    });

    // ── Project cards
    document.querySelectorAll('.project-card').forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // Animate the underline on hover
      const line = card.querySelector('.project-line');
      if (line) {
        card.addEventListener('mouseenter', () => {
          gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'power2.out', transformOrigin: 'left' });
          gsap.to(line, { background: 'var(--gold)', duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(line, { background: 'var(--border)', duration: 0.3 });
        });
      }
    });

    // ── Contact section
    gsap.from('.contact-title, .contact-sub, .contact .btn-primary', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact', start: 'top 75%' }
    });

    // ── Parallax on hero title (subtle)
    gsap.to('.hero-title', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

});
