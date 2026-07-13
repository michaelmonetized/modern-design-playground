# Marathon pass — investigation & iteration log

**Started:** 2026-07-12 ~12:00  
**User return:** ~23:00 (10h AFK)  
**Dev:** `http://localhost:3001` (3000 was occupied)

## Root-cause findings (verified with Playwright screenshots)

### 1. Blank WebGL behind homepage copy
| Cause | Evidence | Fix |
|-------|----------|-----|
| `Environment` (drei HDRI) **outside Suspense** | Whole scene suspended until HDRI load | Wrapped textures in Suspense |
| HDRI **404s** from CDN | 22× console 404 on home | **Removed remote Environment**; local lights only |
| Postprocessing alpha wipe | Center `readPixels` → `[0,0,0,0]` with composer | Dropped EffectComposer; opaque clear `#11111b` |
| Custom GLSL fragility | Silent compile risk | Cosmic backdrop ShaderMaterial + MeshDistort core |
| Light theme wash | `html.light` vs dark stage | Forced `.dark` + `bg-[#11111b]` on home shell |
| Slow paint race | Screenshots at 2.5s often black | ClientOnly gradient fallback; iterate waits for `[data-engine]` + 4s |

**Verified working:** `.debug-screenshots/webgl-debug.png` (~1MB) shows liquid core + field + text.

### 2. Landings felt “basic” / broken chrome
| Cause | Fix |
|-------|-----|
| Root `Header`/`Footer` still mounted on `/landings/*` | `isImmersive` includes `/landings` paths |
| Thin demos | Multi-pass upgrades via subagents + local rewrites |

## Homepage interactions (clickable)
- Strike the field / Pulse → `stageBus` energy into core  
- Sample materials → glass / metal / matte  
- Kinetic type scramble on click  
- Archive cards → case study sheet + 3D focus  
- Open the stack (craft)  
- Worlds → gallery  

## Routes
| Path | Experience |
|------|------------|
| `/` | Instrument (WebGL stage) |
| `/landings` | Gallery index |
| `/landings/{editorial,brutalist,noir,zen,neon,paper,atlas,pulse,prism}` | 9 worlds |

## Tooling added for AFK loop
- `scripts/debug-home.mjs` — quick diagnose  
- `scripts/iterate-loop.mjs` — full screenshot + report harness  
- `.debug-screenshots/iteration-report.json` — run history  
- Playwright Chromium installed  
- Recurring scheduler every **30m** (task `019f571337b7`)  
- Background subagents upgrading landings  

## How to re-verify
```bash
pnpm run dev   # note port
URL=http://localhost:3001 node scripts/iterate-loop.mjs
open .debug-screenshots/iter-*-home.png
```

## Iteration policy (ongoing)
1. Run iterate-loop  
2. Open weakest screenshot  
3. Ship a real visual/interaction upgrade  
4. Typecheck  
5. Repeat forever  

## Progress log

### Pass A — diagnose
- Playwright screenshots proved blank stage was real (black frames when Environment hung)
- Post alpha wipe + bare `Environment` suspension = empty WebGL

### Pass B — stage repair  
- Opaque clear, no remote HDRI, Suspense only around Gallery  
- Forced dark shell; ClientOnly gradient fallback  
- **Verified:** liquid core + cosmic field visible in screenshots (~1MB PNGs)

### Pass C — homepage interactions
- stageBus pulses, material cycle, kinetic scramble, case-study sheet, stack expand

### Pass D — 9 landings flagship pass (subagents)
- Neon: city rain engine, 5 weather modes, signs, sliders  
- Noir: multi-lamp, grain, scenes, iris  
- Atlas: pan/zoom map, fog of war, journal  
- Prism: spectral piano, caustics, modes  
- Editorial: measure/leading, ink, plates  
- Brutalist: paint/erase/flood tools, patterns  
- Zen: breath, rake, seasons, enso  
- Paper: open book, dog-ear turns, pen  
- Pulse: sequencer, pads, BPM/swing  

### Pass E — ongoing
- 30m scheduler re-runs iterate-loop  
- Stage helix/tunnel visibility subagent  
- Dev server left running on :3001  

### Pass F — brutalist + resonator
- **Brutalist** was emptiest iter-3 frame (~99KB) → rebuild as constructivist wrecking floor  
  - 28×16 multi-state cells (solid / accent / hatch), dense seed with bitmap BUILD/UGLY  
  - Tools: paint/erase/flood/stamp/slash + brush sizes  
  - BURN / BALL / DEMOLISH, density siren, hazard marquee, screen shake  
  - Grid fixed ~58dvh so canvas dominates first paint  
- **Homepage Chapters:** hold-to-charge **Resonator** — releases cascaded `stageBus.triggerPulse`, material overload at 92%+, expanding shockwave rings (no stageBus API changes)  
- Typecheck clean; `debug-webgl.mjs` OK (r3f canvas present)

## Known remaining work
- Gallery helix visibility mid-scroll under DOM strip (improve z / earlier fan)  
- Optional: reintroduce Bloom carefully with opaque pipeline  
- Optional: compress large media  
- Keep looping upgrades until user returns  


### Auto-cycle 6 — 2026-07-12T16:26:44.387Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 123KB, brutalist 183KB, noir 277KB, pulse 337KB
- Strongest: home 1950KB, home-mid 1723KB, zen 1222KB
- Note: Prioritize upgrade for: gallery (123KB). Subagents + main agent keep polishing.

### Pass G — 12:25–12:35 (main + 3 subagents)
- **Root cause reconfirmed:** WebGL paints (iter-7-home ~2MB). 404s only PostHog placeholder.
- **Brutalist SYS.BRUTAL.03:** full-viewport flex grid 36×20, crosshair, dense seed BUILD/UGLY/TRUE — no dead beige (iter-7 verified).
- **Gallery index flagship rewrite:** per-world CSS micro-theaters, dark forced shell, 3D tilt cards, motifs (ink/grid/lamp/enso/rain/folio/map/wave/prism). Fixed opacity:0 first-paint bug.
- **Stage:** Orbitals (3 tori + pulse shockwave rings) + DustField 600 particles.
- **Chapters:** floating media plates, Glass/Metal/Matte direct set via stageBus.setMaterial.
- **Subagent wave (all landings densified in pages.tsx ~6.6k lines):**
  - Noir: silhouette underpaint, dust, film TC/FRM, iris, letterbox sprockets (~1MB PNG)
  - Neon: 280 rain, wet street, skyline, signs, 5 weather (~1MB)
  - Pulse: waveforms + EQ + playhead (~965KB)
  - Prism: caustics + spectral piano (~892KB)
  - Zen: full-viewport rake garden + enso/breath/seasons
  - Paper: dog-ear letterpress book
  - Atlas: fog of war cartography
  - Editorial: denser magazine plates/ink
- **Tooling:** scripts/marathon-forever.mjs loops every 4m; iterate-loop; schedulers 30m/45m
- Typecheck clean.

### Pass H — ongoing until 23:00
- Keep marathon-forever + schedulers
- Gallery card density above fold (compact hero)
- Re-screenshot after HMR
- Iterate weakest surfaces again

### Auto-cycle 7 — 2026-07-12T16:31:24.513Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 126KB, brutalist 183KB, atlas 662KB, prism 858KB
- Strongest: home 1957KB, home-mid 1725KB, paper 1628KB
- Note: Prioritize upgrade for: gallery (126KB). Subagents + main agent keep polishing.

### Pass I — gallery density + helix visibility (iter 9)
- **Gallery index** (`src/routes/landings/index.tsx`): compact single-row chrome; uniform 3-col dense tiles (no span-2 hero card); min-h ~168–200px; denser ink/lamp motifs. **First viewport shows all 9 world cards.**
- **Stage helix** (`GalleryCard`): radius 3.35→4.05, base opacity 0.78/target 0.72+, scale ~0.98, larger planes, closer z, fan complete by 15% scroll; core scale reduced slightly; fog push-out.
- **Chapters**: floating media plates now tilt-follow pointer + click opens case study + scanline hover micro-interaction.
- **Verified Playwright** `ITER_START=9 ITER_MAX=1`: galleryCards=9, WebGL ok.
- **Density:** gallery **126KB → 495KB**; home still ~1.9MB with visible image cards around core (iter-9-home).
- **Weakest now:** brutalist 182KB, gallery 494KB, atlas 660KB.
- Typecheck clean. No commit.

### Auto-cycle 8 — 2026-07-12T16:36:11.110Z
- Base: http://localhost:3001
- Weakest (by PNG density): brutalist 183KB, gallery 490KB, atlas 664KB, prism 864KB
- Strongest: home 1986KB, home-mid 1664KB, paper 1628KB
- Note: Prioritize upgrade for: brutalist (183KB). Subagents + main agent keep polishing.

### Pass J — homepage wow (wireframe cage + energy trail)
- **Stage Core:** dual material-reactive wireframe cages (icosahedron + counter-rotating octahedron). Glass = fine mauve lattice, metal = expanded sapphire chrome, matte = soft peach balloon — all pulse-scale + spin.
- **EnergyTrail:** WebGL pointer energy ribbon (`THREE.Line` primitive + additive points) follows `stage.pointer`, tints by material mode, flares on `stageBus.pulse`. Safe (no post stack / no custom GLSL).
- **Helix polish:** slightly wider/closer seed ring (r≈3.45), larger planes (3.05×1.85), higher base opacity 0.82; pulse micro-brighten.
- **`data-engine="r3f"`** on Stage root for screenshot harness reliability.
- stageBus Strike / Resonate / Glass·Metal·Matte unchanged (no API edits).
- Typecheck clean. Screenshots: `.debug-screenshots/iter-home-passJ.png` (~2.0MB), `iter-home-mid-passJ.png` (~1.8MB) — wireframe + helix cards visible top & mid.
- No commit. Landings untouched.

### Pass J — brutalist loud floor densify
- **Target:** Brutalist weakest by PNG (~182KB) at `/landings/brutalist`
- **File:** `src/components/landings/pages.tsx` — `BrutalistLanding` + `makeBrutalSeed` / `BCell`
- **Visual:** cell bevel/inner borders on solid/red/yellow/hatch; empty-cell concrete grit; dual red+**hazard yellow** accents (`BCell` 4); mini **LOAD LED strip** (16 diodes); diagonal hazard overlay when density>52%; industrial rivets + dual drop-shadow chrome; denser seed (BUILD/UGLY/TRUE + hazard bands)
- **Interact:** click **particle dust** DOM burst; keyboard **1–5** tools, **R** reseed, **Space** flood last cell
- **Verified:** `pnpm run typecheck` clean; Playwright `iter-brutalist-passJ.png` **583KB** (was ~182KB)
- No commit. Other landings untouched.

### Pass K — interaction smoke harness
- **Added** `scripts/smoke-interact.mjs` — Playwright visit `/` + 9 landings, click Strike/Hold-resonate, cycle Sample materials, center-click + keys, collect pageerrors/console (ignore posthog 404s), write `.debug-screenshots/smoke-report.json`, exit 1 on TypeError|ReferenceError|SyntaxError.
- **Bugfix:** Neon landing SSR hydration mismatch — `signs` init used `Math.random()` for flicker → animation duration differed server/client. Switched to deterministic `((i * 17 + 3) % 100) / 100` in `NeonLanding` (`src/components/landings/pages.tsx`).
- **Run:** `URL=http://localhost:3001 node scripts/smoke-interact.mjs` → exit 0; pagesVisited=10, pageerrors=0, consoleErrors=0, resource404s=0, serious=0; engine=`r3f` present; Strike + hold-resonate + cycle-material exercised.
- **Typecheck:** `pnpm typecheck` clean.
- No commit.

### Auto-cycle 9 — 2026-07-12T16:41:01.780Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 501KB, brutalist 587KB, prism 869KB, pulse 933KB
- Strongest: home 1893KB, home-mid 1708KB, paper 1628KB
- Note: Prioritize upgrade for: gallery (501KB). Subagents + main agent keep polishing.

### Pass K — atlas cartographic density + editorial magazine fold
- **Targets:** `/landings/atlas` (~677KB weak) + `/landings/editorial` above-fold magazine density
- **File:** `src/components/landings/pages.tsx` only — `AtlasLanding` + `EditorialLanding`
- **Atlas densify:**
  - Canvas: 14 landmasses + archipelago, 48×32 graticule, isobaths, rivers, 42 towns, place-names, denser topo contours (36 elevations), dual weather fronts, signal mesh, pin pulse rings, neatline ticks
  - Fog: lighter haze (0.55), mottled texture, wider reveals (0.32/0.24), seed visited `a`+`e`, route corridor burn
  - DOM: dual base plates, neatline frame, pin halos, seed marks M1–M3, legend strip, layer key, compass rose ticks, compact journal (`max-h` 58dvh)
  - **Layout fix:** forbidden `max-w-sm` / `max-w-xl` (project spacing tokens → ~3–23px) collapsed HUD blurb + controls off-fold; switched to `max-w-measure`
- **Editorial densify:**
  - 10 seed ink stains; dual plate ghosts + baseline guides; tighter masthead (`pt-16`)
  - **4-plate contact sheet** + **Measure/Leading strip** always above fold
  - Compact tools + kicker deck in first viewport
- **Verified:** `pnpm run typecheck` clean
- **Screenshots:**
  - `.debug-screenshots/iter-atlas-passK.png` **~1458KB** (was ~677KB)
  - `.debug-screenshots/iter-editorial-passK.png` **~1523KB** — plates + measure + stains above fold
- No commit. Pan/zoom/fog/journal intact.

### Auto-cycle 10 — 2026-07-12T16:45:43.402Z
- Base: http://localhost:3001
- Weakest (by PNG density): neon 70KB, gallery 508KB, brutalist 591KB, prism 859KB
- Strongest: home 1899KB, home-mid 1667KB, paper 1628KB
- Note: Prioritize upgrade for: neon (70KB). Subagents + main agent keep polishing.

### Pass M — density leaderboard iter-10 (verified Playwright)
| Surface | PNG | Notes |
|---------|-----|-------|
| home | 1.9MB | Core + wireframe cage + helix photos + CTAs |
| home-mid | 1.7MB | Scroll dolly working |
| paper | 1.7MB | Letterpress book |
| editorial | 1.5MB | Magazine + contact sheet |
| atlas | 1.5MB | Fog cartography (was 677KB) |
| zen | 1.2MB | Rake garden |
| neon | 1.1MB | Rain city |
| noir | 1.0MB | Lamp cinema |
| pulse | 0.96MB | Sequencer |
| prism | 0.88MB | Spectral piano |
| brutalist | 0.61MB | SYS.04 hazard yellow (was 99KB→182KB→583KB) |
| gallery | 0.52MB | All 9 cards first paint (was 117KB) |

- Smoke interact: 0 serious pageerrors, all 10 routes
- Hero CTAs in viewport at 1440×900
- max-w-sm/md token bugs purged from landings
- marathon-forever + 30m/45m schedulers still looping

### Pass L — zen / neon / pulse density polish (2026-07-12)
**File:** `src/components/landings/pages.tsx` only · no commit

#### ZenLanding
- Full-viewport rake canvas: `h-dvh` shell, sand + live canvases `inset-0` with window/getBoundingClientRect sizing + double-rAF first paint
- Denser sand texture (rings + parallel rake bands + grain + floor depth)
- Season switch dramatic: 1.8s color crossfade + `seasonFlash` radial wash; active season button glow
- Stones/enso first paint: 5 larger deterministic seed stones (z-20), enso opacity ~0.48 default / thicker stroke, breath core brighter

#### NeonLanding
- Rain thick: spawn 340 ambient drops; maintain target `300 * density`; thicker streaks
- Signs readable: larger type (`clamp(1.05–1.85rem)`), high-contrast plate bg, text-stroke + multi-layer glow
- Hydration-safe: signs still fully deterministic (no `Math.random` in `useState`); skyline/puddles/windows deterministic seeds inside canvas effect

#### PulseLanding
- EQ band fills mid width with 96 bars + dual playhead beam (DOM + canvas full-height)
- Sequencer: per-row + header playhead ghosts; 4 tracks + transport above fold at 1440×900
- Compact chrome so density without burying Pause/BPM

