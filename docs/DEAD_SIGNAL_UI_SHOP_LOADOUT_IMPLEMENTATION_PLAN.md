# DEAD SIGNAL — UI, Shop, and Loadout Implementation Plan

> Reconciliation (branch `ui-shop-loadout`, on top of `meta-hub`): the meta-hub
> rework already deleted the in-run Field Station (`StationPanel.ts` gone,
> waves auto-deploy, scrap converts to gold 1:1, perks are 3 persistent player
> perks, no weapon tiers). So this plan executes as: gun catalog metadata in
> `src/config/weapons.ts` (stage/role/desc/order/side, single PRICE source);
> command-screen menu + deployment brief in new `src/meta/MenuUI.ts`
> (loadout recap + wave-1-only Threat Scan); hub SHOP in armory order with
> sidegrade tags, NEED-N-MORE deficit labels, and a keep-confirm when both
> carry slots are full; Emergency Cache deferred (ammo crates cover it);
> balance verified via existing TTK bands (no changes needed).

## Purpose

Redesign the main menu, Field Station shop, and in-run loadout around a clear **prepare → deploy → survive** loop. This plan is grounded in the repository’s current TypeScript, Three.js, DOM/CSS UI, run-scoped scrap economy, and three-slot inventory. It does not introduce a UI framework or change the local-first runtime model.

## Scope and decisions

### In scope

- A command-screen main menu and a compact deployment briefing.
- A Field Station with **Loadout**, **Armory**, **Supplies**, **Intel**, and **Deploy** sections.
- A clearly ordered primary weapon path, with optional sidegrades.
- Removal of the permanent passive perk system.
- Small, run-scoped alternatives: Threat Scan and Emergency Cache.
- Clear slot replacement confirmation and useful affordability feedback.
- Tests, documentation, and balance verification for the changed systems.

### Explicitly out of scope for this pass

- Persistent weapon ownership, player accounts, backend, cloud saves, multiplayer, or a new dependency.
- Turrets, barricades, doors, crafting, attachment inventories, or new world-placement mechanics.
- Weapon tier upgrades. The current repository documentation mentions tiers and doors, but the current source does not implement either; do not add UI for systems that do not exist.
- A pre-run weapon purchase system. Scrap resets at the beginning of every run, so weapon purchase remains in-run.

## Current repository constraints to preserve

- Technology: TypeScript, Three.js, Vite, DOM/CSS UI, Web Audio, and Vitest.
- `src/app/GameState.ts` owns valid transitions.
- `src/app/GameApp.ts` coordinates state, input, weapon switching, game loop, and UI wiring.
- `src/progression/PurchaseService.ts` owns inventory mutation and atomic purchase validation.
- `src/config/weapons.ts` and `src/config/upgrades.ts` own the current weapon and price data.
- Inventory has exactly three slots: one sidearm (`side`) and two carry slots (`c1`, `c2`). The HUD already maps these to keys 1–3.
- Scrap is awarded for kills and wave completion, then discarded when a run restarts. Settings and records are the only persisted data.
- The Field Station currently opens in intermission and is deliberately safe from click leakage. Preserve its input guard and station state behavior.

## Target player flow

```text
MAIN MENU
  └─ DEPLOY
      └─ Deployment Brief: choose difficulty
          └─ Tutorial / Run start
              └─ Fight wave
                  └─ Intermission
                      └─ FIELD STATION
                          ├─ Loadout
                          ├─ Armory
                          ├─ Supplies
                          ├─ Intel
                          └─ Deploy next wave
```

## Target information architecture

### Main menu

Use a two-column command screen, keeping the existing industrial-horror color system:

```text
DEAD SIGNAL / QUARANTINE PROTOCOL                 LAST RUN
─────────────────────────────────────────         Best Wave 12
[ DEPLOY ]                                        Kills 843
  Select difficulty and begin                     Longest 14:23

[ RECORDS ]   [ SETTINGS ]   [ CREDITS ]          BUILD 0.7
```

- **Deploy** is the primary action.
- Records, settings, and credits remain available but visually secondary.
- Retain the current charcoal background, amber interaction color, teal success color, and red danger color.
- Use the live world canvas as a dimmed backdrop where safe; do not add external visual assets.

### Deployment brief

Replace the separate, generic detail menu with a single deployment step:

