/**
 * app.js
 * Greeting App — core UI logic
 */

(function () {
    'use strict';

    // ── DOM References ──
    const nameInput = document.getElementById('name-input');
    const greetBtn = document.getElementById('greet-btn');
    const greetingDisplay = document.getElementById('greeting-display');

    // ── Validate required elements exist ──
    if (!nameInput || !greetBtn || !greetingDisplay) {
        console.error('[App] Required DOM elements not found.');
        return;
    }

    // ── Helper: show greeting ──
    function showGreeting(name) {
        const trimmed = name.trim();
        const displayName = trimmed.length > 0 ? trimmed : 'Stranger';

        // Clear existing content first
        greetingDisplay.innerHTML = '';

        // Build greeting markup
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
      <span class="greeting-text" id="greeting-text">Hello, ${escapeHtml(displayName)}! 👋</span>
      <span class="greeting-sub">Glad to meet you — have a wonderful day!</span>
    `;
        greetingDisplay.appendChild(wrapper);
    }

    // ── Helper: safe HTML escape ──
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ── Main greet handler ──
    function handleGreet() {
        const name = nameInput.value;
        showGreeting(name);
        // Trigger one random animation (handled by animations.js)
        if (window.GreetingAnimations) {
            window.GreetingAnimations.triggerRandomAnimation();
        }
    }

    // ── Event Listeners ──
    greetBtn.addEventListener('click', handleGreet);

    nameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleGreet();
    });

    // ── Init background floating particles ──
    (function initParticles() {
        const container = document.getElementById('bg-particles');
        if (!container) return;
        const colors = ['rgba(124,58,237,0.5)', 'rgba(167,139,250,0.4)', 'rgba(245,158,11,0.3)', 'rgba(16,185,129,0.3)'];
        const count = 18;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = 4 + Math.random() * 8;
            p.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${8 + Math.random() * 14}s;
        animation-delay:${Math.random() * 10}s;
      `;
            container.appendChild(p);
        }
    })();

    // ── Expose internals for testing ──
    window.GreetingApp = {
        handleGreet,
        showGreeting,
        escapeHtml,
        get nameInput() { return nameInput; },
        get greetBtn() { return greetBtn; },
        get greetingDisplay() { return greetingDisplay; },
    };
})();
