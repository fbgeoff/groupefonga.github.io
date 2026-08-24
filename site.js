/* Groupe Fonga — shared site behavior */
(function () {
  'use strict';

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Fade-up on scroll
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    fadeEls.forEach(function (el) { obs.observe(el); });
  }

  // Particles — confined to #particles parent (.hero)
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    function resize() {
      const parent = canvas.parentElement;
      W = canvas.width = parent.clientWidth;
      H = canvas.height = parent.clientHeight;
    }
    function P() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.a = Math.random() * 0.25 + 0.05;
    }
    P.prototype.u = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    };
    function init() {
      resize();
      pts = Array.from({ length: 36 }, function () { return new P(); });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168,224,99,' + p.a + ')';
        ctx.fill();
        p.u();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = 'rgba(168,224,99,' + (0.05 * (1 - d / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', function () {
      resize();
    });
    init();
    draw();
  }

  // Stat counters
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function animate(el) {
      const t = +el.dataset.target;
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = pre + Math.floor(t * ease(p)) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = pre + t + suf;
      })(start);
    }
    const cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animate(e.target);
          cObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  // Contact form (Formspree)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch('https://formspree.io/f/mqezojav', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          window.location.href = '/thankyou.html';
        } else {
          btn.textContent = 'Send message →';
          btn.disabled = false;
          alert('Something went wrong. Please email us at info@groupefonga.com');
        }
      } catch (err) {
        btn.textContent = 'Send message →';
        btn.disabled = false;
        alert('Something went wrong. Please email us at info@groupefonga.com');
      }
    });
  }
})();
