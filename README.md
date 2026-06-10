# Electric Field of Dreams

A single-screen [SceneryStack](https://scenerystack.org/) simulation. Place charged
particles in a box and watch them interact through Coulomb's law and an adjustable
uniform external field, with the resulting electric field visualized as a grid of arrows.

This is a TypeScript / SceneryStack port of the original
"Electric Field of Dreams" simulation.

## Quick Start

```bash
npm install
npm run icons    # generate PNG icons + favicon from public/icons/icon.svg
npm start        # dev server → http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `npm start` / `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | TypeScript type check only |
| `npm run lint` | Biome lint check |
| `npm run format` | Auto-format all files |
| `npm run fix` | Lint + auto-fix |
| `npm run icons` | Regenerate PNG icons from `public/icons/icon.svg` |
| `npm run clean` | Remove `dist/` |

## How to use the simulation

- **Add / Remove** buttons create or remove charged particles. Choose the **charge**
  (positive / negative) and **mass** before adding.
- **Drag** any particle to reposition it; while dragging it is detached from the
  physics so forces don't act on it.
- The **External Field** panel has a draggable arrow that sets a uniform background
  field's direction and magnitude.
- The **field density** slider controls how many field-sample arrows are drawn.
- **Play / Pause / Step** and **Reset All** control the time evolution.

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [SceneryStack](https://scenerystack.org/) | ^3.0.0 | Simulation framework |
| [Vite](https://vitejs.dev/) | ^8 | Build tool + dev server |
| [TypeScript](https://www.typescriptlang.org/) | ^6 | Type-safe JavaScript |
| [Biome](https://biomejs.dev/) | ^2.4 | Linting + formatting |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | ^1 | PWA + service worker |

## Git Hooks

Activate the pre-commit hook once after cloning:

```bash
git config core.hooksPath .githooks
```

## License

MIT

## Contributing

See [OpenPhysics contributing guidelines](https://github.com/OpenPhysics/.github/blob/main/CONTRIBUTING.md).
Report bugs via GitHub Issues; use org issue templates.
