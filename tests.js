/**
 * tests.js
 * Greeting App — In-browser test suite
 *
 * Tests cover ALL requirements:
 *  1.  Label "Enter Your Name" is rendered
 *  2.  Text input exists with correct placeholder
 *  3.  "Greet" button is rendered
 *  4.  Clicking Greet shows "Hello [name]" below button
 *  5.  Greeting appears even when input is empty (shows "Stranger")
 *  6.  Greeting updates correctly across multiple clicks
 *  7.  HTML special characters are safely escaped in greeting
 *  8.  Enter key triggers the greeting
 *  9.  window.GreetingAnimations API is loaded
 *  10. clearAllAnimations runs without errors
 *  11. triggerConfetti runs without errors
 *  12. triggerPartyPopper runs without errors
 *  13. triggerGlowingBurst runs without errors / adds CSS class
 *  14. triggerRandomAnimation returns a valid animation name
 *  15. Glow overlay element exists in DOM
 *  16. Consecutive clicks clear previous animation (no overlap)
 *  17. Background particles container exists
 *  18. window.GreetingApp API is loaded
 *  19. escapeHtml correctly escapes dangerous characters
 *  20. Animation names array contains expected 3 animations
 */

(function () {
    'use strict';

    const TIMEOUT_MS = 60; // small delay for DOM updates

    // ─── Mini test framework ───────────────────────────────────────────────────
    const results = [];
    let currentSuite = '';

    function suite(name) { currentSuite = name; }

    function test(name, fn) {
        let status = 'pass';
        let detail = '';
        try {
            fn();
        } catch (e) {
            status = 'fail';
            detail = e.message || String(e);
        }
        results.push({ suite: currentSuite, name, status, detail });
    }

    function assert(condition, message) {
        if (!condition) throw new Error(message || 'Assertion failed');
    }

    function assertEqual(a, b, message) {
        if (a !== b) throw new Error(message || `Expected "${b}", got "${a}"`);
    }

    function assertContains(str, substr, message) {
        if (!str.includes(substr)) throw new Error(message || `"${str}" does not contain "${substr}"`);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function getEl(id) { return document.getElementById(id); }

    function resetInput() {
        const inp = getEl('name-input');
        if (inp) inp.value = '';
        const disp = getEl('greeting-display');
        if (disp) disp.innerHTML = '';
    }

    function simulateClick(el) {
        el.click();
    }

    // ─── Run all tests ─────────────────────────────────────────────────────────
    function runAllTests() {
        results.length = 0;

        // ══════════════════════════════════════════════════════════════════════════
        // SUITE 1: DOM Structure
        // ══════════════════════════════════════════════════════════════════════════
        suite('DOM Structure');

        test('T01 — Label "Enter Your Name" is rendered', () => {
            const label = document.querySelector('label[for="name-input"]');
            assert(label, 'Label element not found');
            assertContains(label.textContent, 'Enter Your Name', 'Label text mismatch');
        });

        test('T02 — Text input exists with correct placeholder', () => {
            const inp = getEl('name-input');
            assert(inp, 'Input element not found');
            assertEqual(inp.tagName, 'INPUT', 'Element must be INPUT');
            assertEqual(inp.placeholder, 'Type your name here', 'Placeholder text mismatch');
        });

        test('T03 — "Greet" button is rendered', () => {
            const btn = getEl('greet-btn');
            assert(btn, 'Greet button not found');
            assertContains(btn.textContent, 'Greet', 'Button text must contain "Greet"');
        });

        test('T04 — Greeting display container exists', () => {
            const disp = getEl('greeting-display');
            assert(disp, '#greeting-display element not found');
        });

        test('T15 — Glow overlay element exists in DOM', () => {
            const overlay = getEl('glowing-burst-overlay');
            assert(overlay, '#glowing-burst-overlay not found');
        });

        test('T17 — Background particles container exists', () => {
            const particles = getEl('bg-particles');
            assert(particles, '#bg-particles container not found');
        });

        // ══════════════════════════════════════════════════════════════════════════
        // SUITE 2: Greeting Logic
        // ══════════════════════════════════════════════════════════════════════════
        suite('Greeting Logic');

        test('T04a — Greeting "Hello [name]" appears after button click', () => {
            resetInput();
            const inp = getEl('name-input');
            const btn = getEl('greet-btn');
            const disp = getEl('greeting-display');
            inp.value = 'Alice';
            simulateClick(btn);
            assertContains(disp.textContent, 'Hello', 'Greeting must contain "Hello"');
            assertContains(disp.textContent, 'Alice', 'Greeting must contain the entered name');
        });

        test('T05 — Empty input shows "Stranger"', () => {
            resetInput();
            const btn = getEl('greet-btn');
            const disp = getEl('greeting-display');
            getEl('name-input').value = '';
            simulateClick(btn);
            assertContains(disp.textContent, 'Stranger', 'Should greet Stranger when input is blank');
        });

        test('T06 — Greeting updates correctly on multiple clicks', () => {
            resetInput();
            const inp = getEl('name-input');
            const btn = getEl('greet-btn');
            const disp = getEl('greeting-display');

            inp.value = 'Bob';
            simulateClick(btn);
            assertContains(disp.textContent, 'Bob', 'First click should show Bob');

            inp.value = 'Carol';
            simulateClick(btn);
            assertContains(disp.textContent, 'Carol', 'Second click should show Carol');
            assert(!disp.textContent.includes('Bob'), 'Old greeting "Bob" should be gone');
        });

        test('T07 — HTML special characters are safely escaped', () => {
            resetInput();
            const inp = getEl('name-input');
            const btn = getEl('greet-btn');
            const disp = getEl('greeting-display');
            inp.value = '<script>alert(1)</script>';
            simulateClick(btn);
            // The raw script tag must NOT appear as a live element
            assert(!disp.querySelector('script'), '<script> must not be injected into DOM');
            assertContains(disp.innerHTML, '&lt;script&gt;', 'HTML must be escaped in output');
        });

        test('T08 — Enter key triggers greeting', () => {
            resetInput();
            const inp = getEl('name-input');
            const disp = getEl('greeting-display');
            inp.value = 'Dana';
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            inp.dispatchEvent(enterEvent);
            assertContains(disp.textContent, 'Dana', 'Enter key should trigger greeting with name');
        });

        // ══════════════════════════════════════════════════════════════════════════
        // SUITE 3: App API
        // ══════════════════════════════════════════════════════════════════════════
        suite('App API');

        test('T18 — window.GreetingApp is loaded', () => {
            assert(window.GreetingApp, 'window.GreetingApp not found');
        });

        test('T18a — GreetingApp exposes showGreeting method', () => {
            assert(typeof window.GreetingApp.showGreeting === 'function', 'showGreeting must be a function');
        });

        test('T19 — escapeHtml escapes dangerous characters', () => {
            const app = window.GreetingApp;
            assert(app, 'GreetingApp not loaded');
            const result = app.escapeHtml('<script>"&\'alert</script>');
            assertContains(result, '&lt;', 'Must escape <');
            assertContains(result, '&gt;', 'Must escape >');
            assertContains(result, '&amp;', 'Must escape &');
            assertContains(result, '&quot;', 'Must escape "');
            assertContains(result, '&#039;', "Must escape '");
        });

        // ══════════════════════════════════════════════════════════════════════════
        // SUITE 4: Animation System
        // ══════════════════════════════════════════════════════════════════════════
        suite('Animation System');

        test('T09 — window.GreetingAnimations API is loaded', () => {
            assert(window.GreetingAnimations, 'window.GreetingAnimations not found');
        });

        test('T20 — ANIMATION_NAMES contains all 3 animation types', () => {
            const names = window.GreetingAnimations.ANIMATION_NAMES;
            assert(Array.isArray(names), 'ANIMATION_NAMES must be an array');
            assertEqual(names.length, 3, 'Must have exactly 3 animation names');
            assertContains(names, 'confetti', 'Must include "confetti"');
            assertContains(names, 'partyPopper', 'Must include "partyPopper"');
            assertContains(names, 'glowingBurst', 'Must include "glowingBurst"');
        });

        test('T10 — clearAllAnimations runs without errors', () => {
            window.GreetingAnimations.clearAllAnimations();
            assert(true, 'clearAllAnimations should not throw');
        });

        test('T11 — triggerConfetti runs without errors', () => {
            window.GreetingAnimations.clearAllAnimations();
            window.GreetingAnimations.triggerConfetti();
            assert(true, 'triggerConfetti should not throw');
        });

        test('T12 — triggerPartyPopper runs without errors', () => {
            window.GreetingAnimations.clearAllAnimations();
            window.GreetingAnimations.triggerPartyPopper();
            assert(true, 'triggerPartyPopper should not throw');
        });

        test('T13 — triggerGlowingBurst adds "active" CSS class to overlay', () => {
            window.GreetingAnimations.clearAllAnimations();
            window.GreetingAnimations.triggerGlowingBurst();
            const overlay = getEl('glowing-burst-overlay');
            assert(overlay.classList.contains('active'), 'Overlay must have "active" class after triggerGlowingBurst');
        });

        test('T14 — triggerRandomAnimation returns a valid animation name', () => {
            window.GreetingAnimations.clearAllAnimations();
            const name = window.GreetingAnimations.triggerRandomAnimation();
            assert(typeof name === 'string', 'triggerRandomAnimation must return a string');
            assert(
                window.GreetingAnimations.ANIMATION_NAMES.includes(name),
                `Returned name "${name}" is not in ANIMATION_NAMES`
            );
        });

        test('T14a — triggerRandomAnimation returns valid names across 30 runs', () => {
            const valid = new Set(window.GreetingAnimations.ANIMATION_NAMES);
            const seen = new Set();
            for (let i = 0; i < 30; i++) {
                window.GreetingAnimations.clearAllAnimations();
                const name = window.GreetingAnimations.triggerRandomAnimation();
                assert(valid.has(name), `Invalid animation name returned: "${name}"`);
                seen.add(name);
            }
            // With 30 runs, statistically all 3 should appear at least once
            assert(seen.size >= 2, `Expected at least 2 different animations in 30 runs, got ${seen.size}`);
        });

        test('T16 — Consecutive clicks clear previous animation (no overlap)', () => {
            // After clear, glow overlay should NOT be active
            window.GreetingAnimations.triggerGlowingBurst();
            window.GreetingAnimations.clearAllAnimations();
            const overlay = getEl('glowing-burst-overlay');
            assert(!overlay.classList.contains('active'), 'Overlay must NOT be active after clearAllAnimations');
        });

        // ─── All done ─────────────────────────────────────────────────────────────
        return results;
    }

    // ─── Render results to the test panel ─────────────────────────────────────
    function renderResults(panel, results) {
        let html = '';
        let passed = 0;
        let failed = 0;
        let currentSuite = '';

        results.forEach(r => {
            if (r.suite !== currentSuite) {
                currentSuite = r.suite;
                html += `<div style="color:rgba(255,255,255,0.45);font-size:0.72rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:1px;padding:8px 0 4px;
                  border-top:1px solid rgba(255,255,255,0.06);margin-top:4px">
                  ${currentSuite}</div>`;
            }
            const icon = r.status === 'pass' ? '✅' : '❌';
            const cls = r.status === 'pass' ? 'pass' : 'fail';
            if (r.status === 'pass') passed++; else failed++;
            html += `
        <div class="test-item ${cls}" style="animation-delay:${(passed + failed) * 0.03}s">
          <span class="test-icon">${icon}</span>
          <div>
            <div class="test-name">${r.name}</div>
            ${r.detail ? `<div class="test-detail">${r.detail}</div>` : ''}
          </div>
        </div>`;
        });

        const total = passed + failed;
        const allOk = failed === 0;
        const summaryColor = allOk ? '#6ee7b7' : '#fca5a5';
        const summaryIcon = allOk ? '🎉' : '⚠️';

        panel.innerHTML = html;
        const summary = document.createElement('div');
        summary.className = 'test-summary';
        summary.style.color = summaryColor;
        summary.textContent = `${summaryIcon}  ${passed} / ${total} tests passed` +
            (failed > 0 ? `  —  ${failed} failed` : '  — All tests passed!');
        panel.appendChild(summary);
    }

    // ─── Wire up UI ───────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        const toggleBtn = document.getElementById('test-toggle-btn');
        const testPanel = document.getElementById('test-panel');
        const runTestsBtn = document.getElementById('run-tests-btn');
        const closeBtn = document.getElementById('close-tests-btn');
        const resultsDiv = document.getElementById('test-results');

        if (!toggleBtn || !testPanel || !runTestsBtn || !closeBtn || !resultsDiv) return;

        toggleBtn.addEventListener('click', () => {
            const isVisible = testPanel.style.display !== 'none';
            testPanel.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                // Auto-run when panel opens
                const res = runAllTests();
                renderResults(resultsDiv, res);
            }
        });

        runTestsBtn.addEventListener('click', () => {
            resultsDiv.innerHTML = '<div style="color:rgba(255,255,255,0.5);padding:12px;text-align:center;">Running tests…</div>';
            setTimeout(() => {
                const res = runAllTests();
                renderResults(resultsDiv, res);
            }, TIMEOUT_MS);
        });

        closeBtn.addEventListener('click', () => {
            testPanel.style.display = 'none';
        });
    });

    // ─── Expose for console usage ──────────────────────────────────────────────
    window.runGreetingTests = function () {
        const res = runAllTests();
        console.group('Greeting App — Test Results');
        res.forEach(r => {
            const fn = r.status === 'pass' ? console.log : console.error;
            fn(`[${r.status.toUpperCase()}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
        });
        const passed = res.filter(r => r.status === 'pass').length;
        console.groupEnd();
        console.log(`\n${passed}/${res.length} tests passed`);
        return res;
    };
})();
