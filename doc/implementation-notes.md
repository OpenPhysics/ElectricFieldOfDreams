# Implementation Notes - Electric Field of Dreams

Developer-facing notes on the architecture. The physics itself is documented for educators in
[model.md](./model.md).

## Architecture Overview

Electric Field of Dreams is a single-screen SceneryStack port of PhET's *Electric Field of Dreams*,
fusing the original `EFDSimulation` + `System` + ordered "laws/propagators" into one model class.

```
src/
  main.ts, brand.ts, splash.ts, assert.ts, init.ts
  ElectricFieldOfDreamsColors.ts, ElectricFieldOfDreamsNamespace.ts
  i18n/StringManager.ts, strings_*.json
  preferences/                                          fieldLatticeWidth query param
  electric-field-of-dreams/
    ElectricFieldOfDreamsScreen.ts
    model/
      ElectricFieldOfDreamsModel.ts     TModel: six-law step chain, particle array
      Particle.ts                       q, m, kinematics, isDraggingProperty
      ChargeFieldCalculator.ts          lattice field sampling (visualization only)
      ElectricFieldOfDreamsConstants.ts
    view/
      ElectricFieldOfDreamsScreenView.ts
      FieldGridNode.ts                  arrow lattice from getFieldAt
      ParticleNode.ts                   draggable charges
      BoundsNode.ts
      ParticleControlPanel.ts, ExternalFieldControlPanel.ts
      ElectricFieldOfDreamsScreenSummaryContent.ts, ElectricFieldOfDreamsKeyboardHelpContent.ts
```

Data flows Model → View through AXON `Property` objects and `particles` `ObservableArray`
(elementAdded/RemovedEmitter drives dynamic `ParticleNode` lifecycle).

## Key design decisions

- **Six laws per slice, original order.** `applyLaws(dt)`: (1) reset acceleration, (2) bounce
  walls N→E→W→S, (3) uniform external field **a** += q**E**/m, (4) Coulomb pair forces, (5)
  velocity integration capped at `MAX_VELOCITY`, (6) position integration. Plain explicit Euler.
- **Two Coulomb constants.** `COULOMB_K` (100000) for inter-particle forces; `FIELD_CALC_K`
  (120000) **only** for `ChargeFieldCalculator` / arrow grid — do not unify them.
- **Dragged particles.** `isDraggingProperty` excludes a particle from integration but it
  remains in the Coulomb source list (`all` vs `active` filter).
- **East-wall bounce quirk.** `vx = -|vx| - inset` on the east wall — verbatim from PhET's
  `FourBoundsPropagator`; intentional port fidelity.
- **coulombForce guard.** Non-finite force → zero vector (prevents NaN blow-ups at zero
  separation).
- **Fixed timestep accumulator.** `FRAME_DURATION` = 35 ms wall-clock; `DT_PER_FRAME` = 0.15 model
  seconds per slice; `MAX_CATCHUP_STEPS` = 5. Step button → `stepOnce()`.
- **Y-down model space.** `ModelViewTransform2` with non-inverted Y (+y is down), matching PhET.
- **Nested constants.** `src/electric-field-of-dreams/model/ElectricFieldOfDreamsConstants.ts`.

## View components

- **ElectricFieldOfDreamsScreenView** — play area, right control column, play/pause/step, Reset
  All. Maintains `Map<Particle, ParticleNode>` synced to `particles` array.
- **FieldGridNode** — recomputes `model.getFieldAt(x,y)` over `fieldLatticeWidth²` grid each
  frame; density slider increases cost.
- **ParticleNode** — drag listener sets `isDraggingProperty`; release re-enables integration.
- **ExternalFieldControlPanel** — draggable arrow sets `externalFieldProperty` magnitude and
  direction.
- **ParticleControlPanel** — add/remove, charge sign, light/heavy mass.

Knob stroke in `ExternalFieldControlPanel` uses hardcoded `rgba(0,0,0,0.4)` (decorative carve-out).

## Disposal conventions

**ParticleNode** instances dispose when removed from `particles` (`removeParticleNode` in
`ElectricFieldOfDreamsScreenView`). Screen-lifetime panels and `FieldGridNode` persist for the
session. Unlink `ObservableArray` listeners if the screen lifecycle ever changes.

## Testing

`npm test` (vitest):

- `tests/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.test.ts` — construction,
  reset clears particles, paused model does not integrate
- `tests/memory-leak.test.ts` — WeakRef/GC regression suite

CI gate: `npm run lint && npm run check && npm run build`.

## Multi-screen simulations

Single-screen.