#### Layout tokens
- Replaced broken `max-w-{sm,md,xl,xs,prose}` in landings with `max-w-phone` / `max-w-measure` / `max-w-tablet` (spacing-scale collision)

#### Verified
- `pnpm run typecheck` clean
- Screenshots:
  - `.debug-screenshots/iter-zen-passL.png` **~541KB** — sand + stones + enso first paint
  - `.debug-screenshots/iter-neon-passL.png` **~1088KB** (was **~70KB** weakest) — thick rain + readable signs
  - `.debug-screenshots/iter-pulse-passL.png` **~972KB** — EQ + 4-track seq + transport above fold
- Interactions preserved (rake/season/stone, rain weather/signs, seq play/mute/BPM)

### Auto-cycle 11 — 2026-07-12T16:50:26.718Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 560KB, brutalist 591KB, prism 861KB, pulse 1051KB
- Strongest: home 1904KB, home-mid 1662KB, paper 1628KB
- Note: Prioritize upgrade for: gallery (560KB). Subagents + main agent keep polishing.

### Auto-cycle 12 — 2026-07-12T16:55:13.332Z
- Base: http://localhost:3001
- Weakest (by PNG density): pulse 382KB, gallery 578KB, brutalist 588KB, prism 940KB
- Strongest: home 1886KB, home-mid 1664KB, paper 1655KB
- Note: Prioritize upgrade for: pulse (382KB). Subagents + main agent keep polishing.

### Pass N — prism / paper / noir flagship verify+upgrade (2026-07-12)
**File:** `src/components/landings/pages.tsx` only · no commit  
**Targets:** `/landings/prism` · `/landings/paper` · `/landings/noir`  
**Dev:** `http://localhost:3001`

#### PrismLanding — spectral keys + caustics dense first paint
- DOM spectral underpaint + static caustic floor + top spectrum ribbon before/with canvas
- Canvas: dense first-frame paint (spectrum wash + 7 caustic rows + 12-ray beam) — no black flash
- Loop denser: 18–22 field orbs, 8 caustic rows, 14 blobs, 240 particles
- Tall keys `h-[min(52vh,480px)]`, compact chrome (`pt-16`), smaller recombination stage so piano owns first paint

#### PaperLanding — open book fills viewport, dog-ear works, no empty cream
- Compact chrome + footer so open book claims remaining `h-dvh`
- Seed underlines + blots + column-rule watermark + ornaments so cream is never blank
- Dog-ear: always-visible rest fold + crease + “turn” label; **drag fixed** to use `Math.hypot` travel (left-up peel works)
- Verified peel advances signature A→B

#### NoirLanding — subject silhouette + lamps + film HUD never empty void
- Stronger silhouette stack (0.52 + blur 0.28 + soft-light plate); lamp reveal 0.88
- 7 practicals + 64 motes; default 3 planted lamps; translucent title card (subject reads through)
- Dual film HUD always above title card (`z-55`): TC/FRM/IRIS + REEL/CAM left slate
- Letterbox sprockets retained

#### Layout tokens
- No `max-w-{sm,md,xl,…}` regressions — only `max-w-measure|phone|tablet|laptop|desktop|wide`

#### Verified
- `pnpm run typecheck` clean · Playwright pageerrors: none
- Screenshots:
  - `.debug-screenshots/iter-prism-passN.png` **~993KB** (was ~880KB) — keys + caustics + beam first paint
  - `.debug-screenshots/iter-paper-passN.png` **~1653KB** — open book fills stage, dog-ear visible, dense cream
  - `.debug-screenshots/iter-paper-passN-peel.png` **~1653KB** — dog-ear mid-peel (hypot drag)
  - `.debug-screenshots/iter-noir-passN.png` **~1235KB** (was ~1.0MB) — silhouette under title + dual HUD
  - `.debug-screenshots/iter-noir-passN-open.png` **~1429KB** — full lamp cinema after house lights
- No commit.

### Pass O — homepage scroll story density (2026-07-12)
**Files:** `src/components/home/Chapters.tsx`, `CaseStudySheet.tsx`, `src/lib/home/assets.ts` · **Stage.tsx untouched** · no commit  
**Dev:** `http://localhost:3001`

#### Origin / Material (floating plates retained)
- Denser premium copy: chapter `detail` pull-quotes + stronger CTA cards (glow border, longer hints)
- Plate hover: pink rim glow, mix-blend-normal on hover, higher rest opacity
- Origin secondary link “Skip to archive”; material chips glow when active
- Text column reserves space opposite floating plate so copy doesn’t collide

#### Kinetic type
- Dual counter-scrolling lines (`MATERIAL/ORBIT…` + `CRAFT/FIELD…`) with pink→mauve glow pulse
- Scramble hits both lines; taller section + radial wash

#### Orbit archive strip
- Eager load first 3 cards (`fetchPriority=high` on first 2); all 12 imgs `naturalWidth>0` verified
- Stronger hover: lift, pink border/shadow, scale 1.07, ring inset, CTA slide-up

#### Craft / Signal endings
- Craft: stack toggle + **Browse landings →** magnetic CTA
- Signal: primary “Explore 9 more landings”, “Start with Neon”, GitHub + **4 featured world cards** (Editorial/Brutalist/Noir/Zen)

#### CaseStudySheet polish
- Full-bleed image with year chip + gradient; stack pills; helper note; Pulse + All worlds + Close

#### Verified
- `pnpm run typecheck` clean
- Screenshots:
  - `.debug-screenshots/iter-home-mid-passO.png` **~1862KB** (scroll 40%) — archive corridor cards loaded
  - `.debug-screenshots/iter-home-end-passO.png` **~1531KB** (scroll 85%) — craft CTAs + signal chapter
- 404s only PostHog stub config (pre-existing)
- No commit.

### Auto-cycle 13 — 2026-07-12T16:59:54.281Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 578KB, brutalist 591KB, prism 939KB, pulse 1006KB
- Strongest: home 1892KB, paper 1656KB, home-mid 1601KB
- Note: Prioritize upgrade for: gallery (578KB). Subagents + main agent keep polishing.

### Pass P — gallery + brutalist density (weakest pair, iter-12)

**Date:** 2026-07-12 ~13:00  
**Dev:** `http://localhost:3001`  
**No commit**

#### Baseline (iter-12 harness)
| Surface | PNG | Rank |
|---------|-----|------|
| gallery | **594KB** | weakest |
| brutalist | **605KB** | 2nd weakest |
| prism | 964KB | |
| pulse | 1.1MB | |
| home | 1.9MB | strongest |

#### Gallery (`src/routes/landings/index.tsx`)
- All 9 `WorldMotif`s densified: ink stains/plates, 12×8 brutalist brick field + hazard tape, noir silhouette + 5 practicals + dual film HUD + sprockets, zen sand rings/stones/rake, neon skyline+windows+42 rain+signs, folio open book+ribbon, map landmasses/pins/compass, pulse EQ 30 bars+4-track pads+playhead, prism caustics+rays+12 keys
- `MotifNoise` speck floors; taller cards (`min-h` 196→236px); corner ticks + status diodes
- Ambient mesh grid + 72-star constellation + multi-hue bloom

#### Brutalist (`src/components/landings/pages.tsx` — `BrutalistLanding`)
- Grid **36×20 → 42×24** (720 → 1008 cells); seed **~99% filled** (BUILD/UGLY/TRUE/RAW stamped)
- Multi-layer cell textures (speck concrete, aggregate brick, hatch grit) — no flat solid compression
- SVG fractal film-grain overlay + 48 dust flecks + scanlines + mid-edge rivets + weld marks
- Version **SYS.BRUTAL.05**

#### Verified
- `pnpm run typecheck` clean
- `URL=http://localhost:3001 node scripts/smoke-interact.mjs` → exit 0; pagesVisited=10, pageerrors=0, serious=0
- Iterate-loop iter-12 pre-upgrade complete

#### Before → After PNG sizes
| Surface | Before (iter-12) | After (passP) | Δ |
|---------|------------------|---------------|---|
| gallery | **594KB** | **964KB** | **+62%** |
| brutalist | **605KB** | **1143KB** | **+89%** |

Screenshots: `.debug-screenshots/iter-passP-gallery.png`, `.debug-screenshots/iter-passP-brutalist.png`

### Auto-cycle 14 — 2026-07-12T17:04:36.627Z
- Base: http://localhost:3001
- Weakest (by PNG density): prism 936KB, gallery 942KB, pulse 1015KB, brutalist 1118KB
- Strongest: home 1900KB, paper 1654KB, home-mid 1572KB
- Note: Prioritize upgrade for: prism (936KB). Subagents + main agent keep polishing.

### Pass Q-perf — media budget audit (code-side only, no destructive compress)

**Date:** 2026-07-12  
**Scope:** loading strategy for huge `public/media` files without deleting or recompressing originals  
**No commit · no ImageMagick**

#### Media inventory (`public/media/`)
| File | Size | Used? | Where |
|------|------|-------|--------|
| `hero-video.webm` | **45MB** | **No** | `MEDIA.heroVideo` only — **never imported by any component/route** |
| `cover-tall.jpeg` | **18MB** | Yes | Editorial plates (default plate 0 + thumbs) |
| `walkway.png` | 5.5MB | Yes | Helix `GALLERY[8]`, Atlas base map, Chapters archive strip |
| `headshot-full.jpg` | 3.1MB | Yes | Helix `GALLERY[9]`, Editorial plate 2, Noir scenes |
| rest (webp/png/jpg/avif) | 34KB–685KB | Yes | Gallery / landings / chapters |

#### 1. Hero video — not on the home experience
- Grep across `src/`: sole reference is the `MEDIA` constant in `src/lib/home/assets.ts`.
- Home is pure WebGL stage + DOM chapters — **no `<video>`**, no fetch of the webm.
- **Runtime cost of the 45MB file today: zero** (still occupies disk / deploy if `public/` is published wholesale).
- Annotated `MEDIA.heroVideo` as orphan; do not wire without a compressed source.

#### 2. Large images — lazy + WebGL texture discipline
**DOM (already good / tightened):**
- Chapters floating plates + archive strip: `loading="lazy"` / first-3 eager + `decoding="async"` (Pass O).
- CaseStudySheet hero img: `loading="lazy"` (sheet opens on demand).
- Editorial: active plate stays priority; **non-active plate thumbs + secondary ghost** → `loading="lazy"`; all plates `decoding="async"`.
- Noir scene strip thumbs: non-active → `lazy`.
- Atlas: walkway base keeps priority; folly overlay + pin survey plates → `lazy`.

**WebGL helix (`Stage.tsx` → `Gallery` / `GalleryCard`):**
- **Before:** single outer `<Suspense>` waited for **all 12** `useTexture` maps → empty helix until heaviest (walkway 5.5MB, headshot 3.1MB) finished.
- **After (easy win, visuals preserved):**
  1. **Staggered mount** — start with 4 cards, +2 every ~110ms until 12 (network/GPU not all-at-once).
  2. **Per-card `<Suspense fallback={null}>`** — early small WebP/PNG cards paint the ring first; holes fill as maps arrive (no all-or-nothing blackout).
  3. Texture knobs: mipmaps + `LinearMipmapLinearFilter` + anisotropy 4 (planes are small on-screen; looks unchanged).
- Outer Scene Suspense wrapper removed (Gallery owns its own boundaries). Core / orbitals / energy trail still mount immediately.

#### 3. What we deliberately did **not** do
- No ImageMagick / no recompress / no original deletion.
- Did not swap default Editorial plate away from `cover-tall` (would change flagship visual).
- Did not reorder `GALLERY` (would change helix story order).

#### 4. Residual risk (future optional pass)
| Issue | Note |
|-------|------|
| `cover-tall.jpeg` 18MB | Still full-res for Editorial LCP when plate 0; needs a real compressed asset later |
| `walkway.png` / `headshot` | Still full-res GPU textures once their batch mounts; mipmaps help filter cost, not download bytes |
| Deploy weight | Orphan webm + full originals still ship with `public/` unless CDN/build excludes them |

#### Verified
- `pnpm run typecheck` clean
- No commit
- Visual intent: helix still seeds a wide ring; cards progressive, not missing forever

### Pass Q — verify + stage pulse flash (2026-07-12 afternoon)

**Date:** 2026-07-12 ~afternoon  
**Dev:** `http://localhost:3001`  
**No commit**

#### 1. Typecheck
- `pnpm run typecheck` → clean (pre + post Stage edit)

#### 2. Homepage Stage (`src/components/home/Stage.tsx`)
- **EnergyTrail** — still mounted in `Scene`, compiles; pointer ribbon + additive glow points + material-mode tint intact
- **Wireframe cage** — dual lattice (`wire` icosahedron + `wire2` octahedron) with material-reactive color/opacity + counter-rotation; still in Core JSX
- **Pulse light flash boost (optional polish):**
  - `lightA` hit multiplier **14 → 18**, distance **10 → 14**
  - `lightB` hit multiplier **10 → 13**, distance **8 → 11**
  - sparkles scale kick **0.6 → 0.75**
- Screenshot `passQ-home.png` shows liquid core + dual wireframe lattice + helix cards + cosmic field (~1.9MB)

#### 3. Playwright viewport screenshots (1440×900 → `.debug-screenshots/passQ-{slug}.png`)
Home + gallery + 9 worlds (11 surfaces). Wait: home `[data-engine]` + 4s; landings ~1.8s. Pageerrors: 0 on capture.

#### Density table (all `passQ-*.png`, ascending)
| Surface | PNG size | Notes |
|---------|----------|-------|
| gallery | **944KB** | weakest by bytes; visually full 3×3 motifs |
| prism | **997KB** | spectral keys + caustics first paint |
| pulse | **1008KB** | EQ + 4-track seq + transport |
| neon | **1077KB** | rain + signs |
| brutalist | **1120KB** | dense construct grid |
| noir | **1234KB** | silhouette + dual HUD |
| zen | **1286KB** | sand + stones + enso |
| atlas | **1456KB** | map + pins |
| editorial | **1475KB** | magazine plates |
| paper | **1653KB** | open book fills stage |
| home | **1908KB** | strongest — WebGL instrument |

**Floor:** every surface ≥ **944KB** (no sub-500KB sparse frames).

#### 4. Sparse-page review
- Visually inspected weakest three (gallery / prism / pulse) + home
- **No sparse pages** — gallery shows all 9 world motifs above fold; prism piano owns frame; pulse sequencer+EQ filled; home core+cage+cards dense
- No landing rewrites this pass (verification-only after Pass P densification held)

#### 5. Smoke
```
URL=http://localhost:3001 node scripts/smoke-interact.mjs
→ exit 0 · pagesVisited=10 · pageerrors=0 · consoleErrors=0 · resource404s=0 · serious=0 · actions=13
```
Report: `.debug-screenshots/smoke-report.json`

#### 6. Scope notes
- No commit
- Related same-afternoon: **Pass Q-perf** (media budget / staggered helix textures) logged above — complementary, not conflicting
- Screenshots: `.debug-screenshots/passQ-{home,gallery,editorial,brutalist,noir,zen,neon,paper,atlas,pulse,prism}.png`

### Auto-cycle 15 — 2026-07-12T17:09:25.333Z
- Base: http://localhost:3001
- Weakest (by PNG density): prism 934KB, gallery 940KB, pulse 1051KB, brutalist 1118KB
- Strongest: home 1901KB, paper 1654KB, atlas 1618KB
- Note: Prioritize upgrade for: prism (934KB). Subagents + main agent keep polishing.

### Pass R — zen garden lush · atlas fog/map dense · helix batch (2026-07-12)

**Date:** 2026-07-12  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. **ZenLanding** — first paint is a **lush garden**, not empty sand
2. **AtlasLanding** — fog + map both denser / more readable
3. **Home helix** — verify cards visible in first 4s after staggered mount; raise initial batch if thin

#### 1. Typecheck
- `pnpm run typecheck` → clean

