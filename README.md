# Chromask

Endless vertical climber with additive color-mixing mechanics. Built with Phaser 3 + TypeScript.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Controls

| Action | Keys |
|--------|------|
| Move | Arrow keys / WASD |
| Jump | Up / W / Space |
| Toggle Red | 1 |
| Toggle Green | 2 |
| Toggle Blue | 3 |

## How to Play

Platforms are only solid when their color **exactly matches** your active color.

Toggle R, G, B to mix colors additively:
- Red + Green = Yellow
- Red + Blue = Magenta
- Green + Blue = Cyan
- All three = White

Climb as high as you can. Fall off the screen = game over.

## Build

```bash
npm run build    # Production build in dist/
npm run preview  # Preview production build
```