```text
DEPLOYMENT BRIEF
Difficulty: [ Recruit ] [ Standard ] [ Containment ]
Starting kit: Service Pistol · 48 reserve rounds
Objective: Hold Processing Block 07

[ START RUN ]
```

The tutorial can remain as the next screen for new players. Update its wording from “Buy upgrades” to “Use the Field Station between waves.”

### Field Station sections

```text
FIELD STATION                                      ◈ 840 SCRAP
Loadout | Armory | Supplies | Intel | Deploy
```

1. **Loadout** — equipped slots, active weapon, select actions, and intentional replacement.
2. **Armory** — ordered primary path plus separately labeled sidegrades.
3. **Supplies** — existing ammo and field dressings, plus Emergency Cache.
4. **Intel** — Threat Scan; show useful next-wave information after purchase.
5. **Deploy** — persistent call to action in intermission, including next-wave number.

Do not show a Perks tab.

## Weapon hierarchy and balance direction

### Main progression path

The Armory should display this ascending order, even though players can choose based on role:

| Stage | Weapon | Role | Price |
| --- | --- | --- | ---: |
| Issued | Service Pistol | Accurate fallback sidearm | Free |
| I | Breacher | Close-range burst | 450 |
| II | Compact SMG | Early crowd control | 700 |
| III | Patrol Rifle | Reliable all-rounder | 950 |
| IV | Marksman Rifle | Precision and special-enemy removal | 1,200 |
| V | LMG | Sustained late-wave crowd control | 1,400 |

### Optional sidegrades

Keep sidegrades visually distinct so they do not disrupt the price ladder:

| Weapon | Placement | Proposed price | Reason |
| --- | --- | ---: | --- |
| Heavy Pistol | Sidearm alternative | 600 | High-damage fallback for precision players. |
| Rapid SMG | Compact SMG specialization | 1,050–1,100 | Avoids making it appear to supersede the Patrol Rifle at 900. |

### Armory card requirements

Every card must show:

- Stage, price, role, and a short operational description.
- Damage, magazine size, fire mode, and a meaningful handling cue.
- Whether it will occupy an empty slot or replace a named weapon.
- “Need N more scrap” when unaffordable.
- An explicit confirmation only when replacing an occupied slot or making a high-cost purchase.

Do not add ambiguous visual stat bars until derived comparisons are implemented accurately.

## Replacing perks

Remove the existing permanent passive perks:

- Field Dressing (+25 max health)
- Steady Hands (-25% spread/recoil)
- Scavenger (+15% scrap)

The existing **Field Dressing** name should be reused only for the already implemented consumable healing charge, avoiding two unrelated meanings.

### Replacement purchases

| Section | Item | Suggested price | Effect | Implementation cost |
| --- | --- | ---: | --- | --- |
| Supplies | Ammo refill | 100 | Existing owned-weapon refill. | Already implemented |
| Supplies | Field dressing | 75 | Existing +35 HP consumable, maximum 3. | Already implemented |
| Supplies | Emergency Cache | 180 | Refill all carried weapon reserves once. | Low |
| Intel | Threat Scan | 50 | Reveal next wave number, enemy composition, and special count. | Low |

Threat Scan is the preferred first addition. It gives players a real decision without inventing a global passive bonus; it can read the existing `WaveDirector` queue or wave composition data. Emergency Cache should be implemented only after the scan works and should not invalidate the utility of existing ammo crates.

## Phased implementation

## Phase 0 — Baseline and data audit

### Files

- `README.md`
- `docs/DEAD_SIGNAL_IMPLEMENTATION_PLAN.md`
- `src/config/weapons.ts`
- `src/config/upgrades.ts`

### Work

1. Confirm current build, typecheck, and test baseline after installing dependencies in a normal development checkout.
2. Record the actual implemented economy and remove documentation claims for unimplemented weapon tiers and doors, unless those features are separately scheduled.
3. Rename or replace `src/config/upgrades.ts` with a clearer shop catalog module. Keep changes data-driven.
4. Add player-facing metadata to weapons: `stage`, `role`, `description`, `armoryOrder`, and `isSidegrade`.
5. Move prices to the same catalog or retain a single imported price table—never duplicate prices across UI and purchase code.

### Acceptance checks

