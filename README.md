# DEAD SIGNAL — QUARANTINE PROTOCOL
Local-first single-player FPS zombie survival. TypeScript + Three.js + Vite. No backend, no network at runtime.
## Run
`npm ci` · `npm run dev` → http://localhost:5173 · `npm run build` · `npm run test` · `npm run typecheck`
## Controls
WASD move · mouse look · LMB fire · R reload · 1-4 weapons · H use heal · G graphics preset · Enter skip intermission · Esc pause
## Loop
Pick difficulty → tutorial prompts → fight waves → spend scrap between waves (weapons, tiers, perks, ammo, heals) → die → records → retry.
Economy: kills 20/25/45 scrap · wave 40+10/wave · shotgun 450 · SMG 700 · rifle 950 · tiers 350/650/1000 · perks 300-400.
## Arch
`src/app` loop+state machine · `src/config` balance tables (single source) · `src/core` input/collision/nav/pool · `src/{player,weapons,enemies,waves,world,assets,progression,audio,ui,persistence}` owned systems · `tests` vitest (35 tests) · spec `docs/DEAD_SIGNAL_IMPLEMENTATION_PLAN.md`.
Update order each frame: input → player → weapon → enemy → combat → waves → interact → fx → render → HUD.
## Troubleshoot
WebGL error → desktop Chrome/Edge + hardware acceleration. No audio until first click (browser policy). Low preset (G key or settings) if slow. Records reset in RECORDS screen; settings persist separately.
