# CLAUDE.md — KP-Demo AEM Edge Delivery Services Project

> For agent-neutral instructions see @AGENTS.md. This file contains Claude Code–specific guidance.

---

## Project Overview

This is an **AEM Edge Delivery Services (EDS)** project based on the [adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate). It uses vanilla JavaScript (ES6+), CSS3, and HTML5 — no frameworks, no build steps, no transpiling.

- **Backend**: `*.aem.live`
- **Dev server**: `http://localhost:3000`
- **Linting**: ESLint (Airbnb) + Stylelint (standard)

---

## Quick Start

```bash
npm install
npx -y @adobe/aem-cli up --no-open --forward-browser-logs   # dev server on :3000
npm run lint          # check lint
npm run lint:fix      # auto-fix lint issues
```

---

## Project Structure

```
├── blocks/               # One folder per block — {name}.js + {name}.css
│   ├── cards/
│   ├── cards-resources/
│   ├── columns/
│   ├── columns-coverage/
│   ├── columns-support/
│   ├── columns-video/
│   ├── footer/
│   ├── fragment/
│   ├── header/
│   ├── hero/
│   ├── hero-banner/
│   ├── hero-welcome/
│   └── tabs-features/
├── scripts/
│   ├── aem.js            # Core AEM library — NEVER MODIFY
│   ├── scripts.js        # Global JS, main decoration entry point
│   └── delayed.js        # Deferred/martech loading
├── styles/
│   ├── styles.css        # Critical/LCP styles
│   ├── lazy-styles.css   # Below-fold styles
│   ├── fonts.css         # Font definitions
│   └── brand.css         # Brand tokens
├── fonts/
├── icons/
├── head.html
└── 404.html
```

---

## Claude Skills to Use

### /review
Run before every PR. Checks code quality, style consistency, accessibility, and AEM EDS conventions.

### /security-review
Run when adding new scripts, third-party integrations, or anything touching `delayed.js` or `head.html`. Everything here is public client-side code.

### /simplify
Run after implementing a new block or feature. Ensures no unnecessary abstractions, removes dead code, and keeps block JS/CSS self-contained.

### /commit
Use for generating well-structured commit messages that follow the project's conventions before pushing to a feature branch.

---

## Claude Behavior Rules

### Never modify `scripts/aem.js`
This is the core AEM library. All customizations go in `scripts/scripts.js`.

### Block implementation pattern
Every block must export a single default `decorate(block)` function:
```js
export default async function decorate(block) {
  // 1. Load dependencies
  // 2. Extract configuration
  // 3. Transform DOM
  // 4. Add event listeners
}
```

### Inspect before assuming
Before writing block decoration logic, inspect the actual HTML:
```bash
curl http://localhost:3000/path/to/page.plain.html
```
Authors may omit or add fields — always handle this gracefully.

### CSS scoping — always scope to block
```css
/* Bad */
.item-list { ... }

/* Good */
.cards .item-list { ... }
```
Never use `.{blockname}-container` or `.{blockname}-wrapper` — those are reserved for sections.

### Mobile-first responsive CSS
```css
/* Mobile default */
.block { ... }

/* Tablet */
@media (min-width: 600px) { ... }

/* Desktop */
@media (min-width: 900px) { ... }

/* Wide */
@media (min-width: 1200px) { ... }
```

### Three-phase loading — respect the phases
- **Eager**: Only what is needed for LCP (first section)
- **Lazy**: Everything else (header, footer, remaining sections)
- **Delayed**: Martech, analytics — goes in `delayed.js`

Do not load heavy resources in the eager phase.

### No frameworks, no build steps
- Vanilla JS (ES6+) only
- No React, Vue, Svelte, Tailwind, etc.
- Always include `.js` extensions in imports
- Use Unix line endings (LF)

### Draft content for testing
If no CMS content exists, create static HTML in `drafts/` and start the dev server with:
```bash
npx -y @adobe/aem-cli up --html-folder drafts
```

---

## Environment URLs

Given `owner = vilashvargheseNC`, `repo = KP-demo`, `branch = <feature-branch>`:

| Environment | URL |
|---|---|
| Local dev | `http://localhost:3000` |
| Feature preview | `https://{branch}--KP-demo--vilashvargheseNC.aem.page/` |
| Production preview | `https://main--KP-demo--vilashvargheseNC.aem.page/` |
| Production live | `https://main--KP-demo--vilashvargheseNC.aem.live/` |

---

## PR Checklist

Before opening a pull request:
- [ ] `npm run lint` passes with no errors
- [ ] Tested locally at `http://localhost:3000`
- [ ] PageSpeed score of 100 on the feature preview URL
- [ ] PR description includes a link to `https://{branch}--KP-demo--vilashvargheseNC.aem.page/{path}`
- [ ] No sensitive data committed (API keys, tokens, passwords)
- [ ] Images and assets are optimized before committing to git
- [ ] `/review` skill run and issues resolved
- [ ] `/security-review` run if new scripts or third-party integrations added

---

## Key References

- [AEM EDS Documentation](https://www.aem.live/docs/)
- [Markup: Sections & Blocks](https://www.aem.live/developer/markup-sections-blocks)
- [Markup Reference](https://www.aem.live/developer/markup-reference)
- [Performance Best Practices](https://www.aem.live/developer/keeping-it-100)
- [Developer Tutorial](https://www.aem.live/developer/tutorial)
- [Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [David's Model](https://www.aem.live/docs/davidsmodel)
- [AI Coding Agents Tips](https://www.aem.live/developer/ai-coding-agents)

Search docs: `site:www.aem.live <keyword>`
Full-text doc search:
```bash
curl -s https://www.aem.live/docpages-index.json | jq -r '.data[] | select(.content | test("KEYWORD"; "i")) | "\(.path): \(.title)"'
```