- Existing weapons retain their actual gameplay stats and models.
- There is one authoritative price per purchasable item.
- Documentation matches implemented systems.
- `npm run typecheck`, `npm test`, and `npm run build` pass.

## Phase 1 — Main menu and deployment brief

### Files

- `src/app/GameApp.ts`
- `src/styles/base.css`
- `src/styles/hud.css` or a new focused menu stylesheet imported from `src/main.ts`
- `src/app/GameState.ts` only if a distinct loadout/deployment state is necessary

### Work

1. Extract the inline main-menu markup in `GameApp.menu()` into a focused UI renderer or keep it local with small, readable helper functions. Do not introduce React.
2. Redesign the main screen as the command layout specified above.
3. Consolidate difficulty selection into the deployment brief.
4. Preserve current settings, records, credits, audio unlocking, confirmation prompts, and valid state transitions.
5. Update tutorial wording and controls to mention the Field Station, not upgrades.
6. Verify keyboard focus, contrast, responsive behavior at 1920×1080 and a smaller desktop window, and a reachable Back action from every menu.

### Acceptance checks

- New Run/Deploy reaches difficulty selection and starts a run exactly as before.
- Records reset still requires confirmation and does not reset settings.
- Settings and credits still return cleanly to the main menu.
- Main-menu rendering does not duplicate overlay nodes after repeated navigation.

## Phase 2 — Shop catalog and purchase contracts

### Files

- `src/config/weapons.ts`
- `src/config/upgrades.ts` or replacement shop catalog module
- `src/progression/PurchaseService.ts`
- `src/progression/Economy.ts`
- `tests/economy.test.ts`

### Work

1. Replace the current category-driven price lookup with an ordered catalog for armory display.
2. Retain `Shop.buy()` as the sole mutation path for weapons and preserve its atomic validation behavior.
3. Remove `Inv.perks`, `Shop.perk()`, `PERKS`, and perk-specific effects in `GameApp` only after the replacement UI is ready.
4. Add a catalog-backed purchase entry for Emergency Cache if Phase 4 is approved.
5. Define a purchase result shape that can communicate: purchased, selected, requires replacement confirmation, not enough scrap, full, and already owned.
6. Keep the existing three-slot model and controlled replacement behavior. Do not silently delete a weapon without the UI clearly naming it.

### Acceptance checks

- No negative scrap, duplicate weapon ownership, duplicate supply buying, or double charges.
- Replacing sidearm, primary A, and primary B is deterministic and tested.
- The Rapid SMG price and placement agree everywhere.
- Removing perks does not leave unused imports, dead effects, or stale UI copy.

## Phase 3 — Field Station information architecture

### Files

- `src/ui/StationPanel.ts`
- `src/styles/hud.css`
- `src/app/GameApp.ts`
- `src/ui/HUD.ts`
- `tests/economy.test.ts`

### Work

1. Replace the current `pistols / smgs / rifles / heavy / perks / supply` tabs with `loadout / armory / supplies / intel / deploy`.
2. Make Loadout the default station section. Render sidearm, primary A, and primary B in the same order as the HUD.
3. Render Armory’s main path in strict `armoryOrder`, with optional sidegrades in a separate subsection.
4. Render Supplies from the player’s current owned weapons and existing heal count.
5. Preserve the station’s click-leak guard (`EAT_MS`), escape behavior, high-cost confirmation timeout, and pointer-lock restoration.
6. Make the deploy call-to-action consistently visible during intermission, not as an isolated top button.
7. Improve HUD slot labels only enough to match the Field Station terminology; retain the compact in-combat presentation.

### Acceptance checks

- Station opens automatically after a cleared wave and manually with B exactly as before.
- Opening, closing, deploying, buying, selecting, and switching weapons cannot leave the game in an invalid state.
- Every visible station button has an action or a disabled explanation.
- A player can tell which item will be replaced before confirming the transaction.
- The panel remains usable at desktop resolutions without horizontal clipping.

## Phase 4 — Intel and supply alternatives

### Files

- `src/config/waves.ts`
- `src/waves/WaveDirector.ts`
- `src/progression/PurchaseService.ts`
- shop catalog module
- `src/ui/StationPanel.ts`
- `src/app/GameApp.ts`
- `tests/waves.test.ts`
- `tests/economy.test.ts`