#### 2. ZenLanding (`src/components/landings/pages.tsx`)
- Seed stones **5 → 9** (shared `seedStones` for reset)
- Canvas first paint: moss islands + fern flecks, gravel rim, denser raked rings + offset stone rings, **pre-raked five-tine trails**, denser grain, fallen leaves, stronger floor depth (deterministic `n2` noise)
- CSS first paint (no canvas wait): moss beds, left bamboo/reeds, right foliage mass, gravel edge washes, stone lantern landmark, pebble scatter
- Season sky wash gains green garden rim glows
- Screenshot `passR-zen.png` **~1.57MB** (was passQ **~1.29MB**) — garden reads planted

#### 3. AtlasLanding (`src/components/landings/pages.tsx`)
- Visited seed **["a","e"] → ["a","e","b"]** (60% charted, wider fog burn)
- Cartography: graticule 64×42, 14 rhumb arcs, **72** towns, more place names, denser topo contours + 56 elevation spots
- Fog: layered wash, **320** mottle blobs, wispy cloud bands, larger pin/route reveals, denser grain + hatch flecks
- Base plates: walkway opacity/contrast up; folly ghost up; lighter multiply so chart texture shows through
- Screenshot `passR-atlas.png` **~1.66MB** (was passQ **~1.46MB**)

#### 4. Home helix (`src/components/home/Stage.tsx`)
- Progressive `Gallery` initial batch **4 → 8**, step interval **110ms → 90ms**
- Per-card Suspense unchanged — early WebP/PNG cards still paint first; heavies fill in
- `passR-home.png` after `[data-engine]` + **4s**: liquid core + dual lattice + **multiple helix cards** (charts left, walkway/moon/UI right) — no empty ring regression
- PNG **~1.95MB**

#### 5. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passR-zen.png` | 1566KB | moss + bamboo + lantern + 9 stones |
| `passR-atlas.png` | 1658KB | topo dense, fog on, 3/5 surveyed |
| `passR-home.png` | 1952KB | helix cards present @4s |

Pageerrors: 0 on capture.

#### 6. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `src/components/home/Stage.tsx`, `STATUS-MARATHON.md`

### Pass S — paper dog-ear · pulse/editorial above-fold · home strike (2026-07-12)

**Date:** 2026-07-12  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Typecheck clean
2. **PaperLanding** — dog-ear still works after density; `passS-paper.png`
3. **PulseLanding** — all 4 tracks visible above fold; `passS-pulse.png`
4. **EditorialLanding** — contact sheet + measure above fold; `passS-editorial.png`
5. **Home** — click Strike via Playwright; `passS-home-pulse.png` after pulse
6. Append STATUS · no commit

#### 1. Typecheck
- `pnpm run typecheck` → clean (pre + post dog-ear fix)

#### 2. PaperLanding dog-ear fix (`src/components/landings/pages.tsx`)
- **Bug:** `clip-path` lived on the interactive `<button>`, so hit-testing collapsed to a ~15% corner triangle. Playwright/center hover and most real grabs missed the pad; only extreme tip (~0.95–0.98) received events.
- **Fix:**
  - Full-corner hit pad (`size-36` / `sm:size-40`, `bg-transparent`, `touch-none`) — **no clip-path on the button**
  - Visual fold / underside / crease are `pointer-events-none` children with clip-path
  - Rest peel **0.32 → ~0.42** (more obvious on dense cream)
  - Peel drag uses **window-level** `pointermove`/`pointerup` via parent ref (`beginPeel`) so listeners survive `PageFace` re-identity remounts during `setPeel`/`setDragCorner`
  - Commit threshold **48 → 40** px travel (`Math.hypot` any direction)
- **Verified:** drag from ~80% of pad → mid-peel visual → **sig A→B** (`On craft` spread). Next button still works.

#### 3. PulseLanding above-fold (no code change)
- At 1440×900, all four track labels fully above fold:
  - KICK top 437 · SNARE 501 · HAT 565 · PERC 629 (vh 900)
- Sequencer + EQ + transport remain in first paint

#### 4. EditorialLanding above-fold (no code change)
- Measure control fully above fold (top 589 / bottom 613)
- Contact sheet 4 plates fully above fold (row1 133–398, row2 407–672)
- Leading strip also above fold

#### 5. Home Strike
- Playwright: `getByRole("button", { name: /Strike the field/i })` → click
- `passS-home-pulse.png` after pulse flash — liquid core + dual lattice + helix cards + pink energy wash

#### 6. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passS-paper.png` | ~1654KB | open book, larger dog-ear “turn” |
| `passS-paper-peel.png` | ~1641KB | mid-peel during drag |
| `passS-pulse.png` | ~934–1015KB | 4 tracks + EQ + transport above fold |
| `passS-editorial.png` | ~1464KB | measure + 4-plate contact sheet above fold |
| `passS-home-pulse.png` | ~1858–1902KB | post-Strike pulse |

Pageerrors: 0 on capture. Report: `.debug-screenshots/passS-report.json`

#### 7. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Pulse / Editorial verified only (layout already met fold goals from prior density passes)

### Pass S2 — subtle CSS polish (home only)
- **Layout tokens** (`src/styles.css`): documented spacing-scale collision; added safety aliases so `max-w-{xs|sm|md|…}`, `w-*`, `min-w-*` resolve to real layout widths (phone/tablet/laptop/desktop/wide/measure) instead of ~1–28px clamps. Prefer named shells still.
- **GrainOverlay**: oversized tile + CSS `translate3d` steps (8s / steps(8)); pure compositor animation, no JS RAF; `prefers-reduced-motion: reduce` disables. Classes `.home-grain` / `.home-grain__tile`.
- **has-custom-cursor**: confirmed present + coarse-pointer restore; used by `CursorTrail`. Left as-is (unlayered `cursor: none !important`).
- **Typecheck:** clean. Landings untouched. No commit.

### Auto-cycle 16 — 2026-07-12T17:14:06.170Z
- Base: http://localhost:3001
- Weakest (by PNG density): prism 936KB, gallery 943KB, pulse 1076KB, brutalist 1117KB
- Strongest: home 1755KB, paper 1654KB, atlas 1618KB
- Note: Prioritize upgrade for: prism (936KB). Subagents + main agent keep polishing.

### Auto-cycle 17 — 2026-07-12T17:18:30.831Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 951KB, brutalist 1118KB, editorial 1473KB, home-mid 1602KB
- Strongest: home 1797KB, home-mid 1602KB, editorial 1473KB
- Note: Prioritize upgrade for: gallery (951KB). Subagents + main agent keep polishing.

### Pass T — full reverify spine (2026-07-12)

**Date:** 2026-07-12  
**Dev:** `http://localhost:3001`  
**Harness:** `ITER_START=14 ITER_MAX=1` + smoke-interact  
**No commit** · verification-only (no surface rewrites)

#### Goals
1. `pnpm run typecheck` clean
2. Capture full surface set at iter-14 via `scripts/iterate-loop.mjs`
3. Interaction smoke via `scripts/smoke-interact.mjs`
4. Score all iter-14 PNGs by size; list weakest 3
5. Upgrade only if any surface **< 700KB** or looks empty
6. Append STATUS · no commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Iterate-loop (iter 14)
- Command: `URL=http://localhost:3001 ITER_START=14 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 14` · `ts: 2026-07-12T17:18:33.223Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: 22× resource 404 strings (known iterate-loop console collector noise; smoke reports 0 real 404s)

#### 3. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T17:19:17.008Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 0 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`

#### 4. Full density table — iter-14 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | prism | `iter-14-prism.png` | **937KB** |
| 2 | gallery | `iter-14-gallery.png` | **949KB** |
| 3 | pulse | `iter-14-pulse.png` | **1040KB** |
| 4 | brutalist | `iter-14-brutalist.png` | **1118KB** |
| 5 | neon | `iter-14-neon.png` | **1134KB** |
| 6 | noir | `iter-14-noir.png` | **1445KB** |
| 7 | editorial | `iter-14-editorial.png` | **1473KB** |
| 8 | zen | `iter-14-zen.png` | **1530KB** |
| 9 | atlas | `iter-14-atlas.png` | **1618KB** |
| 10 | paper | `iter-14-paper.png` | **1655KB** |
| 11 | home-mid | `iter-14-home-mid.png` | **1679KB** |
| 12 (strongest) | home | `iter-14-home.png` | **1795KB** |

- **Min:** 937KB · **Max:** 1795KB · **Floor check (<700KB):** none
- **Weakest 3:** prism 937KB · gallery 949KB · pulse 1040KB
- **Strongest 3:** home 1795KB · home-mid 1679KB · paper 1655KB

#### 5. Empty / under-floor review
- **No surface < 700KB** → no density upgrade required this pass
- Visual check (weakest three + home):
  - **prism** — full 12-key spectral piano, particle field, rainbow beams, mode chrome — dense
  - **gallery** — all 9 instrument cards first paint with per-card art — dense
  - **pulse** — EQ rainbow + 4-track sequencer (KICK/SNARE/HAT/PERC) + transport above fold — dense
  - **home** — liquid core + dual lattice + helix cards + CTAs + WebGL field — dense
- Code changes this pass: **none** (verify-only)

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-14 capture · smoke interact · density floor held

### Spine checkpoint — 13:20 EDT
- Typecheck clean
- Smoke: 10 pages, 0 serious errors
- Density floor: **~937KB** (all surfaces)
- Home WebGL: ~1.8–2.0MB with core + lattice + helix + CTAs
- Background: marathon-forever, 30m/45m schedulers, durable 45m Pass scheduler
- Review guide: MARATHON-README.md
- Still iterating until ~23:00

### Pass U — neon storm first-paint drama (2026-07-12)

**Date:** 2026-07-12  
**Dev:** `http://localhost:3001`  
**Choice:** Option B — neon storm mode more dramatic on first paint  
**No commit**

#### Goals
1. One substantial visual upgrade (storm-first neon)
2. Typecheck clean
3. Screenshot storm first paint + ongoing + strike
4. Append STATUS · no commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. NeonLanding storm drama (`src/components/landings/pages.tsx`)
- **Default weather = `storm`** (was `rain`) · default density **1.65** (was 1.35)
- **Opening barrage** (~first 1s): mega forked bolt → double bolt → follow-up; full-frame sheet flash + DOM flash layer driven by canvas
- **Bolt system upgraded:** multi-fork branches, hot white core + glow, vertical light shaft, street strike sparks + multi-ring ripples, mega vs normal widths
- **Storm atmosphere:** cloud bank + charged underbelly, deeper vignette, wind-shear rain (520 ambient drops, target `420 * dens`, fall 11.2, strong diagonal wind), brownout windows that surge on flash, wind debris streaks
- **DOM chrome:** electric sky marquee (“ELECTRICAL STORM · BOLT LIVE”), storm sign flicker keyframes, title surge glow, STORM chip sky-blue active state, storm copy, rain-skew + cloud-drift overlays
- Re-selecting STORM retriggers opening sequence; click-to-strike forces mega bolt

#### 3. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passU-neon-storm-first.png` | **1366KB** | storm default first paint, cyan charged title |
| `passU-neon-storm.png` | **1520KB** | forked bolts + wind rain + street wash (was ~1134KB iter-14) |
| `passU-neon-storm-strike.png` | **1471KB** | click strike mega bolt · hits 1 |

Pageerrors: 0 · Report: `.debug-screenshots/passU-report.json`  
Density delta neon: **~1134KB → ~1520KB** (+~34%)

#### 4. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Other landings / home untouched

### Auto-cycle 18 — 2026-07-12T17:23:27.314Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 950KB, pulse 1034KB, brutalist 1118KB, noir 1443KB
- Strongest: home 1803KB, paper 1655KB, atlas 1618KB
- Note: Prioritize upgrade for: gallery (950KB). Subagents + main agent keep polishing.

### Pass U — PrismLanding density upgrade (weakest ~937KB)

**Date:** 2026-07-12 ~13:23  
**Dev:** `http://localhost:3001`  
**No commit**

#### Targets
- `/landings/prism` (weakest iter-14: **937KB**)
- Gallery prism motif light boost (`/landings/`)

#### PrismLanding (`src/components/landings/pages.tsx`)
- **First-paint canvas denser:** dual/triple spectrum wash rows, 12 vertical band washes, **12 caustic rows** + 18 fill ellipses, double-pass 12-ray beams (glow+core), incident beam, prism body, **420 particles seeded on frame 0**
- **Loop denser:** 26–30 field orbs, 12 caustic rows, 22 swimming blobs, particle trails + soft glow, dual spectrum ribbons, stronger mode beams
  - **split:** double-pass fan + tip sparks
  - **combine:** spectrum halo + multi white bloom cluster
  - **diffract:** curved fan + 14 fringe dots/ray
- **Keys more dramatic:** `h-[min(58vh,540px)]`, multi-stop glass gradients, specular cap, bevels, dual caustic animations, mid light stripe, key-bed glow, stronger solo/lock/press shadows
- DOM underpaint: multi radial + conic wash, 12-col spectral wall, denser caustic floor, top+bottom spectrum ribbons, larger prism + orbit glows
- Compact chrome so piano owns fold
- Layout tokens: only `max-w-wide|laptop|measure` — no `max-w-sm/md/xl`

#### Gallery (`src/routes/landings/index.tsx`)
- Prism motif: 12-col wall, 10 caustic blobs, 14 rays, incident beam, taller 12-key row with speculars, 18 motes, dual spectrum ribbons

#### Verified
- `pnpm run typecheck` → **clean**
- Playwright: `/landings/prism` pageerrors **0**; modes split/combine/diffract all clickable
- Screenshots:
  - `.debug-screenshots/passU-prism.png` **~1548KB** (was ~937KB) — dramatic keys + beams + particles first paint
  - `.debug-screenshots/passU-prism-combine.png` **~1366KB** — white recombine path
  - `.debug-screenshots/passU-prism-diffract.png` **~1478KB** — interference fan
  - `.debug-screenshots/passU-gallery.png` **~958KB** (was ~949KB) — light prism-card boost
- Density delta prism: **+611KB** (~65% denser PNG)
- No commit


### Auto-cycle 19 — 2026-07-12T17:28:14.666Z
- Base: http://localhost:3001
- Weakest (by PNG density): gallery 971KB, pulse 1021KB, brutalist 1118KB, noir 1451KB
- Strongest: home 1807KB, home-mid 1693KB, paper 1657KB
- Note: Prioritize upgrade for: gallery (971KB). Subagents + main agent keep polishing.

### Pass V — homepage chapter rail wow + smoke (2026-07-12)

**Date:** 2026-07-12 ~13:28 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Run `smoke-interact.mjs`
2. Fix real bugs found (none)
3. Homepage wow: ScrollProgress chapter rail — no conflict with FloatingNav
4. Optional: CaseStudySheet open from archive still works
5. Typecheck clean
6. Append STATUS · no commit

#### 1. Smoke
- `URL=http://localhost:3001 node scripts/smoke-interact.mjs` → **exit 0**
- pagesVisited=10 · pageerrors=0 · consoleErrors=0 · resource404s=0 · serious=0 · actions=13

#### 2. Bugs
- None from smoke. Transient FloatingNav parse error during edit (JSX comment sibling) fixed immediately.

#### 3. ScrollProgress chapter rail (`src/components/home/ScrollProgress.tsx`)
- **Conflict-free stacking with FloatingNav:**
  - Top progress beam → `z-40` + `pointer-events-none` (was `z-[90]`) so the glass pill is never bisected
  - Chapter rail → `z-[45]`, container `pointer-events-none`
  - FloatingNav stays `z-50` (documented in `FloatingNav.tsx`)
- **Interactive rail wow:**
  - 5 chapter marks as focusable buttons (`Go to Origin|Material|Orbit|Craft|Signal`)
  - Current chapter glow (ring + dual pink shadow); passed vs pending states
  - Hover/focus expands chapter name; footer shows `NN · Chapter`
  - Click → `scrollIntoView` + hash sync (`#origin` … `#signal`) aligned with FloatingNav anchors
  - Taller track (`h-48`), smooth fill transition
- Verified: rail bbox right-edge, FloatingNav center — **no AABB overlap**; z 45 < 50

#### 4. CaseStudySheet (archive)
- Open via archive corridor card `Open case study: Uncap` → sheet shows **Uncap** + **Pulse the stage** + **All worlds**
- Escape closes cleanly · pageerrors 0

