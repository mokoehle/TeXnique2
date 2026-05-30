# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running Locally

No build system or package manager. Serve the `public/` directory with any static file server:

```bash
# Option 1: Python (built-in)
cd public && python3 -m http.server 8080

# Option 2: Firebase CLI (if installed)
firebase serve
```

Open `http://localhost:8080` in a browser. File changes take effect on browser refresh.

## Deploying

```bash
firebase deploy
```

## Architecture

This is a single-page, vanilla JS/HTML/CSS game. There is no build step, no bundler, no framework.

**Answer validation pipeline** (the core mechanic):
1. Player types LaTeX into `#user-input` textarea
2. `validateProblem()` in `index.js` normalizes the input via `normalizations.js` (regex replacements for equivalent LaTeX expressions)
3. KaTeX renders both the target and the player's output into DOM elements
4. `html2canvas` screenshots both rendered elements
5. `pixelmatch` compares the canvases pixel-by-pixel; `diff === 0` means correct

**Scoring**: `Math.ceil(latex.length / 10)` — longer formulas are worth more points.

**Problem lifecycle**: `problems.js` holds a flat array of `{title, description, latex}` objects. On game start, the array indices are shuffled into `problemsOrder`. Problems repeat cyclically when the player exhausts all of them (`problemNumber % problems.length`).

**Leaderboard**: Firebase Firestore collection `leaderboard`, documents with `{name, score, timestamp}`. Firestore rules currently allow unauthenticated reads and writes.

**Key files**:
- `public/assets/js/index.js` — all game logic, UI state, leaderboard
- `public/assets/js/problems.js` — the problem database (~200+ formulas)
- `public/assets/js/normalizations.js` — equivalent LaTeX substitutions applied before comparison
- `public/assets/js/firebase-config.js` — Firebase project credentials (public, Firestore only)
- `public/assets/style/style.css` — all styling

## Adding Problems

Add entries to the `problems` array in `problems.js`:

```js
{
    "title": "Name shown in UI",
    "description": "Internal note (not shown to player)",
    "latex": String.raw`\your{latex}{here}`
}
```

Points are awarded automatically based on `latex.length`. Always use `String.raw` to avoid double-escaping backslashes.

## Adding Normalizations

Add entries to the `normalizations` array in `normalizations.js`. A normalization is valid only if the two forms produce **visually identical** output and are both reasonable LaTeX usage. The replacement is applied to the player's input before pixel comparison.