### Work: Threat Scan

1. Add a read-only Wave Director method that returns the next-wave composition. Do not expose or mutate its queue directly from the UI.
2. Add a one-time, run-scoped `threatScan` purchase state for the upcoming wave.
3. On purchase, show the next wave number, enemy counts by type, and a concise warning for brutes, crushers, or stalkers.
4. Clear the scan when the next wave begins; do not persist it across runs.

### Work: Emergency Cache

1. Add a one-per-intermission or one-per-run policy; choose one and encode it in inventory state and the UI.
2. Refill reserve ammunition for all owned, carried weapon instances.
3. Price it higher than a normal single-weapon refill and verify it does not make ammo crates irrelevant.
4. Use a clear result message and HUD feed entry.

### Acceptance checks

- Threat Scan cannot be purchased twice for the same upcoming wave.
- Scan values match Wave Director’s actual spawn plan.
- Emergency Cache does not overfill reserves or charge when all reserves are full.
- Both purchases are transactionally safe and covered by tests.

## Phase 5 — Balance pass

### Files

- shop catalog module
- `src/config/weapons.ts`
- `src/config/waves.ts`
- `src/config/enemies.ts`
- `README.md`

### Work

1. Play or simulate enough early waves to estimate expected scrap timing for the Stage I–V ladder.
2. Ensure the Breacher is realistically attainable early, Compact SMG arrives before crowd pressure becomes excessive, and Patrol Rifle remains a compelling generalist choice.
3. Test a close-range, automatic-fire, precision, and endurance build rather than assuming the most expensive weapon is always best.
4. Verify enemy rewards and wave bonuses make meaningful purchases possible without trivializing healing/ammo choices.
5. Tune sidegrade prices only after their practical combat roles are tested.

### Acceptance checks

- There is no objectively mandatory purchase at every price point.
- The listed progression reads cleanly from cheap to expensive.
- Supply and intel purchases are occasionally valuable but do not dominate weapon spending.
- README economy examples are accurate.

## Phase 6 — Regression, polish, and documentation

### Files

- `README.md`
- `docs/DEAD_SIGNAL_IMPLEMENTATION_PLAN.md`
- relevant UI, economy, and wave tests

### Work

1. Update README controls and loop description to use Field Station, Loadout, Armory, Supplies, Intel, and Deploy terminology.
2. Remove stale references to perks, tiers, and doors unless independently implemented.
3. Add tests for every pure purchase, replacement, and intel rule.
4. Manually test: first run, repeated station use, all slot replacements, death/retry, return to menu, settings persistence, and records reset.
5. Inspect no-console-error behavior after opening and closing the station across multiple waves.

### Acceptance checks

- `npm run typecheck` passes.
- `npm test` passes.
- `npm run build` passes.
- A full run can move through menu → deployment → waves → station → death/retry without invalid state transitions or broken pointer lock.
- No visible UI describes an unavailable system.

## Suggested order of commits

1. `docs: align progression specification with implemented systems`
2. `feat: add command-style main menu and deployment brief`
3. `refactor: centralize armory catalog and remove passive perks`
4. `feat: redesign field station around loadout and armory`
5. `feat: add threat scan and emergency cache`
6. `test: cover shop catalog, replacement, and intel purchases`
7. `docs: update gameplay loop and economy`

## Risks and guardrails

| Risk | Guardrail |
| --- | --- |
| Shop visual redesign breaks safe input handling | Preserve and test the existing pointer-down/click guard and pointer-lock flow. |
| Replacing weapons feels punitive | Name the item being replaced before confirmation; do not add refunds until balance data supports them. |
| New purchases make the game too easy | Start with Threat Scan; add Emergency Cache only with a cap and balance test. |
| Data is duplicated across UI and transactions | Use one catalog/configuration source and import it into both layers. |
| Documentation drifts again | Make README/spec alignment part of every progression change. |
| Scope expands into a base-building game | Defer barricades, turrets, doors, and attachments to separately planned features. |

## Definition of done

The work is complete when the game has a readable command-style main menu, a deployment brief, a Field Station centered on real three-slot loadout management, a visibly cheapest-to-most-expensive armory path, no perk system, and transactionally safe supplies/intel alternatives. The TypeScript build, tests, and production build must pass, and the documentation must describe only systems that actually exist.