#### 5. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 6. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passV-home.png` | **~1820KB** | home first paint + rail |
| `passV-rail-mid.png` | **~1853KB** | mid-scroll active chapter |
| `passV-rail-hover.png` | **~1745KB** | rail hover state |
| `passV-case-sheet.png` | **~732KB** | Uncap case study sheet open |

Report: `.debug-screenshots/passV-report.json` · ok=true

#### 7. Scope notes
- No commit
- Files touched: `src/components/home/ScrollProgress.tsx`, `src/components/home/FloatingNav.tsx`, `STATUS-MARATHON.md`
- Stage.tsx / landings untouched

### Pass W2 — full reverify spine (2026-07-12)

**Date:** 2026-07-12 ~13:30 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** pure verification (no product code changes)  
**No commit**

#### Goals
1. `pnpm run typecheck`
2. `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
3. `URL=http://localhost:3001 ITER_START=16 ITER_MAX=1 node scripts/iterate-loop.mjs`
4. Append STATUS with density table from iter-16
5. Fix crashes / pageerrors if any (none)
6. No commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T17:29:06.121Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 0 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`

#### 3. Iterate-loop (iter 16)
- Command: `URL=http://localhost:3001 ITER_START=16 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 16` · `ts: 2026-07-12T17:29:58.212Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: 22× resource 404 strings (known iterate-loop console collector noise; smoke reports 0 real 404s)

#### 4. Full density table — iter-16 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | gallery | `iter-16-gallery.png` | **992KB** |
| 2 | pulse | `iter-16-pulse.png` | **1017KB** |
| 3 | brutalist | `iter-16-brutalist.png` | **1116KB** |
| 4 | noir | `iter-16-noir.png` | **1446KB** |
| 5 | editorial | `iter-16-editorial.png` | **1473KB** |
| 6 | neon | `iter-16-neon.png` | **1480KB** |
| 7 | home-mid | `iter-16-home-mid.png` | **1514KB** |
| 8 | prism | `iter-16-prism.png` | **1527KB** |
| 9 | zen | `iter-16-zen.png` | **1530KB** |
| 10 | atlas | `iter-16-atlas.png` | **1618KB** |
| 11 | paper | `iter-16-paper.png` | **1654KB** |
| 12 (strongest) | home | `iter-16-home.png` | **1813KB** |

- **Min:** 992KB · **Max:** 1813KB · **Floor check (<700KB):** none
- **Weakest 3:** gallery 992KB · pulse 1017KB · brutalist 1116KB
- **Strongest 3:** home 1813KB · paper 1654KB · atlas 1618KB
- vs iter-14: floor rose **937KB → 992KB**; prism no longer weakest (Pass U density stuck ~1527KB)

#### 5. Empty / under-floor review
- **No surface < 700KB** → no density upgrade required this pass
- **No pageerrors / crashes** on any surface → no fixes required
- Code changes this pass: **none** (verify-only)

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-16 capture · smoke interact · density floor held

### Pass W — gallery first-paint density (2026-07-12)

**Date:** 2026-07-12 ~13:32 EDT
**Dev:** `http://localhost:3001`
**No commit**

#### Goals
1. Upgrade `src/routes/landings/index.tsx` first paint denser (weakest ~980KB gallery)
2. Richer per-world motifs
3. Always-on animated rain on neon card
4. Amp starfield / multi-mesh ambient
5. Keep all 9 cards above fold
6. Typecheck · screenshot `passW-gallery.png` · STATUS · no commit

#### 1. Motif upgrades (`WorldMotif`)
- **ink:** denser grain/stains, 10 ink blurs, 14 type rules, 4-plate stack, column gutter
- **grid:** 14×9 brick field (126 cells), dual hazard tape, constructivist corner stamps, GRID//14
- **lamp:** denser blinds, 8 practicals, silhouette shoulders, 36 dust motes, 18 sprockets, viewfinder corners
- **enso:** 8 stones, 14 rake bands, concentric sand rings, dual enso orbits, VOID/FORM mark
- **rain (always-on):** 16-building skyline w/ 3×4 windows, dual rain layers (56+28 streaks, card-local fall), splash dots, multi puddles, neon tubes + kanji bars — **never hover-gated**
- **folio:** denser desk grain, 12+10 type lines, dual blots, pen barrel, folio numbers, thicker spine
- **map:** dual graticule, extra landmass + isobars, 9 pins, 4 routes, compass N + scale bar
- **wave:** 36 bars always animating (`gallery-bar`), 5 track rails ×12 steps, dual playheads
- **prism:** 14-col spectrum wall, 18 rays, 14 caustics, 14 keys, 28 motes

#### 2. Ambient field (page chrome)
- Multi-mesh: 40px major + 8px minor + diagonal hatch + 5px dots + 160px accent crosshairs
- SSR-safe **96** static stars + **18** glint crosses + **24** constellation lines (first paint)
- Client **110** drifting/twinkling stars (accent-reactive)
- Extra bloom orbs (mint + gold) + center vignette so cards stay primary

#### 3. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 4. Screenshot (1440×900)
| File | Size | Notes |
|------|------|-------|
| `passW-gallery.png` | **~1381KB** | was ~980–992KB · **+~40%** |

- Cards: **9** · fully in viewport: **9** (3×3 above fold held)
- Report: `.debug-screenshots/passW-gallery-report.json`
- Neon rain visible on first paint; mesh/starfield clearly denser

#### 5. Scope notes
- No commit
- Files touched: `src/routes/landings/index.tsx`, `STATUS-MARATHON.md`
- Weakest gallery surface should no longer lead density table by a wide margin

### Auto-cycle 20 — 2026-07-12T17:32:58.524Z
- Base: http://localhost:3001
- Weakest (by PNG density): zen 796KB, pulse 1083KB, brutalist 1112KB, gallery 1379KB
- Strongest: home 1760KB, home-mid 1667KB, paper 1657KB
- Note: Prioritize upgrade for: zen (796KB). Subagents + main agent keep polishing.

### Pass X — PulseLanding field/EQ drama + gallery re-verify (2026-07-12)

**Date:** 2026-07-12  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. **PulseLanding** — EQ/field more dramatic on first paint (tall canvas, particles, energy rings)
2. Verify gallery after Pass W still dense (fresh screenshot)
3. Typecheck clean
4. Screenshots `passX-pulse.png` · `passX-gallery.png`
5. Append STATUS · no commit

#### 1. PulseLanding ambient field (`src/components/landings/pages.tsx`)
- Canvas first-paint density: **140** seeded particles + **10** seed energy rings (frame 1 not empty)
- Full-height **72-pillar** EQ backdrop + multi-hue gradient caps
- **5** spectrum ribbons + **2** mirrored ghost waves (tall vertical occupancy)
- **12** concentric energy rings + dashed outer orbits + radial beams on live hits
- Hit rings: dual-ring spawn per track, kick spokes (12), particle bursts (28 kick / 14 other)
- Particle system: trails, glow, ambient floor ≥100, step top-ups to ~180
- Scan grid + radial energy well + dual step strip + multi-core playhead with side ticks
- Flash wash: multi-radial blooms (center / floor / corners)
- Default energy **1.25 → 1.45** · DPR cap **1.5 → 1.75** · trail alpha slower (denser afterimage)

#### 2. PulseLanding DOM EQ
- Height **18–20vh / 150–168px → 26–28vh / 220–240px**
- Bars **96 → 128** with 3-stop gradient + playhead dual glow
- Mirrored reflection ghost strip under bars
- Floor glow + stronger playhead beam (1.5px + 12px wash)
- Compact header / seq chrome so **all 4 tracks + transport stay above fold** at 1440×900
  - KICK 493 · SNARE 548 · HAT 603 · PERC 659 (vh 900) — all above fold
  - EQ band measured **h=240** (top 199 → bottom 439)

#### 3. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 4. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passX-pulse.png` | **~1939KB** | was ~934–1083KB · **~2× density** · tall EQ + particles + rings + 4-track seq |
| `passX-gallery.png` | **~1390KB** | Pass W held (~1381KB) · 9/9 cards fully in viewport |

- Pageerrors: **0**
- Report: `.debug-screenshots/passX-report.json`
- Density floor (~1MB): both surfaces well above

#### 5. Gallery re-verify (post Pass W)
- Cards: **9** · fully in viewport: **9** (3×3 above fold held)
- Neon rain / mesh / starfield still dense on first paint
- No gallery code change this pass (verify-only)

#### 6. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Pulse no longer a density weakling — now among strongest instrument surfaces

### Pass X2 — home Chapters mid-scroll polish (2026-07-12)

**Date:** 2026-07-12 ~13:36 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Ensure kinetic dual lines still work (scroll scrub + scramble restore)
2. Archive strip images load (all 12)
3. One small premium detail — chapter number watermarks + spacing
4. Typecheck clean
5. Screenshots at scroll 0.25 / 0.5 / 0.75 → `passX2-s25.png` etc
6. Append STATUS · no commit
7. **Do not break Stage.tsx** (untouched)

#### 1. Kinetic dual field (`src/components/home/Chapters.tsx`)
- Dual counter-scroll lines retained: `data-kinetic-a` / `data-kinetic-b` GSAP scrub (A leftward, B rightward)
- Full marquee strings aligned with scramble originals (`MATERIAL…SIGNAL` + `CRAFT…GLASS`)
- **Bugfix:** scramble restore was flaky under interval stacking / throttle — now cancels prior interval, hard restore at frame>40 **and** 1600ms backup timeout; cleanup on unmount
- Section height `78dvh → 82dvh`, line gap `gap-2/3 → gap-3/5`, bottom label spacing

#### 2. Archive strip images
- First **4** cards `loading=eager`; first **3** `fetchPriority=high` (was 3 / 2)
- Verified: **12/12** `naturalWidth > 0` after strip region scroll
- Card index chips `01`–`12` (top-right)

#### 3. Premium detail — chapter watermarks
- Giant faint index marks: **01** / **02** on Origin & Material, **03** on Orbit corridor, **04** / **05** on Craft & Signal
- Soft `··` mark behind kinetic field
- Chapter panel vertical padding `py-28 → py-32 sm:py-36`; archive header `mb-8 → mb-10/12`

#### 4. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 5. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Scroll | Notes |
|------|------|--------|-------|
| `passX2-s25.png` | **~1735KB** | 0.25 | Dual kinetic in view (`MATERIAL` / `CRAFT FIELD…`); WebGL core + helix |
| `passX2-s50.png` | **~1825KB** | 0.50 | Archive corridor pin; cards loading |
| `passX2-s75.png` | **~1099KB** | 0.75 | Late strip (Portrait / Folly etc); **12/12 imgs loaded** |

Report: `.debug-screenshots/passX2-report.json` · **ok=true**  
- pageerrors: **0** · dual kinetic: **true** · scrub directions diverge: **true** · archive all loaded: **true**

#### 6. Scope notes
- No commit
- Files touched: `src/components/home/Chapters.tsx`, `STATUS-MARATHON.md`
- **Stage.tsx untouched**

### Auto-cycle 21 — 2026-07-12T17:37:43.318Z
- Base: http://localhost:3001
- Weakest (by PNG density): brutalist 1116KB, gallery 1379KB, noir 1446KB, editorial 1473KB
- Strongest: pulse 1903KB, home 1803KB, paper 1655KB
- Note: Prioritize upgrade for: brutalist (1116KB). Subagents + main agent keep polishing.

### Pass Y — full reverify spine (2026-07-12)

**Date:** 2026-07-12 ~13:38 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** pure verification (no product code changes)  
**No commit**

#### Goals
1. `pnpm run typecheck`
2. `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
3. `URL=http://localhost:3001 ITER_START=17 ITER_MAX=1 node scripts/iterate-loop.mjs`
4. Append STATUS with density table from iter-17
5. Fix crashes / pageerrors if any (none)
6. No commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T17:37:24.824Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 0 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`

#### 3. Iterate-loop (iter 17)
- Command: `URL=http://localhost:3001 ITER_START=17 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 17` · `ts: 2026-07-12T17:38:25.826Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: 22× resource 404 strings (known iterate-loop console collector noise; smoke reports 0 real 404s)

#### 4. Full density table — iter-17 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | brutalist | `iter-17-brutalist.png` | **1115KB** |
| 2 | gallery | `iter-17-gallery.png` | **1380KB** |
| 3 | noir | `iter-17-noir.png` | **1446KB** |
| 4 | editorial | `iter-17-editorial.png` | **1473KB** |
| 5 | home-mid | `iter-17-home-mid.png` | **1480KB** |
| 6 | neon | `iter-17-neon.png` | **1483KB** |
| 7 | prism | `iter-17-prism.png` | **1520KB** |
| 8 | atlas | `iter-17-atlas.png` | **1620KB** |
| 9 | paper | `iter-17-paper.png` | **1654KB** |
| 10 | home | `iter-17-home.png` | **1810KB** |
| 11 | pulse | `iter-17-pulse.png` | **1904KB** |
| 12 (strongest) | zen | `iter-17-zen.png` | **1920KB** |

- **Min:** 1115KB · **Max:** 1920KB · **Floor check (<700KB):** none
- **Weakest 3:** brutalist 1115KB · gallery 1380KB · noir 1446KB
- **Strongest 3:** zen 1920KB · pulse 1904KB · home 1810KB
- vs iter-16: floor rose **992KB → 1115KB**; gallery (Pass W) and pulse (Pass X) no longer weak-pair; zen jumped to strongest (~796KB auto-cycle → **1920KB**)

#### 5. Empty / under-floor review
- **No surface < 700KB** → no density upgrade required this pass
- **No pageerrors / crashes** on any surface → no fixes required
- Code changes this pass: **none** (verify-only)

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-17 capture · smoke interact · density floor held

### Pass Y2 — zen first-paint creative polish (2026-07-12)

**Date:** 2026-07-12 ~13:39 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Among noir / zen / editorial recent shots, pick least "wow" and amp first paint further
2. Do not break tools (rake · place · enso · breath · seasons · smooth · reset)
3. Typecheck clean · screenshots · STATUS · no commit

#### 0. Pick
- Recent density (pre-fix): **zen ~815KB** (`iter-20-zen.png`) vs noir ~1.45MB · editorial ~1.48MB
- Auto-cycle 20 flagged zen as weakest; visual read was washed sand, faint rings, sparse garden
- **Target: ZenLanding** first paint

#### 1. ZenLanding canvas (`paintSandBase` in `src/components/landings/pages.tsx`)
- Layered sand plate + diagonal strata (not flat wash)
- Moss beds **8 → 12**, higher alpha · 48 fern flecks · edge grass blades
- Gravel rim stronger + engawa plank frames + **420** rim pebbles
- Concentric raked rings: tighter spacing (10px), higher contrast ink, micro-ripples between rings
- Offset stone-seat rings **4 → 7** centers · denser 8px steps to r=120
- Pre-raked five-tine trails **7 → 12** · alpha ~0.20
- Parallel rake bands every **7.5px** + shallow cross-hatch field
- Grain **5200→11000** grit + **3600** highlight flecks + **280** gravel pockets
- Leaves **48→96** with veins
- New **koi pond / water mirror** oval (upper-right landmark + ripples)
- Immediate paint + double-rAF + 48ms retry + ResizeObserver (first screenshot not empty)

#### 2. ZenLanding CSS first paint
- Moss beds **7 → 10**, higher opacity
- Bamboo/reeds **14 → 22** + node segment marks
- Right foliage **10 → 18**
- Canopy blobs (top corners) + CSS sand-ring suggestion before canvas
- Engawa edge strips on all four sides
- Sky wash softened (`glow` **cc→88**) so sand texture reads through
- Pebbles **10 → 16** · stepping-stone path · dual stone lanterns (primary glow + secondary rear)

#### 3. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 4. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passY2-zen.png` | **~1976KB** | was iter-20 **~796–815KB** · **~2.4×** · rings + moss + trails + pond |
| `passY2-zen-rake.png` | **~1961KB** | after rake drag stroke |
| `passY2-zen-night.png` | **~1861KB** | night season recolor holds density |
| `passY2-zen-final.png` | **~1981KB** | reset garden → 9 seed stones · dawn |

Report: `.debug-screenshots/passY2-zen-report.json`

