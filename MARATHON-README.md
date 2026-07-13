# Marathon AFK session — how to review when you return

**Dev server:** `http://localhost:3001`  
**Status log:** `STATUS-MARATHON.md`  
**Screenshots:** `.debug-screenshots/` (190+ PNGs)  
**Smoke report:** `.debug-screenshots/smoke-report.json`

## What was broken (fixed)

1. **Homepage WebGL dead** — remote HDRI `Environment` suspended the scene + 404s + postprocessing alpha wipe.  
   Fixed: opaque clear `#11111b`, local lights only, cosmic GLSL backdrop, liquid core, no EffectComposer.

2. **Landings felt basic** — thin demos + root Header chrome on immersive routes.  
   Fixed: each of 9 worlds is a full instrument; immersive chrome hides site Header/Footer.

## Routes to open

| URL | What |
|-----|------|
| `/` | WebGL instrument — strike / hold-to-resonate / materials / scroll helix tunnel |
| `/landings` | Gallery of 9 worlds (distinct CSS micro-theaters) |
| `/landings/editorial` | Magazine measure/ink/plates |
| `/landings/brutalist` | SYS.BRUTAL.07 paint floor 48×28, wrecking tools, hotkeys |
| `/landings/noir` | Cinema lamp + film HUD |
| `/landings/zen` | Full-viewport rake garden |
| `/landings/neon` | Rain city + weather modes |
| `/landings/paper` | Letterpress book + dog-ear turns |
| `/landings/atlas` | Fog-of-war cartography |
| `/landings/pulse` | Silent sequencer |
| `/landings/prism` | Spectral piano |

## Verify yourself

```bash
# server should already be on 3001
URL=http://localhost:3001 node scripts/iterate-loop.mjs
URL=http://localhost:3001 node scripts/smoke-interact.mjs
open .debug-screenshots/iter-*-home.png
open .debug-screenshots/iter-passP-*.png
```

## Background loops still running

- `scripts/marathon-forever.mjs` — re-screenshots every ~4 min
- Schedulers every 30–45 min — re-verify + polish weakest surface
- Dev Vite on :3001

## Code scale

- `src/components/landings/pages.tsx` — ~7.4k lines (9 instruments)
- `src/components/home/Stage.tsx` — ~1k lines WebGL stage
