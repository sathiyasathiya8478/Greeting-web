# Greeting Web App ✨

A **modern, premium greeting web application** built with pure HTML, CSS, and JavaScript.  
No build step or Node.js required — just open `index.html` in any browser.

---

## 📁 Project Structure

```
greeting/
├── index.html      ← Main page (app entry point)
├── style.css       ← Premium dark glassmorphism UI styles
├── animations.js   ← 3 background animation effects
├── app.js          ← Core UI / greeting logic
├── tests.js        ← In-browser test suite (20 tests)
└── README.md       ← This file
```

---

## 🚀 How to Run

### Option A — Open directly in browser (simplest)
Double-click `index.html` — it opens in your default browser.

### Option B — Serve locally (recommended, avoids CORS issues with fonts/CDN)
If you have **Python** installed:
```bash
# Python 3
python -m http.server 8080
# then open: http://localhost:8080
```

If you have **Node.js** installed:
```bash
npx serve .
# then open the URL shown
```

---

## 🧪 Running Tests

### Method 1 — Click the floating 🧪 button
A green 🧪 button appears at the bottom-right corner of the app.  
Click it → the test panel opens and **tests run automatically**.

### Method 2 — Browser Console
Open DevTools (F12) → Console tab → type:
```js
runGreetingTests()
```
All 20 test results will print to the console.

---

## ✅ Requirements Checklist

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Label "Enter Your Name" | ✅ |
| 2 | Input with placeholder "Type your name here" | ✅ |
| 3 | "Greet" button | ✅ |
| 4 | Displays "Hello [name]" below button on click | ✅ |
| 5 | Animation 1: Confetti burst | ✅ |
| 6 | Animation 2: Party popper (corner cannons) | ✅ |
| 7 | Animation 3: Glowing burst (CSS overlay) | ✅ |
| 8 | Random single animation per click | ✅ |
| 9 | No animation overlap — cleared before next | ✅ |
| 10 | Centered, visually attractive UI | ✅ |
| 11 | Full project structure | ✅ |
| 12 | Test suite covering all features | ✅ |

---

## 🎨 Features

- **Dark glassmorphism** card UI with blur effects
- **Gradient typography** and premium Inter font
- **Floating background particles** animation
- **Three exclusive animations** with guaranteed no-overlap
- **Enter key support** for quick greeting
- **XSS-safe** HTML escaping for user input
- **In-browser test panel** with 20 automated tests