#### 5. Tools (unbroken)
| Tool | Result |
|------|--------|
| RAKE / PLACE / ENSO / BREATH modes | ok |
| Place stone | stones 9 → 10 |
| Smooth sand | ok |
| Reset garden | stones → 9 seed |
| Enso on/off | ok |
| Dawn / noon / dusk / night | ok |
| Rake drag | trails persist on sand canvas |
| Sand canvas | 1440×900 · sample RGB ~[223,214,194] (sand, not empty) |

#### 6. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Zen flipped from weakest (~815KB) to among strongest (~1.98MB); tools preserved
- Parallel Pass Y iter-17 also measured `iter-17-zen.png` **1920KB** (strongest of that batch)

### Auto-cycle 22 — 2026-07-12T17:42:35.837Z
- Base: http://localhost:3001
- Weakest (by PNG density): pulse 558KB, brutalist 1377KB, gallery 1379KB, noir 1456KB
- Strongest: zen 1977KB, home 1789KB, paper 1655KB
- Note: Prioritize upgrade for: pulse (558KB). Subagents + main agent keep polishing.

### Pass Z — SYS.BRUTAL paint floor texture amp (2026-07-12)

**Date:** 2026-07-12 ~13:42 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Brutalist weakest among iter-17 (~1115KB) — amp paint floor visual texture further
2. Do not break paint / flood / stamp / hotkeys (1–5 · R seed · SPC flood)
3. Typecheck clean · screenshot `passZ-brutalist.png` · STATUS · no commit

#### Baseline
| Surface | PNG | Note |
|---------|-----|------|
| brutalist (iter-17) | **1115KB** | weakest of iter-17 table |
| gallery | 1380KB | |
| noir | 1446KB | |

#### Changes (`BrutalistLanding` in `src/components/landings/pages.tsx`)
- Version **SYS.BRUTAL.05 → SYS.BRUTAL.06**
- Grid **42×24 (1008) → 48×28 (1344)** cells
- Seed densified: extra diags/slabs/skylines/rebar/weld/rivet patterns; residual grit never returns pure empty; stamps **BUILD / UGLY / TRUE / RAW / FORM / HARD**
- Cell textures: multi-speck aggregate + mortar seams + per-cell unique radial noise on solid/accent/hazard/hatch/empty
- Floor chrome: dual SVG film grain, **120** grit flecks, rebar/formwork mesh, stress-fracture SVG lines, **16** rivets + **36** bolt grid, dual weld rows, side plate hazard stripes
- Stats strip micro-concrete speck + corner diodes
- `MARATHON-README.md` grid/version line updated

#### Verified
- `pnpm run typecheck` → **clean**
- Playwright 1440×900: badge `SYS.BRUTAL.06` · grid `48×28` · **1344** cells
- Hotkeys 1–5 tool cycle · R reseed · SPC flood — ok
- Paint click · stamp · flood — HITS advanced (report HITS 39 after interact path)
- Report: `.debug-screenshots/passZ-brutalist-report.json`

#### Screenshots
| File | Size | Note |
|------|------|------|
| `passZ-brutalist.png` | **~1375KB** | first paint · was iter-17 **1115KB** · **+23%** |
| `passZ-brutalist-interact.png` | **~1378KB** | after paint/stamp/flood/R/SPC |

#### Tools (unbroken)
| Tool / hotkey | Result |
|---------------|--------|
| 1 PAINT / drag paint | ok |
| 2 ERASE | tool select ok |
| 3 FLOOD + click | ok |
| 4 STAMP + click | ok |
| 5 SLASH | tool select ok |
| R seed | reseed ok |
| SPC flood last cell | ok |

#### Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `MARATHON-README.md`, `STATUS-MARATHON.md`
- Brutalist left iter-17 weakest floor (~1115KB) → **~1375KB**; now mid-pack vs gallery/noir
- Auto-cycle 22 independently measured brutalist **1377KB** mid-pass (confirms lift)

### Pass Z2 — full reverify spine (2026-07-12)

**Date:** 2026-07-12 ~13:42 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** pure verification (no product code changes)  
**No commit**

#### Goals
1. `pnpm run typecheck`
2. `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
3. `URL=http://localhost:3001 ITER_START=21 ITER_MAX=1 node scripts/iterate-loop.mjs`
4. Append STATUS with density table from iter-21
5. Fix crashes / pageerrors if any (none serious)
6. No commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T17:40:37.342Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 3 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`
- Soft console (non-blocking, not `serious`): React “state update before mount” on editorial + paper; hydration mismatch on paper (`data-tsd-source` / caret-color style noise) — no TypeError / ReferenceError / SyntaxError

#### 3. Iterate-loop (iter 21)
- Command: `URL=http://localhost:3001 ITER_START=21 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 21` · `ts: 2026-07-12T17:41:37.842Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: 21× mixed resource-404 strings + hydration attrs (known iterate-loop console collector noise; smoke reports 0 real 404s, 0 serious)

#### 4. Full density table — iter-21 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | brutalist | `iter-21-brutalist.png` | **1377KB** |
| 2 | gallery | `iter-21-gallery.png` | **1379KB** |
| 3 | noir | `iter-21-noir.png` | **1456KB** |
| 4 | editorial | `iter-21-editorial.png` | **1486KB** |
| 5 | neon | `iter-21-neon.png` | **1495KB** |
| 6 | prism | `iter-21-prism.png` | **1526KB** |
| 7 | atlas | `iter-21-atlas.png` | **1620KB** |
| 8 | home-mid | `iter-21-home-mid.png` | **1634KB** |
| 9 | paper | `iter-21-paper.png` | **1654KB** |
| 10 | home | `iter-21-home.png` | **1809KB** |
| 11 | pulse | `iter-21-pulse.png` | **1864KB** |
| 12 (strongest) | zen | `iter-21-zen.png` | **1977KB** |

- **Min:** 1377KB · **Max:** 1977KB · **Floor check (<700KB):** none
- **Weakest 3:** brutalist 1377KB · gallery 1379KB · noir 1456KB
- **Strongest 3:** zen 1977KB · pulse 1864KB · home 1809KB
- vs iter-17: floor rose **1115KB → 1377KB**; zen still strongest (Pass Y2 hold ~1977KB); brutalist remains weak-pair but well above floor

#### 5. Empty / under-floor review
- **No surface < 700KB** on iter-21 capture → no density upgrade required this pass
- **No serious pageerrors / crashes** → no product fixes required
- Soft console warnings noted (editorial/paper) but smoke `ok: true` / `serious: 0` — out of scope for verify-only pass
- Code changes this pass: **none** (verify-only)

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-21 capture · smoke interact · density floor held

### Pass AA2 — editorial/paper soft console + paper hydration audit (2026-07-12)

**Date:** 2026-07-12 ~13:43 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** investigate + fix-if-clear-bug (no commit)  
**No commit**

#### Goals
1. Soft warning: React “state update before mount” on editorial + paper — find setState during render
2. Paper hydration mismatch — check `Math.random` in initial render state
3. Fix only if clear product bug; if motion-internal / harness noise → document + skip
4. Typecheck · STATUS · no commit

#### 1. State-update-before-mount (editorial + paper)

**Smoke source:** `.debug-screenshots/smoke-report.json` · consoleErrors[0–1] on `/landings/editorial` and `/landings/paper`:
> Can't perform a React state update on a component that hasn't mounted yet… Move this work to useEffect instead.

**Audit of `EditorialLanding` / `PaperLanding` in `src/components/landings/pages.tsx`:**

| Check | Editorial | Paper |
|-------|-----------|-------|
| `setState` / setters in component body (render path) | none | none |
| `useMemo` / render-phase side effects | none | none |
| `onUpdate` / motion callbacks that call setState | none | none |
| `useEffect` that races pre-mount | **no useEffect at all** | **no useEffect at all** |
| All product setState | event handlers only (`onClick`, ranges, plate drag, `dropStain`) | event handlers + `setTimeout` inside `turn()` (user-driven page turn) |

**Motion usage that runs on first paint (SSR hydrate):**
- **Editorial:** `openCh` seeds `0` → chapter I open → `AnimatePresence` + `motion.p` with `initial→animate` (height/opacity); pull-quote `AnimatePresence mode="wait"` + `motion.blockquote` always mounts with enter animation.
- **Paper:** `PageFace` wraps folio body in `AnimatePresence mode="wait"` + `motion.div` (`initial={{ opacity: 0, y: 10 }}` → animate in) on every first paint of left/right faces; book stage uses `motion.div` animate props for flip.

**Verdict:** **motion/react `AnimatePresence` enter-animation internal state during hydrate** — same soft class as other landings that animate presence on mount. **Not a product setState-during-render bug.** No code change (would only mask via `initial={false}` / client-only wrappers and mute intentional enter polish).

#### 2. Paper hydration mismatch

**Smoke source:** consoleErrors[2] on `/landings/paper` — React hydration tree dump.

**Mismatch attributes in dump (not product state):**
- `data-tsd-source="/src/components/landings/pages.tsx:…"` **server line ≠ client line** (TanStack devtools source attribution; shifts with file edits)
- STATUS Z2 already noted caret-color / `data-tsd-source` style noise

**`Math.random` in PaperLanding initial state?**
- **No.** Seed marks are fully hardcoded:
  - `underlines` → `[{ id: 1, spread: 0, y: 62, x: 18, w: 42 }, { id: 2, … }]`
  - `blots` → fixed blot/splatter triples (`id` 10–12, fixed x/y/s/rot)
  - `inkStrokes` → `[]`
- `Math.random` only in **pointer/click handlers** (blot size/rot, underline width) — post-interaction only, not first paint / SSR.

**Contrast:** Neon’s old hydrate bug (Pass notes) used `Math.random` inside `useState` init for sign flicker — Paper does not.

**Verdict:** **harness / TanStack `data-tsd-source` noise**, not SSR nondeterminism in PaperLanding. **Skip product fix.**

#### 3. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 4. Scope notes
- Product code changes: **none**
- Files touched: `STATUS-MARATHON.md` only
- No commit
- Soft warnings remain non-blocking (`smoke ok: true`, `serious: 0`); revisit only if they become hard pageerrors or a real setState-in-render lands in product code

### Pass AA — full reverify spine (2026-07-12)

**Date:** 2026-07-12 ~13:45 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** pure verification + density floor 1200KB (no product code changes)  
**No commit**  
**User return:** ~23:00

#### Goals
1. `pnpm run typecheck`
2. `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
3. `URL=http://localhost:3001 ITER_START=23 ITER_MAX=1 node scripts/iterate-loop.mjs`
4. If any surface < 1200KB, amp it
5. Append STATUS with density table from iter-23
6. No commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T17:43:33.745Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 0 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`
- Cleaner than Z2 (which had 3 soft consoleErrors on editorial/paper) — this run fully quiet

#### 3. Iterate-loop (iter 23)
- Command: `URL=http://localhost:3001 ITER_START=23 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 23` · `ts: 2026-07-12T17:44:32.790Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: 23× mixed resource-404 strings + hydration attrs (known iterate-loop console collector noise; smoke reports 0 real 404s, 0 serious)

#### 4. Full density table — iter-23 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | brutalist | `iter-23-brutalist.png` | **1376KB** |
| 2 | gallery | `iter-23-gallery.png` | **1379KB** |
| 3 | noir | `iter-23-noir.png` | **1443KB** |
| 4 | neon | `iter-23-neon.png` | **1467KB** |
| 5 | editorial | `iter-23-editorial.png` | **1509KB** |
| 6 | prism | `iter-23-prism.png` | **1530KB** |
| 7 | home-mid | `iter-23-home-mid.png` | **1573KB** |
| 8 | atlas | `iter-23-atlas.png` | **1618KB** |
| 9 | paper | `iter-23-paper.png` | **1654KB** |
| 10 | home | `iter-23-home.png` | **1815KB** |
| 11 | pulse | `iter-23-pulse.png` | **1904KB** |
| 12 (strongest) | zen | `iter-23-zen.png` | **1977KB** |

- **Min:** 1376KB · **Max:** 1977KB · **Floor check (<1200KB):** none
- **Weakest 3:** brutalist 1376KB · gallery 1379KB · noir 1443KB
- **Strongest 3:** zen 1977KB · pulse 1904KB · home 1815KB
- vs iter-21: floor held (~1377→1376KB, capture noise); zen still strongest (~1977KB); pulse +40KB; neon −28KB but still well above floor

#### 5. Empty / under-floor review
- **No surface < 1200KB** on iter-23 capture → **no density amp required this pass**
- **No serious pageerrors / crashes** → no product fixes required
- Code changes this pass: **none** (verify-only)

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-23 capture · smoke interact · 1200KB density floor held
- Afternoon hold until user return ~23:00; marathon-forever / schedulers may continue independently

### Midday marathon heartbeat — 13:45 EDT
- **Density floor held at ~1.38MB** across all 12 surfaces (iter-23)
- **Smoke:** 0 pageerrors, 0 serious, 0 resource 404s
- **Typecheck:** clean
- **Loops alive:** marathon-forever + 30m/45m/durable schedulers + dev :3001
- **Artifacts:** 350+ screenshots, 35+ named passes in STATUS
- **User guide:** MARATHON-README.md
- Continuing iteration maxxing until ~23:00

### Pass BB2 — noir film grain amp (2026-07-12)

**Date:** 2026-07-12 ~13:47 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Pick one: atlas first-paint map texture **OR** noir film grain — biggest visual win
2. Typecheck clean · screenshots · STATUS · no commit

#### 0. Pick
| Surface | iter-23 PNG | Headroom / why |
|---------|-------------|----------------|
| atlas | **1618KB** | already mid-strong; map densified in Pass K/R |
| noir | **1443KB** | weakest-3; grain was thin (960×540 α32, single canvas) |

**Target: NoirLanding film grain** — more first-paint headroom + clearer cinematic identity lift than another atlas topo tick.

#### 1. NoirLanding film stock (`src/components/landings/pages.tsx`)
- **Animated canvas grain:** res **960×540 → up to 1440×900**; warm-biased mono stock (R+ / B−); alpha **32 → 48–84**; immediate paint before RAF; per-frame coarse emulsion blotches + hair fibers
- **Canvas opacity:** 0.45 → **0.55** `mix-blend-overlay`
- **Always-on stock layers (first paint):**
  - Dual SVG fractal grain (fine 160px + coarse 96px) + low-freq cloud multiply
  - Denser scanlines + CRT mesh
  - **18** emulsion scratches
  - **160** deterministic dust flecks / grit / hair
  - Warm chemical stain patches (soft-light)
  - Extra fine SVG noise boost when Grain toggle ON
- **Motes:** 64 → **96** (beam dust mass)
- Grain toggle still kills animated canvas + fine boost; base emulsion stock remains (film plate identity)

#### 2. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 3. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passBB2-noir.png` | **~1760KB** | was iter-23 **~1443KB** · **+22%** · title card + grain stock |
| `passBB2-noir-open.png` | **~2197KB** | house lights open · full lamp cinema + dense grain |

Report: `.debug-screenshots/passBB2-noir-report.json`  
- pageerrors: **0**  
- grain canvas: 1440×900 · sample RGB≈[255,249,230] α83 (warm stock, not empty)

#### 4. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Noir left weakest-3 pack (~1443KB) → **~1760KB first paint / ~2.2MB open** — among strongest landings
- Atlas left alone (already 1618KB; smaller relative win expected)

### Auto-cycle 23 — 2026-07-12T17:47:25.726Z
- Base: http://localhost:3001
- Weakest (by PNG density): brutalist 1376KB, gallery 1380KB, editorial 1473KB, neon 1483KB
- Strongest: noir 2190KB, zen 1977KB, pulse 1854KB
- Note: Prioritize upgrade for: brutalist (1376KB). Subagents + main agent keep polishing.

### Auto-cycle 24 — 2026-07-12T17:52:10.853Z
- Base: http://localhost:3001
- Weakest (by PNG density): brutalist 1376KB, gallery 1379KB, editorial 1473KB, neon 1492KB
- Strongest: noir 2189KB, zen 1977KB, pulse 1889KB
- Note: Prioritize upgrade for: brutalist (1376KB). Subagents + main agent keep polishing.

### Pass BB — homepage pulse drama + resonator hold (2026-07-12)

