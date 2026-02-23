/**
 * animations.js
 * Greeting App — Three exclusive background animations
 * 1. Confetti burst (canvas-confetti)
 * 2. Party Popper (canvas-confetti directed from bottom corners)
 * 3. Glowing Burst (CSS overlay animation)
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // State: track active animation cleanup handles
  // ──────────────────────────────────────────────
  let _activeParticles = [];
  let _glowTimer = null;
  let _confettiInterval = null;

  /**
   * clearAllAnimations — stops every running animation cleanly.
   * Must be called before starting a new animation.
   */
  function clearAllAnimations() {
    // 1. Stop any confetti intervals / frame loops
    if (_confettiInterval) {
      clearInterval(_confettiInterval);
      _confettiInterval = null;
    }
    if (typeof confetti !== 'undefined' && confetti.reset) {
      confetti.reset();
    }

    // 2. Remove all DOM popper particles
    _activeParticles.forEach(el => el.remove());
    _activeParticles = [];

    // 3. Clear glow overlay
    const overlay = document.getElementById('glowing-burst-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      // Force a reflow so adding 'active' again will retrigger animation
      void overlay.offsetWidth;
    }

    // 4. Clear scheduled timers
    if (_glowTimer) {
      clearTimeout(_glowTimer);
      _glowTimer = null;
    }
  }

  // ──────────────────────────────────────────────
  //  ANIMATION 1 — Confetti Burst
  // ──────────────────────────────────────────────
  function triggerConfetti() {
    if (typeof confetti === 'undefined') {
      console.warn('canvas-confetti not loaded');
      return;
    }

    const count = 220;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.20, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.10, { spread: 120, startVelocity: 45 });

    // Cleanup confetti canvas after 4 s
    _glowTimer = setTimeout(() => {
      if (typeof confetti !== 'undefined' && confetti.reset) confetti.reset();
    }, 4000);
  }

  // ──────────────────────────────────────────────
  //  ANIMATION 2 — Party Popper (corner cannons)
  // ──────────────────────────────────────────────
  function triggerPartyPopper() {
    if (typeof confetti === 'undefined') {
      console.warn('canvas-confetti not loaded');
      _triggerDOMPopper(); // fallback to DOM particles
      return;
    }

    const duration = 2500;
    const end = Date.now() + duration;

    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#f4a261', '#c77dff'];

    function shootCannon() {
      // Left cannon
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors,
        zIndex: 9999,
        shapes: ['square', 'circle'],
        scalar: 1.1,
      });
      // Right cannon
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors,
        zIndex: 9999,
        shapes: ['square', 'circle'],
        scalar: 1.1,
      });

      if (Date.now() < end) {
        _confettiInterval = requestAnimationFrame(shootCannon);
      }
    }

    _confettiInterval = requestAnimationFrame(shootCannon);

    _glowTimer = setTimeout(() => {
      cancelAnimationFrame(_confettiInterval);
      _confettiInterval = null;
      if (typeof confetti !== 'undefined' && confetti.reset) confetti.reset();
    }, duration + 500);
  }

  /** DOM fallback popper for when canvas-confetti is not available */
  function _triggerDOMPopper() {
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#f4a261','#c77dff','#a78bfa'];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'popper-particle';
      const isLeft = i < count / 2;
      el.style.left = isLeft ? '0px' : (window.innerWidth - 8) + 'px';
      el.style.top  = (window.innerHeight - 8) + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      const angle = isLeft
        ? (Math.random() * 70 + 20)          // 20°–90° right side up
        : (180 - Math.random() * 70 - 20);   // 90°–160° left side up
      const dist = 200 + Math.random() * 400;
      const rad  = (angle * Math.PI) / 180;
      el.style.setProperty('--tx', `${dist * Math.cos(rad)}px`);
      el.style.setProperty('--ty', `${-dist * Math.sin(rad)}px`);
      el.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
      el.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
      document.body.appendChild(el);
      _activeParticles.push(el);
    }
    _glowTimer = setTimeout(() => {
      _activeParticles.forEach(p => p.remove());
      _activeParticles = [];
    }, 2200);
  }

  // ──────────────────────────────────────────────
  //  ANIMATION 3 — Glowing Burst (CSS overlay)
  // ──────────────────────────────────────────────
  function triggerGlowingBurst() {
    const overlay = document.getElementById('glowing-burst-overlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    void overlay.offsetWidth;          // force reflow to restart animation
    overlay.classList.add('active');

    _glowTimer = setTimeout(() => {
      overlay.classList.remove('active');
    }, 2400);
  }

  // ──────────────────────────────────────────────
  //  Public API
  // ──────────────────────────────────────────────
  const ANIMATIONS = [triggerConfetti, triggerPartyPopper, triggerGlowingBurst];
  const ANIMATION_NAMES = ['confetti', 'partyPopper', 'glowingBurst'];

  /**
   * triggerRandomAnimation
   * Picks one of the 3 animations at random, clears any previous one, and fires it.
   * Returns the name of the animation triggered (for testing/logging).
   */
  function triggerRandomAnimation() {
    clearAllAnimations();
    const idx = Math.floor(Math.random() * ANIMATIONS.length);
    ANIMATIONS[idx]();
    const name = ANIMATION_NAMES[idx];
    console.log(`[Animations] Triggered: ${name}`);
    return name;
  }

  // Expose to window for app.js and tests.js
  window.GreetingAnimations = {
    triggerRandomAnimation,
    clearAllAnimations,
    triggerConfetti,
    triggerPartyPopper,
    triggerGlowingBurst,
    ANIMATION_NAMES,
  };
})();
