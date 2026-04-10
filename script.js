(function () {
  'use strict';

  /* ====================== SCREEN NAVIGATION ====================== */

  const screens = document.querySelectorAll('.screen');

  function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  var btnViewMore = document.getElementById('btn-view-more');
  if (btnViewMore) {
    btnViewMore.addEventListener('click', function () {
      showScreen(this.dataset.target);
    });
  }

  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      showScreen(this.dataset.target);
    });
  });

  /* ====================== THE BIG QUESTION: NO BUTTON DODGE ====================== */

  const btnNo = document.getElementById('btn-no');
  let dodgeCount = 0;
  const MAX_DODGES = 4;

  function dodgeButton() {
    dodgeCount++;

    if (dodgeCount >= MAX_DODGES) {
      explodeButton();
      return;
    }

    btnNo.classList.remove('shake-it');
    void btnNo.offsetWidth;
    btnNo.classList.add('shake-it');

    if (!btnNo.classList.contains('dodging')) {
      const rect = btnNo.getBoundingClientRect();
      btnNo.style.left = rect.left + 'px';
      btnNo.style.top = rect.top + 'px';
      btnNo.style.width = rect.width + 'px';
      btnNo.classList.add('dodging');
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 20;
    const bw = btnNo.offsetWidth;
    const bh = btnNo.offsetHeight;

    const newLeft = pad + Math.random() * (vw - bw - pad * 2);
    const newTop = pad + Math.random() * (vh - bh - pad * 2);

    btnNo.style.left = newLeft + 'px';
    btnNo.style.top = newTop + 'px';
  }

  function explodeButton() {
    var rect = btnNo.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    btnNo.classList.remove('dodging');
    btnNo.classList.add('exploding');

    var colors = ['#F3EDE4', '#C4B5A0', '#8B7355', '#EDD9A3', '#D4C5AA'];
    for (var i = 0; i < 14; i++) {
      var p = document.createElement('div');
      p.className = 'explode-particle';
      var angle = Math.random() * Math.PI * 2;
      var dist = 40 + Math.random() * 80;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist;
      p.style.left = (cx - 5) + 'px';
      p.style.top = (cy - 5) + 'px';
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      p.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = (6 + Math.random() * 8) + 'px';
      p.style.height = (6 + Math.random() * 8) + 'px';
      p.style.borderRadius = (Math.random() > 0.5 ? '50%' : '2px');
      document.body.appendChild(p);
      p.addEventListener('animationend', function () { this.remove(); });
    }

    btnNo.addEventListener('animationend', function handler() {
      btnNo.style.display = 'none';
      btnNo.removeEventListener('animationend', handler);

      var msg = document.createElement('div');
      msg.className = 'no-option-msg';
      msg.textContent = "not an option, this ain\u2019t consensual :p";
      var clampedX = Math.max(20, Math.min(cx, window.innerWidth - 20));
      msg.style.left = clampedX + 'px';
      msg.style.top = cy + 'px';
      document.body.appendChild(msg);

      setTimeout(function () { msg.remove(); }, 3000);
    });
  }

  var lastDodgeTime = 0;

  function handleDodge(e) {
    e.preventDefault();
    var now = Date.now();
    if (now - lastDodgeTime < 300) return;
    lastDodgeTime = now;
    dodgeButton();
  }

  btnNo.addEventListener('pointerdown', handleDodge);
  btnNo.addEventListener('touchstart', handleDodge, { passive: false });

  /* ====================== YES / FUNNY-NO → LIMCA ====================== */

  const btnYes = document.getElementById('btn-yes');
  const btnFunnyNo = document.getElementById('btn-funny-no');
  const limcaOverlay = document.getElementById('limca-overlay');

  function openLimca() {
    limcaOverlay.classList.add('active');
  }

  btnYes.addEventListener('click', openLimca);
  btnFunnyNo.addEventListener('click', openLimca);

  /* ====================== LIMCA: NO BUTTON SHAKE ====================== */

  const btnLimcaNo = document.getElementById('btn-limca-no');

  btnLimcaNo.addEventListener('click', function () {
    this.classList.remove('shaking');
    void this.offsetWidth; // force reflow to restart animation
    this.classList.add('shaking');
  });

  btnLimcaNo.addEventListener('animationend', function () {
    this.classList.remove('shaking');
  });

  /* ====================== LIMCA: YES → PROMOTION PAGE ====================== */

  const btnLimcaYes = document.getElementById('btn-limca-yes');

  btnLimcaYes.addEventListener('click', function () {
    limcaOverlay.classList.remove('active');

    setTimeout(function () {
      showScreen('screen-promo');
      launchCelebration();
    }, 350);
  });

  /* ====================== CELEBRATION: CONFETTI + HEARTS ====================== */

  function launchCelebration() {
    launchConfetti();
    spawnHearts();

    var newCard = document.querySelector('.card-new');
    if (newCard) {
      setTimeout(function () { newCard.classList.add('glow'); }, 3000);
    }
  }

  function launchConfetti() {
    if (typeof confetti !== 'function') return;

    const duration = 3500;
    const end = Date.now() + duration;

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#B8963E', '#F5E6C8', '#D94040', '#FF6B8A', '#FFD700']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#B8963E', '#F5E6C8', '#D94040', '#FF6B8A', '#FFD700']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }

    frame();

    setTimeout(function () {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#B8963E', '#EDD9A3', '#FF6B8A', '#FFD700', '#FF4444']
      });
    }, 800);
  }

  function spawnHearts() {
    const container = document.getElementById('hearts-float');
    if (!container) return;

    const hearts = ['♥', '♡', '❤', '💛'];
    const count = 18;

    for (let i = 0; i < count; i++) {
      setTimeout(function () {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (5 + Math.random() * 90) + '%';
        heart.style.animationDuration = (3 + Math.random() * 3) + 's';
        heart.style.animationDelay = '0s';
        heart.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
        container.appendChild(heart);

        heart.addEventListener('animationend', function () {
          heart.remove();
        });
      }, i * 300);
    }
  }

})();