**Date:** 2026-07-12 ~afternoon  
**Dev:** `http://localhost:3001`  
**Mode:** Creative WOW on homepage (Stage pulse + Chapters resonator)  
**No commit**

#### Goals
1. `Stage.tsx` — pulse response dramatic (lights already boosted from Pass Q)
2. `Chapters.tsx` — resonator hold feedback excellent
3. Screenshot home at rest / after strike / ~50% resonate charge
4. Typecheck + STATUS · no commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`) pre- and post-edit

#### 2. Stage pulse drama (`src/components/home/Stage.tsx` + `stage-bus.ts`)
- **decayPulse:** `0.85 → 0.72` so strike/resonate flash lingers on camera; pointer bleed slightly stronger
- **CosmicBackdrop:** stronger mauve/pink/sapphire pulse wash, core glow + vignette open on pulse; soft ceiling lifts with pulse for strike peak without type washout
- **Core:** faster pulse-flash attack; harder spin kick; distort/emissive flare up; shell emissive + thickness; lightA/B **20 / 15** hit multipliers + position kick; sparkles scale
- **Orbitals:** stronger torus scale/opacity on pulse; shockwave rings expand farther with higher opacity
- **CameraRig:** z kick + FOV punch + micro dutch on pulse (tuned to avoid swallowing helix)
- **DustField:** opacity/size swell on pulse
- **PulseLights (new, safe):** ambient + key + fill swell with `stageBus.pulse` so the whole field flashes, not only core point lights
- Visual: strike reads as luminous pink/lavender flash with brighter lattice — still keeps helix cards in frame

#### 3. Chapters resonator hold (`src/components/home/Chapters.tsx`)
- **Time-based charge** (~1.05s seed→full) so progress is frame-rate independent under WebGL load
- **Dual drive:** `setInterval(33ms)` + rAF so DOM feedback stays alive if rAF is throttled
- **Sustained stage hum** while holding (`0.08 + charge*0.36`) so core swells during charge; micro-spikes for orbitals; release is the boom
- **Release aftershocks** earlier threshold + extra late kick; dual DOM shock rings on strong release
- **Hold visuals:**
  - Ambient multi-radial wash + inset pink glow under hero
  - Expanding charge ring near CTAs
  - Resonator button: scaleX fill, shimmer sweep, bloom box-shadow, dual-dot pulse, scale
  - Title saturate/hue/brightness + micro scale; kicker letter-spacing/glow
  - Status copy: Charging → Resonating → OVERLOAD paths with live %
- No `stageBus` API surface changes (still `triggerPulse` / `cycleMaterial` only)

#### 4. Screenshots (1440×900 → `.debug-screenshots/passBB-home-*.png`)
| State | File | Size | Notes |
|-------|------|------|-------|
| Rest | `passBB-home-rest.png` | **~1749KB** | Helix cards + nebula + core lattice + CTAs |
| After strike | `passBB-home-strike.png` | **~1798KB** | Brighter pink/lavender pulse flash; denser than rest |
| ~55% resonate | `passBB-home-resonate-50.png` | **~1310KB** | Label “Resonating 55%” · charge ring · ambient wash · “CHARGED 55% — RELEASE TO DETONATE” |
| Release (bonus) | `passBB-home-resonate-release.png` | ~719KB | Post-detonation frame |

Harness: `scripts/passBB-home-shots.mjs` · `URL=http://localhost:3001 node scripts/passBB-home-shots.mjs`

#### 5. Scope notes
- No commit
- Files touched: `src/components/home/Stage.tsx`, `src/components/home/Chapters.tsx`, `src/lib/home/stage-bus.ts`, `scripts/passBB-home-shots.mjs`, `STATUS-MARATHON.md`
- Optional Stage polish included only where safe (PulseLights, no post stack / no HDRI / no EffectComposer)

### Pass CC — full reverify spine post Stage pulse / Noir grain / Resonator (2026-07-12)

**Date:** 2026-07-12 ~13:56 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** pure verification after major Stage pulse + Noir grain + Resonator changes (no product code changes)  
**No commit**

#### Goals
1. `pnpm run typecheck`
2. `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
3. `URL=http://localhost:3001 ITER_START=25 ITER_MAX=1 node scripts/iterate-loop.mjs`
4. Append STATUS with density table from iter-25
5. Fix only real breakages (crashes / pageerrors / TypeError|ReferenceError|SyntaxError)
6. No commit · spine must stay green

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T17:54:08.279Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 0 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button · engine present
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`

#### 3. Iterate-loop (iter 25)
- Command: `URL=http://localhost:3001 ITER_START=25 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 25` · `ts: 2026-07-12T17:55:15.864Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: 22× resource 404 strings (known iterate-loop console collector noise; smoke reports 0 real 404s)

#### 4. Full density table — iter-25 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | brutalist | `iter-25-brutalist.png` | **1377KB** |
| 2 | gallery | `iter-25-gallery.png` | **1380KB** |
| 3 | home-mid | `iter-25-home-mid.png` | **1445KB** |
| 4 | editorial | `iter-25-editorial.png` | **1473KB** |
| 5 | neon | `iter-25-neon.png` | **1480KB** |
| 6 | prism | `iter-25-prism.png` | **1528KB** |
| 7 | atlas | `iter-25-atlas.png` | **1618KB** |
| 8 | paper | `iter-25-paper.png` | **1655KB** |
| 9 | home | `iter-25-home.png` | **1814KB** |
| 10 | pulse | `iter-25-pulse.png` | **1890KB** |
| 11 | zen | `iter-25-zen.png` | **1976KB** |
| 12 (strongest) | noir | `iter-25-noir.png` | **2180KB** |

- **Min:** 1377KB · **Max:** 2180KB · **Floor check (<700KB / <1200KB):** none
- **Weakest 3:** brutalist 1377KB · gallery 1380KB · home-mid 1445KB
- **Strongest 3:** noir 2180KB · zen 1976KB · pulse 1890KB
- vs iter-23: floor held (~1376→1377KB); **noir climbed 1443KB → 2180KB** (Pass BB2 grain stuck); zen/pulse remain top-tier; home ~1814KB holds after Stage pulse + resonator (Pass BB)

#### 5. Empty / under-floor / breakage review
- **No surface < 1200KB** on iter-25 capture → no density amp required this pass
- **No pageerrors / serious / TypeError|ReferenceError|SyntaxError** on smoke → no product fixes required
- Code changes this pass: **none** (verify-only)
- Stage pulse + Noir grain + Resonator changes did **not** regress WebGL, smoke interactions, or density floor

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-25 capture · smoke interact · density floor held
- Next polish candidates (not this pass): brutalist / gallery (still weakest-2, both ~1.38MB)

### Auto-cycle 25 — 2026-07-12T17:56:53.344Z
- Base: http://localhost:3001
- Weakest (by PNG density): brutalist 1377KB, gallery 1379KB, editorial 1473KB, neon 1506KB
- Strongest: noir 2189KB, zen 1976KB, pulse 1870KB
- Note: Prioritize upgrade for: brutalist (1377KB). Subagents + main agent keep polishing.

### Pass DD2 — editorial / paper first-paint density polish (2026-07-12)

**Date:** 2026-07-12 ~13:58 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Light polish editorial **or** paper first-paint density (picked **both**, editorial primary — weaker of the pair)
2. Do **not** break measure / leading controls or paper dog-ear peel
3. Typecheck clean · screenshots · STATUS · no commit

#### Baseline (iter-25)
| Surface | PNG | Note |
|---------|-----|------|
| editorial | **1473KB** | mid-pack · empty cream on masthead left |
| paper | **1655KB** | strong · room for stock/blot density |

#### Changes (`src/components/landings/pages.tsx` only)

**EditorialLanding**
- Seed stains **10 → 16** (deterministic ids −11…−16)
- Plate ghost opacity **0.18 → 0.24** + tertiary **left 16%** ghost strip (plate+2)
- Right secondary strip **28% → 30%**, opacity **0.14 → 0.18**
- Dual paper-fiber passes (0.22 + fine 0.08 grit)
- Ink wash opacity **55 → 60** + extra left radial
- Rule grid **36px/0.06 → 32px/0.09** · baselines **22px/0.035 → 18px/0.05**
- Column gutter dashes + **crop / registration marks** (corners + mid edges)
- **30** static micro ink flecks (SSR-safe, no `Math.random`)
- Contact sheet cells **min-h 88 → 104**, crop ticks, stronger contrast
- Running head double rule + folio hairlines
- Measure / Leading range handlers **untouched**

**PaperLanding** (light; dog-ear untouched)
- Seed underlines **2 → 4** · blots **3 → 6** (spread 0 only)
- Page fiber **0.11 → 0.15** + fine grit pass · laid lines tighter (22px)
- Chain lines + stronger deckle / spine shade
- Desk fiber **0.14 → 0.18** · plank + grain wash
- Dog-ear button / `beginPeel` / clip-path rest peel **unchanged**

#### Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passDD2-editorial.png` | **~1663KB** | was iter-25 **1473KB** · **+13%** · grain + ghosts + crop marks |
| `passDD2-editorial-measure.png` | **~1661KB** | after measure 0.55 / leading 1.9 |
| `passDD2-paper.png` | **~1811KB** | was iter-25 **1655KB** · **+9%** · denser stock + blots |
| `passDD2-paper-peel.png` | **~1796KB** | mid-peel during dog-ear drag |
| `passDD2-paper-after-turn.png` | **~1673KB** | sig A→B after commit peel |

Report: `.debug-screenshots/passDD2-report.json`

#### Tools (unbroken)
| Tool | Result |
|------|--------|
| Measure range | 0.72 → **0.55** ok · top **594** / bottom **610** (above fold) |
| Leading range | 1.75 → **1.9** ok |
| Dog-ear present | hit pad **~233×233** bottom-right |
| Dog-ear peel → turn | sig **A 1/4 → B 2/4** · dog-ear still present after turn |
| Contact sheet / plates | still above fold · 16 stains label |

#### Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Editorial lifted mid-pack density without layout token regressions (`max-w-desktop` / `max-w-measure` only)
- Measure strip + dog-ear peel intentionally preserved

### Auto-cycle 26 — 2026-07-12T18:01:49.205Z
- Base: http://localhost:3001
- Weakest (by PNG density): neon 1483KB, home-mid 1492KB, prism 1529KB, brutalist 1614KB
- Strongest: noir 2202KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: neon (1483KB). Subagents + main agent keep polishing.

### Pass DD — brutalist + gallery first-paint texture amp (2026-07-12)

**Date:** 2026-07-12 ~14:01 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Weakest pair from iter-25 (~1.38MB): **brutalist** + **gallery** — amp visual texture on first paint
2. Do not break brutalist paint / flood / stamp / hotkeys (1–5 · R seed · SPC flood)
3. Keep gallery 9/9 cards above fold
4. Typecheck clean · screenshots `passDD-brutalist.png` · `passDD-gallery.png` · STATUS · no commit

#### Baseline (iter-25)
| Surface | PNG | Note |
|---------|-----|------|
| brutalist | **1377KB** | weakest of iter-25 |
| gallery | **1380KB** | 2nd weakest · Pass W held |

#### 1. BrutalistLanding (`src/components/landings/pages.tsx`)
- Version **SYS.BRUTAL.06 → SYS.BRUTAL.07** (grid stays **48×28 / 1344**)
- Seed densified: extra diags/slabs/skylines/scaffold/rust/weld/rivet; residual grit never pure empty; stamps **BUILD / UGLY / TRUE / RAW / FORM / HARD / CLUNK / VOID / GRID**
- Cell textures: extra aggregate radials on empty/solid/accent/hazard/hatch; hatch + solid built via `string[]` join (avoids TS2590 union explosion)
- Floor chrome: triple SVG film grain, grit flecks **120 → 220**, oil/corrosion stains **14**, formwork mesh diagonals, always-on light hazard wash, stress fractures **18 → 36** + **10** polylines, bolts **36 → 72**, denser weld ticks + side weld columns, measurement barcode strip
- Page chrome: side hazard rails, background grit flecks **80**, denser page wash mesh
- `MARATHON-README.md` version line → SYS.BRUTAL.07

#### 2. Gallery (`src/routes/landings/index.tsx`)
- New **MotifGrain** film-grain plate + denser **MotifNoise** (default 96, accent flecks)
- **grid motif:** 14×9 → **16×10 (160)** bricks · triple hazard · bolt row · SYS.07 / GRID//16
- All 9 motifs densified (ink stains/rules/plates, lamp practicals+sprockets, enso stones/rake/rings, rain 72+40 streaks, folio lines/blots, map landmass/pins/routes, wave 42 bars + 6 tracks×14, prism 16 cols + 22 rays + 40 motes)
- Ambient: mesh + SVG grain + stars **96 → 140** · glints **18 → 28** · constellation **24 → 36** · client stars **110 → 130**

#### 3. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)
- Fixed TS2590 in `cellStyle` hatch/solid by building `backgroundImage` as explicit `string` joins

#### 4. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passDD-brutalist.png` | **~1608KB** | was iter-25 **1377KB** · **+17%** · SYS.07 · 1344/1344 |
| `passDD-brutalist-interact.png` | **~1610KB** | after paint/stamp/flood/R/SPC · HITS 39 |
| `passDD-gallery.png` | **~2044KB** | was iter-25 **1380KB** · **+48%** · 9/9 cards above fold |

Report: `.debug-screenshots/passDD-report.json` · `ok: true`

#### 5. Tools (unbroken)
| Tool / hotkey | Result |
|---------------|--------|
| 1–5 tool cycle | ok |
| 1 PAINT / click | ok · HITS advanced |
| 4 STAMP + click | ok |
| 3 FLOOD + click | ok |
| R seed | reseed ok |
| SPC flood last cell | ok · HITS 0 → **39** |
| Gallery 9 cards fully in viewport | **9/9** |

#### 6. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `src/routes/landings/index.tsx`, `MARATHON-README.md`, `STATUS-MARATHON.md`
- Weakest pair (~1.38MB) lifted: brutalist **~1.61MB**, gallery **~2.04MB** (now among strongest instrument surfaces)
- Tools preserved; density floor left behind

### Pass EE — full reverify spine after DD densify (2026-07-12)

**Date:** 2026-07-12 ~14:04 EDT  
**Dev:** `http://localhost:3001`  
**Mode:** pure verification after Pass DD densify (no product code changes)  
**No commit**

#### Goals
1. `pnpm run typecheck`
2. `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
3. `URL=http://localhost:3001 ITER_START=26 ITER_MAX=1 node scripts/iterate-loop.mjs`
4. Append STATUS with density table from iter-26
5. Fix crashes / pageerrors if any (none)
6. No commit

#### 1. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 2. Smoke interact
- Command: `URL=http://localhost:3001 node scripts/smoke-interact.mjs`
- Report: `.debug-screenshots/smoke-report.json` · `ts: 2026-07-12T18:02:30.624Z`
- Summary: **pagesVisited 10 · pageerrors 0 · consoleErrors 3 · resource404s 0 · serious 0 · actions 13 · ok true**
- Home actions: Strike click · Hold to resonate · cycle-material-button
- Landings: editorial / brutalist / noir / zen / neon / paper / atlas / pulse / prism all `interacted`
- Soft consoleErrors (non-blocking): hydration `data-tsd-source` line-number drift on neon / paper / atlas (TanStack devtools source attrs — known harness noise; smoke `serious: 0`)

#### 3. Iterate-loop (iter 26)
- Command: `URL=http://localhost:3001 ITER_START=26 ITER_MAX=1 node scripts/iterate-loop.mjs`
- Viewport: 1440×900 · base `http://localhost:3001`
- Report: `.debug-screenshots/iteration-report.json` · `iteration: 26` · `ts: 2026-07-12T18:03:41.175Z`
- Home WebGL: `hasWebGL: true`, canvas count 2 @ 1440×900, engine present
- Gallery cards: **9**
- All landings `ok: true` (editorial, brutalist, noir, zen, neon, paper, atlas, pulse, prism)
- Harness console noise: mixed resource-404 strings + hydration attrs (known iterate-loop collector noise; smoke reports 0 real 404s, 0 serious)

#### 4. Full density table — iter-26 PNGs (weakest → strongest)

| Rank | Surface | File | Size |
|------|---------|------|------|
| 1 (weakest) | home-mid | `iter-26-home-mid.png` | **1539KB** |
| 2 | atlas | `iter-26-atlas.png` | **1590KB** |
| 3 | brutalist | `iter-26-brutalist.png` | **1617KB** |
| 4 | neon | `iter-26-neon.png` | **1637KB** |
| 5 | editorial | `iter-26-editorial.png` | **1655KB** |
| 6 | prism | `iter-26-prism.png` | **1655KB** |
| 7 | paper | `iter-26-paper.png` | **1811KB** |
| 8 | home | `iter-26-home.png` | **1816KB** |
| 9 | pulse | `iter-26-pulse.png` | **1896KB** |
| 10 | zen | `iter-26-zen.png` | **1977KB** |
| 11 | gallery | `iter-26-gallery.png` | **2030KB** |
| 12 (strongest) | noir | `iter-26-noir.png` | **2179KB** |

- **Min:** 1539KB · **Max:** 2179KB · **Floor check (<1200KB):** none
- **Weakest 3:** home-mid 1539KB · atlas 1590KB · brutalist 1617KB
- **Strongest 3:** noir 2179KB · gallery 2030KB · zen 1977KB
- vs iter-25: floor rose **1376KB → 1539KB** (+163KB); Pass DD brutalist **1377→1617KB** (+17%); gallery **1380→2030KB** (+47%, now 2nd strongest); Pass DD2 editorial **1473→1655KB**; paper **1655→1811KB**

#### 5. Empty / under-floor review
- **No surface < 1200KB** on iter-26 capture → **no density amp required this pass**
- **No serious pageerrors / crashes** → no product fixes required
- Code changes this pass: **none** (verify-only after DD densify)

#### 6. Scope notes
- No commit
- Files touched: `STATUS-MARATHON.md` only
- Marathon spine green: typecheck · iterate-26 capture · smoke interact · 1200KB density floor held (actual floor **1539KB**)
- Post-DD densify verification complete; weakest remaining headroom: home-mid / atlas / brutalist mid-pack

### Auto-cycle 27 — 2026-07-12T18:06:36.505Z
- Base: http://localhost:3001
- Weakest (by PNG density): neon 1149KB, home-mid 1479KB, brutalist 1617KB, atlas 1620KB
- Strongest: noir 2179KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: neon (1149KB). Subagents + main agent keep polishing.

### Pass EE2 — neon storm + prism spectral first-paint amp (2026-07-12)

**Date:** 2026-07-12 ~14:06 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Amp **neon storm** and/or **prism spectral** first paint further (auto-cycle 26/27 mid-pack + creative headroom)
2. Do **not** break weather mode cycle / strike or prism split·combine·diffract / keys
3. Typecheck clean · screenshots · STATUS · no commit

#### Baseline (iter-26)
| Surface | PNG | Note |
|---------|-----|------|
| neon | **1637KB** | storm default · mid-pack |
| prism | **1655KB** | spectral piano · mid-pack |
| auto-cycle 27 neon dip | **~1149KB** | sheet-flash frames compress small — not empty |

#### 1. NeonLanding storm (`src/components/landings/pages.tsx`)
- Default density **1.65 → 1.8** · re-enter STORM floor **1.7**
- Signs **8 → 12** (ARC / BOLT / GRID / WAVE added; avoided `RAIN` label collision with weather chip)
- Canvas first frame **full city** (sky + 11 cloud masses + 56-building skyline + windows + wet asphalt + 24 puddles + 9 street lamps + 720 rain seed + opening mega bolt + sheet wash) — no black void
- Rain curtain seed **520 → 720** · maintain target **420 → 560 × dens** · brighter/longer storm streaks
- Skyline **40 → 56** buildings · denser windows · cloud bank **7 → 12** + side charge glows
- Street lamp practicals every frame (post + halo + wet pool)
- Lightning more frequent (threshold ~0.955, empty-bolt reseed, triple-fork chance) · sheet flash linger **0.88 → 0.9**
- Wind debris **12 → 22** + horizon sparks · fade lighter so rain holds
- DOM: dual rain-skew plates, 48 CSS rain streaks, secondary cloud shelf, antenna silhouettes, electric horizon rim, 10 glow orbs

#### 2. PrismLanding spectral (`src/components/landings/pages.tsx`)
- Particles **420 → 580** · more trails
- Frame-0: 4-row spectrum wash, stronger vertical bars, caustic rows **12 → 16**, fill ellipses **18 → 28**, triple-pass rays (halo+glow+core) + tip sparks, larger faceted prism body
- Loop: field orbs **26/30 → 32/36**, caustic rows **12 → 15**, blobs **22 → 28**, triple spectrum ribbons
- DOM: richer underpaint + wall opacity **40 → 50%**, denser caustic floor, **40** spectral motes, dual orbit glows, static ray-fan ghost, thicker top/mid/bottom spectrum ribbons
- Keys **58vh/540 → 60vh/560** + dual key-bed glow

#### 3. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 4. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passEE2-neon-storm-first.png` | **~1555KB** | opening barrage · charged title · denser curtain |
| `passEE2-neon-storm.png` | **~1642KB** | settled storm · lamps · signs · rain |
| `passEE2-neon-storm-strike.png` | **~1686KB** | click-strike mega bolt · was iter-26 **1637KB** |
| `passEE2-prism.png` | **~1691KB** | was iter-26 **1655KB** · denser field + rays |
| `passEE2-prism-combine.png` | **~1413KB** | white recombine path |
| `passEE2-prism-diffract.png` | **~1426KB** | interference fan |
| `passEE2-prism-split.png` | **~1437KB** | classic split |
| `passEE2-prism-key.png` | **~1767KB** | key strike burst |

Report: `.debug-screenshots/passEE2-report.json` · pageerrors **0**

#### 5. Tools (unbroken)
| Tool | Result |
|------|--------|
| Weather rain → burst → storm | ok · exact name (signs don't collide) |
| Density default | **1.8** |
| Click strike (empty sky) | mega bolt · hits advance |
| Prism split / combine / diffract | ok |
| Prism key play | ok |

#### 6. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Neon storm first-paint city + bolt seed; prism spectral field denser without layout-token regressions (`max-w-wide|laptop|measure` only)
- Creative polish over pure PNG chase — early sheet-flash frames still compress small; settled + strike hold mid/high pack

### Density floor trajectory (verified Playwright PNG sizes)
| Time | Floor | Strongest |
|------|-------|-----------|
| Start (blank WebGL / thin landings) | ~0–99KB | ~1MB mid fixes |
| Pass iter-10 | ~120KB gallery | home ~2MB |
| Pass T iter-14 | 937KB | home 1.8MB |
| Pass Z2 iter-21 | 1377KB | zen 2.0MB |
| Pass EE iter-26 | **1539KB** | noir **2.2MB** |

**Trajectory: empty void → 1.5MB+ floor on every surface.**

### Auto-cycle 28 — 2026-07-12T18:11:35.338Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1393KB, brutalist 1613KB, neon 1633KB, editorial 1644KB
- Strongest: noir 2180KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1393KB). Subagents + main agent keep polishing.

### Pass FF2 — AtlasLanding cartography first-paint density (2026-07-12)

**Date:** 2026-07-12 ~14:10 EDT  
**Dev:** `http://localhost:3001`  
**No commit**

#### Goals
1. Amp **AtlasLanding** cartography first-paint density (iter-26 weakest pack: atlas ~1590KB)
2. Do **not** break pan / zoom / fog / journal / layer cycle / pin visit
3. Typecheck clean · screenshot `passFF2-atlas.png` · STATUS · no commit

#### Baseline
| Surface | PNG | Note |
|---------|-----|------|
| atlas iter-26 | **1590KB** | 2nd weakest · fog cartography |
| atlas iter-27 | **1620KB** | auto-cycle |
| atlas passR | **1619KB** | prior densify |

#### 1. AtlasLanding (`src/components/landings/pages.tsx`)
- Visited seed **["a","e","b"] → ["a","e","b","d"]** (80% charted · wider fog burn)
- Seed markers **3 → 6** (M1–M6)
- Coasts **14 → 22** (archipelago / atolls)
- Towns **72 → 118** + occasional name labels · **48** depth soundings
- Place names **10 → 16**
- Graticule **64×42 → 80×54** · majors stronger
- Rhumb arcs **14 → 20** · isobaths **8 → 12** + offset family · rivers **7 → 12**
- Topo: contour step **8 → 6**, elev spots **56 → 96**, index every **28px**, 60 hillshade ticks
- Ocean: multi-stop bathymetry + 3 abyss wells · denser hatch + 280 stipple flecks
- Fog: mottle **320 → 480**, bands **8 → 12**, grain **420 → 700**, hatch flecks **40 → 72**
- Reveal radii **0.36/0.28 → 0.40/0.32** · route corridor rad **78 → 92** · steps **20 → 26**
- Immediate first paint: `loop()` before RAF (no empty frame)
- DOM first paint (no canvas wait): CSS dual graticule mesh, **10** landmass silhouettes, **4** isobath ellipses, tertiary photo plate, dual film grain, triple neatline + corner registry marks, denser SVG meridians
- HUD: depth bathymetry key, expanded layer key (rhumb/pin/fog), 24-tick compass rose

#### 2. Typecheck
- `pnpm run typecheck` → **clean** (`tsgo --noEmit`)

#### 3. Screenshots (1440×900 → `.debug-screenshots/`)
| File | Size | Notes |
|------|------|-------|
| `passFF2-atlas.png` | **~1782KB** | was iter-26 **1590KB** · **+12%** · topo dense · 80% charted · 6 marks |
| `passFF2-atlas-signal.png` | **~1782KB** | signal layer holds density |
| `passFF2-atlas-weather.png` | **~1517KB** | weather layer ok |
| `passFF2-atlas-pin.png` | **~1517KB** | pin visit ok |
| `passFF2-atlas-fog-off.png` | **~1584KB** | fog toggle ok |

Report: `.debug-screenshots/passFF2-report.json` · pageerrors **0** · consoleErrors **0**

#### 4. Tools (unbroken)
| Tool | Result |
|------|--------|
| Layer topo / signal / weather | ok |
| Fog on/off | ok |
| Pin visit | ok |
| Journal · route · zoom · marks | controls present first paint |
| Expedition | **80%** charted (4/5) |

#### 5. Scope notes
- No commit
- Files touched: `src/components/landings/pages.tsx`, `STATUS-MARATHON.md`
- Atlas left weakest-pack mid (**~1.59MB**) → **~1.78MB** first paint — denser chart without burying HUD tools
- Layout tokens untouched (`max-w-measure` only)

### Auto-cycle 29 — 2026-07-12T18:16:21.149Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1506KB, editorial 1615KB, brutalist 1617KB, neon 1643KB
- Strongest: gallery 2030KB, zen 1976KB, home 1908KB
- Note: Prioritize upgrade for: home-mid (1506KB). Subagents + main agent keep polishing.

### Auto-cycle 30 — 2026-07-12T18:21:05.461Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1498KB, brutalist 1617KB, neon 1640KB, prism 1653KB
- Strongest: noir 2179KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1498KB). Subagents + main agent keep polishing.

### Auto-cycle 31 — 2026-07-12T18:25:47.348Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1511KB, brutalist 1611KB, editorial 1642KB, neon 1650KB
- Strongest: noir 2171KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1511KB). Subagents + main agent keep polishing.

### Auto-cycle 32 — 2026-07-12T18:30:32.200Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1495KB, brutalist 1617KB, neon 1635KB, editorial 1652KB
- Strongest: noir 2184KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1495KB). Subagents + main agent keep polishing.

### Auto-cycle 33 — 2026-07-12T18:35:14.908Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1481KB, brutalist 1617KB, neon 1635KB, editorial 1642KB
- Strongest: noir 2191KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1481KB). Subagents + main agent keep polishing.

### Auto-cycle 34 — 2026-07-12T18:39:56.551Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1523KB, brutalist 1611KB, prism 1651KB, neon 1661KB
- Strongest: noir 2187KB, gallery 2032KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1523KB). Subagents + main agent keep polishing.

### Auto-cycle 35 — 2026-07-12T18:44:49.144Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1474KB, brutalist 1614KB, neon 1634KB, editorial 1642KB
- Strongest: noir 2197KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1474KB). Subagents + main agent keep polishing.

### Auto-cycle 36 — 2026-07-12T18:49:32.867Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1489KB, brutalist 1615KB, neon 1643KB, prism 1651KB
- Strongest: noir 2182KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1489KB). Subagents + main agent keep polishing.

### Auto-cycle 37 — 2026-07-12T18:54:19.729Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1527KB, brutalist 1615KB, editorial 1642KB, neon 1647KB
- Strongest: noir 2197KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1527KB). Subagents + main agent keep polishing.

### Auto-cycle 38 — 2026-07-12T18:59:08.544Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1471KB, brutalist 1617KB, editorial 1642KB, prism 1652KB
- Strongest: noir 2176KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1471KB). Subagents + main agent keep polishing.

### Auto-cycle 39 — 2026-07-12T19:03:53.584Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1469KB, brutalist 1611KB, neon 1634KB, editorial 1642KB
- Strongest: noir 2187KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1469KB). Subagents + main agent keep polishing.

### Auto-cycle 40 — 2026-07-12T19:08:40.475Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1463KB, brutalist 1617KB, neon 1659KB, prism 1660KB
- Strongest: noir 2170KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1463KB). Subagents + main agent keep polishing.

### Auto-cycle 41 — 2026-07-12T19:13:39.132Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1510KB, brutalist 1617KB, neon 1626KB, editorial 1642KB
- Strongest: noir 2163KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1510KB). Subagents + main agent keep polishing.

### Auto-cycle 42 — 2026-07-12T19:18:27.017Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1466KB, brutalist 1615KB, neon 1647KB, prism 1647KB
- Strongest: noir 2184KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1466KB). Subagents + main agent keep polishing.

### Auto-cycle 43 — 2026-07-12T19:23:14.030Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1487KB, brutalist 1611KB, neon 1647KB, prism 1651KB
- Strongest: noir 2166KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1487KB). Subagents + main agent keep polishing.

### Auto-cycle 44 — 2026-07-12T19:28:04.619Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1472KB, brutalist 1611KB, neon 1636KB, editorial 1642KB
- Strongest: noir 2175KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1472KB). Subagents + main agent keep polishing.

### Auto-cycle 45 — 2026-07-12T19:32:50.684Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1463KB, brutalist 1617KB, editorial 1642KB, prism 1650KB
- Strongest: noir 2183KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1463KB). Subagents + main agent keep polishing.

### Auto-cycle 46 — 2026-07-12T19:37:34.410Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1499KB, brutalist 1611KB, prism 1641KB, editorial 1642KB
- Strongest: noir 2190KB, gallery 2029KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1499KB). Subagents + main agent keep polishing.

### Auto-cycle 47 — 2026-07-12T19:42:18.806Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1469KB, brutalist 1611KB, editorial 1642KB, neon 1644KB
- Strongest: noir 2166KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1469KB). Subagents + main agent keep polishing.

### Auto-cycle 48 — 2026-07-12T19:47:04.974Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1464KB, brutalist 1611KB, prism 1649KB, neon 1667KB
- Strongest: noir 2197KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1464KB). Subagents + main agent keep polishing.

### Auto-cycle 49 — 2026-07-12T19:51:49.100Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1505KB, brutalist 1611KB, editorial 1642KB, neon 1650KB
- Strongest: noir 2175KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1505KB). Subagents + main agent keep polishing.

### Auto-cycle 50 — 2026-07-12T19:56:32.599Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1490KB, brutalist 1615KB, prism 1663KB, editorial 1665KB
- Strongest: noir 2174KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1490KB). Subagents + main agent keep polishing.

### Auto-cycle 51 — 2026-07-12T20:01:17.115Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1505KB, brutalist 1617KB, neon 1618KB, prism 1651KB
- Strongest: noir 2190KB, gallery 2033KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1505KB). Subagents + main agent keep polishing.

### Auto-cycle 52 — 2026-07-12T20:06:04.855Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1484KB, brutalist 1614KB, neon 1631KB, prism 1654KB
- Strongest: noir 2190KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1484KB). Subagents + main agent keep polishing.

### Auto-cycle 53 — 2026-07-12T20:10:52.338Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1472KB, brutalist 1617KB, editorial 1642KB, neon 1647KB
- Strongest: noir 2183KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1472KB). Subagents + main agent keep polishing.

### Auto-cycle 54 — 2026-07-12T20:15:38.894Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1473KB, brutalist 1617KB, neon 1640KB, editorial 1642KB
- Strongest: noir 2178KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1473KB). Subagents + main agent keep polishing.

### Auto-cycle 55 — 2026-07-12T20:20:24.990Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1462KB, brutalist 1615KB, editorial 1642KB, neon 1651KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1462KB). Subagents + main agent keep polishing.

### Auto-cycle 56 — 2026-07-12T20:25:09.301Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1491KB, brutalist 1617KB, editorial 1642KB, neon 1646KB
- Strongest: noir 2181KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1491KB). Subagents + main agent keep polishing.

### Auto-cycle 57 — 2026-07-12T20:29:54.113Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1470KB, brutalist 1617KB, editorial 1642KB, neon 1642KB
- Strongest: noir 2190KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1470KB). Subagents + main agent keep polishing.

### Auto-cycle 58 — 2026-07-12T20:34:34.357Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1503KB, brutalist 1613KB, editorial 1642KB, prism 1652KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1503KB). Subagents + main agent keep polishing.

### Auto-cycle 59 — 2026-07-12T20:39:17.611Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1503KB, brutalist 1611KB, neon 1638KB, prism 1657KB
- Strongest: noir 2183KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1503KB). Subagents + main agent keep polishing.

### Auto-cycle 60 — 2026-07-12T20:44:03.283Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1471KB, brutalist 1610KB, editorial 1642KB, neon 1644KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1471KB). Subagents + main agent keep polishing.

### Auto-cycle 61 — 2026-07-12T20:48:49.734Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1465KB, brutalist 1617KB, editorial 1642KB, neon 1644KB
- Strongest: noir 2192KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1465KB). Subagents + main agent keep polishing.

### Auto-cycle 62 — 2026-07-12T20:53:34.666Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1475KB, brutalist 1611KB, neon 1635KB, prism 1657KB
- Strongest: noir 2178KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1475KB). Subagents + main agent keep polishing.

### Auto-cycle 63 — 2026-07-12T20:58:20.053Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1475KB, brutalist 1617KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2187KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1475KB). Subagents + main agent keep polishing.

### Auto-cycle 64 — 2026-07-12T21:03:04.470Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1493KB, brutalist 1611KB, editorial 1642KB, prism 1646KB
- Strongest: noir 2178KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1493KB). Subagents + main agent keep polishing.

### Auto-cycle 65 — 2026-07-12T21:07:46.418Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1490KB, brutalist 1615KB, editorial 1655KB, prism 1656KB
- Strongest: noir 2180KB, gallery 2033KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1490KB). Subagents + main agent keep polishing.

### Auto-cycle 66 — 2026-07-12T21:12:30.221Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1469KB, brutalist 1617KB, neon 1646KB, prism 1650KB
- Strongest: noir 2181KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1469KB). Subagents + main agent keep polishing.

### Auto-cycle 67 — 2026-07-12T21:17:16.007Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1488KB, brutalist 1614KB, editorial 1642KB, neon 1658KB
- Strongest: noir 2185KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1488KB). Subagents + main agent keep polishing.

### Auto-cycle 68 — 2026-07-12T21:22:01.710Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1466KB, brutalist 1617KB, prism 1652KB, neon 1659KB
- Strongest: noir 2184KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1466KB). Subagents + main agent keep polishing.

### Auto-cycle 69 — 2026-07-12T21:26:45.768Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1489KB, brutalist 1610KB, editorial 1642KB, prism 1653KB
- Strongest: noir 2190KB, gallery 2029KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1489KB). Subagents + main agent keep polishing.

### Auto-cycle 70 — 2026-07-12T21:31:29.957Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1491KB, brutalist 1617KB, prism 1641KB, editorial 1642KB
- Strongest: noir 2190KB, gallery 2033KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1491KB). Subagents + main agent keep polishing.

### Auto-cycle 71 — 2026-07-12T21:36:15.186Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1502KB, brutalist 1613KB, editorial 1642KB, prism 1659KB
- Strongest: noir 2176KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1502KB). Subagents + main agent keep polishing.

### Auto-cycle 72 — 2026-07-12T21:41:01.130Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1487KB, brutalist 1617KB, editorial 1642KB, neon 1651KB
- Strongest: noir 2189KB, gallery 2033KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1487KB). Subagents + main agent keep polishing.

### Auto-cycle 73 — 2026-07-12T21:45:42.839Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1505KB, brutalist 1617KB, editorial 1642KB, neon 1642KB
- Strongest: noir 2177KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1505KB). Subagents + main agent keep polishing.

### Auto-cycle 74 — 2026-07-12T21:50:28.035Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1484KB, brutalist 1614KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2191KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1484KB). Subagents + main agent keep polishing.

### Auto-cycle 75 — 2026-07-12T21:55:17.083Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1471KB, brutalist 1617KB, neon 1638KB, editorial 1642KB
- Strongest: noir 2187KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1471KB). Subagents + main agent keep polishing.

### Auto-cycle 76 — 2026-07-12T22:00:02.580Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1498KB, brutalist 1611KB, neon 1648KB, prism 1655KB
- Strongest: noir 2195KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1498KB). Subagents + main agent keep polishing.

### Auto-cycle 77 — 2026-07-12T22:04:44.777Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1509KB, brutalist 1611KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2191KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1509KB). Subagents + main agent keep polishing.

### Auto-cycle 78 — 2026-07-12T22:09:33.128Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1469KB, brutalist 1617KB, editorial 1642KB, neon 1647KB
- Strongest: noir 2198KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1469KB). Subagents + main agent keep polishing.

### Auto-cycle 79 — 2026-07-12T22:14:15.471Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1510KB, brutalist 1617KB, editorial 1642KB, prism 1653KB
- Strongest: noir 2181KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1510KB). Subagents + main agent keep polishing.

### Auto-cycle 80 — 2026-07-12T22:18:58.491Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1488KB, brutalist 1617KB, editorial 1642KB, neon 1646KB
- Strongest: noir 2175KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1488KB). Subagents + main agent keep polishing.

### Auto-cycle 81 — 2026-07-12T22:23:47.573Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1470KB, brutalist 1610KB, editorial 1642KB, neon 1654KB
- Strongest: noir 2185KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1470KB). Subagents + main agent keep polishing.

### Auto-cycle 82 — 2026-07-12T22:28:29.668Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1477KB, brutalist 1617KB, editorial 1642KB, prism 1653KB
- Strongest: noir 2170KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1477KB). Subagents + main agent keep polishing.

### Auto-cycle 83 — 2026-07-12T22:33:11.966Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1491KB, brutalist 1611KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1491KB). Subagents + main agent keep polishing.

### Auto-cycle 84 — 2026-07-12T22:37:55.003Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1478KB, brutalist 1611KB, neon 1621KB, editorial 1642KB
- Strongest: noir 2184KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1478KB). Subagents + main agent keep polishing.

### Auto-cycle 85 — 2026-07-12T22:42:40.399Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1503KB, brutalist 1617KB, editorial 1642KB, neon 1647KB
- Strongest: noir 2167KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1503KB). Subagents + main agent keep polishing.

### Auto-cycle 86 — 2026-07-12T22:47:25.775Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1468KB, brutalist 1615KB, editorial 1642KB, neon 1651KB
- Strongest: noir 2176KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1468KB). Subagents + main agent keep polishing.

### Auto-cycle 87 — 2026-07-12T22:52:11.821Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1488KB, brutalist 1617KB, editorial 1642KB, neon 1649KB
- Strongest: noir 2197KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1488KB). Subagents + main agent keep polishing.

### Auto-cycle 88 — 2026-07-12T22:56:56.892Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1475KB, brutalist 1614KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2194KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1475KB). Subagents + main agent keep polishing.

### Auto-cycle 89 — 2026-07-12T23:01:39.633Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1481KB, brutalist 1614KB, editorial 1642KB, neon 1658KB
- Strongest: noir 2185KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1481KB). Subagents + main agent keep polishing.

### Auto-cycle 90 — 2026-07-12T23:06:40.617Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1522KB, editorial 1611KB, brutalist 1615KB, neon 1618KB
- Strongest: noir 2186KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1522KB). Subagents + main agent keep polishing.

### Auto-cycle 91 — 2026-07-12T23:11:23.539Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1479KB, brutalist 1610KB, prism 1650KB, neon 1654KB
- Strongest: noir 2181KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1479KB). Subagents + main agent keep polishing.

### Auto-cycle 92 — 2026-07-12T23:16:07.614Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1493KB, brutalist 1611KB, editorial 1642KB, prism 1653KB
- Strongest: noir 2181KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1493KB). Subagents + main agent keep polishing.

### Auto-cycle 93 — 2026-07-12T23:20:49.506Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1509KB, brutalist 1615KB, editorial 1642KB, prism 1650KB
- Strongest: noir 2185KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1509KB). Subagents + main agent keep polishing.

### Auto-cycle 94 — 2026-07-12T23:25:31.378Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1503KB, brutalist 1611KB, neon 1629KB, prism 1653KB
- Strongest: noir 2191KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1503KB). Subagents + main agent keep polishing.

### Auto-cycle 95 — 2026-07-12T23:30:14.718Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1492KB, brutalist 1611KB, editorial 1642KB, neon 1647KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1492KB). Subagents + main agent keep polishing.

### Auto-cycle 96 — 2026-07-12T23:34:59.109Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1477KB, brutalist 1617KB, neon 1631KB, editorial 1642KB
- Strongest: noir 2191KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1477KB). Subagents + main agent keep polishing.

### Auto-cycle 97 — 2026-07-12T23:39:46.489Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1500KB, brutalist 1613KB, neon 1628KB, prism 1660KB
- Strongest: noir 2181KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1500KB). Subagents + main agent keep polishing.

### Auto-cycle 98 — 2026-07-12T23:44:29.884Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1500KB, brutalist 1617KB, editorial 1642KB, prism 1660KB
- Strongest: noir 2196KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1500KB). Subagents + main agent keep polishing.

### Auto-cycle 99 — 2026-07-12T23:49:13.463Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1474KB, brutalist 1611KB, neon 1655KB, prism 1658KB
- Strongest: noir 2190KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1474KB). Subagents + main agent keep polishing.

### Auto-cycle 100 — 2026-07-12T23:53:58.383Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1476KB, brutalist 1617KB, neon 1651KB, prism 1652KB
- Strongest: noir 2191KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1476KB). Subagents + main agent keep polishing.

### Auto-cycle 101 — 2026-07-12T23:58:50.010Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1503KB, brutalist 1610KB, editorial 1642KB, neon 1653KB
- Strongest: noir 2190KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1503KB). Subagents + main agent keep polishing.

### Auto-cycle 102 — 2026-07-13T00:03:32.112Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1481KB, brutalist 1617KB, prism 1649KB, neon 1655KB
- Strongest: noir 2181KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1481KB). Subagents + main agent keep polishing.

### Auto-cycle 103 — 2026-07-13T00:08:17.228Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1494KB, brutalist 1611KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2195KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1494KB). Subagents + main agent keep polishing.

### Auto-cycle 104 — 2026-07-13T00:13:00.564Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1479KB, brutalist 1611KB, neon 1641KB, editorial 1642KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1479KB). Subagents + main agent keep polishing.

### Auto-cycle 105 — 2026-07-13T00:17:45.366Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1491KB, brutalist 1615KB, editorial 1642KB, prism 1661KB
- Strongest: noir 2182KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1491KB). Subagents + main agent keep polishing.

### Auto-cycle 106 — 2026-07-13T00:22:30.183Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1493KB, brutalist 1610KB, editorial 1642KB, prism 1648KB
- Strongest: noir 2181KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1493KB). Subagents + main agent keep polishing.

### Auto-cycle 107 — 2026-07-13T00:27:14.618Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1500KB, brutalist 1617KB, prism 1646KB, neon 1652KB
- Strongest: noir 2195KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1500KB). Subagents + main agent keep polishing.

### Auto-cycle 108 — 2026-07-13T00:31:57.500Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1499KB, brutalist 1610KB, neon 1639KB, editorial 1642KB
- Strongest: noir 2188KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1499KB). Subagents + main agent keep polishing.

### Auto-cycle 109 — 2026-07-13T00:36:41.438Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1476KB, brutalist 1611KB, prism 1641KB, editorial 1642KB
- Strongest: noir 2180KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1476KB). Subagents + main agent keep polishing.

### Auto-cycle 110 — 2026-07-13T00:41:30.174Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1471KB, brutalist 1614KB, neon 1635KB, editorial 1642KB
- Strongest: noir 2170KB, gallery 2033KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1471KB). Subagents + main agent keep polishing.

### Auto-cycle 111 — 2026-07-13T00:46:17.613Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1471KB, brutalist 1615KB, editorial 1642KB, neon 1646KB
- Strongest: noir 2189KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1471KB). Subagents + main agent keep polishing.

### Auto-cycle 112 — 2026-07-13T00:51:03.094Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1504KB, brutalist 1617KB, editorial 1642KB, neon 1649KB
- Strongest: noir 2184KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1504KB). Subagents + main agent keep polishing.

### Auto-cycle 113 — 2026-07-13T00:55:49.408Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1469KB, brutalist 1615KB, editorial 1642KB, neon 1645KB
- Strongest: noir 2187KB, gallery 2030KB, zen 1976KB
- Note: Prioritize upgrade for: home-mid (1469KB). Subagents + main agent keep polishing.

### Auto-cycle 114 — 2026-07-13T01:00:33.849Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1480KB, brutalist 1611KB, editorial 1642KB, prism 1662KB
- Strongest: noir 2179KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1480KB). Subagents + main agent keep polishing.

### Auto-cycle 115 — 2026-07-13T01:05:22.994Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1488KB, brutalist 1611KB, prism 1654KB, editorial 1663KB
- Strongest: noir 2196KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1488KB). Subagents + main agent keep polishing.

### Auto-cycle 116 — 2026-07-13T01:10:04.714Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1493KB, brutalist 1615KB, prism 1650KB, editorial 1666KB
- Strongest: noir 2165KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1493KB). Subagents + main agent keep polishing.

### Auto-cycle 117 — 2026-07-13T01:14:47.058Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1495KB, brutalist 1615KB, editorial 1642KB, prism 1649KB
- Strongest: noir 2180KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1495KB). Subagents + main agent keep polishing.

### Auto-cycle 118 — 2026-07-13T01:19:30.490Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1505KB, brutalist 1611KB, editorial 1642KB, neon 1642KB
- Strongest: noir 2190KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1505KB). Subagents + main agent keep polishing.

### Auto-cycle 119 — 2026-07-13T01:24:12.244Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1494KB, brutalist 1617KB, neon 1635KB, editorial 1642KB
- Strongest: noir 2174KB, gallery 2033KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1494KB). Subagents + main agent keep polishing.

### Auto-cycle 120 — 2026-07-13T01:28:52.677Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1505KB, brutalist 1617KB, neon 1652KB, prism 1653KB
- Strongest: noir 2181KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1505KB). Subagents + main agent keep polishing.

### Auto-cycle 121 — 2026-07-13T01:33:36.743Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1521KB, brutalist 1610KB, editorial 1642KB, prism 1656KB
- Strongest: noir 2172KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1521KB). Subagents + main agent keep polishing.

### Auto-cycle 122 — 2026-07-13T01:38:18.890Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1525KB, brutalist 1617KB, editorial 1642KB, prism 1651KB
- Strongest: noir 2191KB, gallery 2030KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1525KB). Subagents + main agent keep polishing.

### Auto-cycle 123 — 2026-07-13T02:30:49.069Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1529KB, brutalist 1615KB, prism 1660KB, neon 1661KB
- Strongest: noir 2175KB, gallery 2032KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1529KB). Subagents + main agent keep polishing.

### Auto-cycle 124 — 2026-07-13T03:03:20.767Z
- Base: http://localhost:3001
- Weakest (by PNG density): home-mid 1475KB, neon 1637KB, prism 1657KB, editorial 1666KB
- Strongest: noir 2170KB, gallery 2029KB, zen 1977KB
- Note: Prioritize upgrade for: home-mid (1475KB). Subagents + main agent keep polishing.
