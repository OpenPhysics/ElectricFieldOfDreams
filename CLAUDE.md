# CLAUDE.md — Electric Field of Dreams

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenPhysics/.github/CLAUDE.md](https://github.com/OpenPhysics/.github/blob/main/CLAUDE.md).

## Project

SceneryStack port of the PhET *Electric Field of Dreams* simulation. Place charged particles, observe Coulomb forces, and visualize the field with an adjustable uniform external field. The model fuses the original's `EFDSimulation` + `System` + its ordered list of "laws"/"propagators" into one `step` chain.

## Key files

| Area | Location |
|---|---|
| Screen | `src/electric-field-of-dreams/ElectricFieldOfDreamsScreen.ts` |
| Model | `model/ElectricFieldOfDreamsModel.ts` (laws + stepping), `Particle.ts`, `ChargeFieldCalculator.ts` (arrow-grid sampling), `ElectricFieldOfDreamsConstants.ts` |
| View | `view/ElectricFieldOfDreamsScreenView.ts`, `ParticleNode.ts`, `FieldGridNode.ts` (arrow lattice), `ExternalFieldControlPanel.ts`, `ParticleControlPanel.ts`, `BoundsNode.ts` |
| Colors / strings | `ElectricFieldOfDreamsColors.ts`, `src/i18n/StringManager.ts` |
| Preferences / query params | `src/preferences/` (`fieldLatticeWidth` query param) |

## Model

`ElectricFieldOfDreamsModel implements TModel`. State lives in a small set of Properties + an observable particle array.

| Property | Type | Meaning |
|---|---|---|
| `particles` | `ObservableArray<Particle>` | every charge in the box; views add/remove nodes off this |
| `externalFieldProperty` | `Vector2Property` | uniform external field (set by the External Field arrow control) |
| `fieldLatticeWidthProperty` | `NumberProperty` | arrows per axis in the visualization lattice (density slider) |
| `isPlayingProperty` | `BooleanProperty` | play/pause |
| `Particle.{position,velocity,acceleration}Property` | `Vector2Property` | per-particle kinematics |
| `Particle.isDraggingProperty` | `BooleanProperty` | drag detaches the particle from integration |

The box is a `SYSTEM_WIDTH × SYSTEM_HEIGHT` (300×300) region at `(SYSTEM_MIN_X, SYSTEM_MIN_Y)`. **Model Y increases downward** (screen-style): "North" is `minY`.

### Stepping & numerics

- **Fixed timestep with a wall-clock accumulator.** `step(dt)` accumulates real time and runs whole slices of `FRAME_DURATION` (35 ms) each advancing `DT_PER_FRAME` (0.15) model-seconds; `MAX_CATCHUP_STEPS` (5) caps slices/frame so a stutter can't spiral. The Step button calls `stepOnce()` (one slice regardless of play state).
- **Six laws per slice, in the original order** (`applyLaws`): (1) reset acceleration, (2) bounce off the four walls (N→E→W→S), (3) uniform external field, (4) Coulomb inter-particle force, (5) velocity integration capped at `MAX_VELOCITY` (100), (6) position integration. Plain **explicit Euler**.
- Two different K constants: `COULOMB_K` (100000) drives inter-particle forces; `FIELD_CALC_K` (120000) is used **only** for the arrow-grid field visualization.

## Conventions & deliberate deviations

Several quirks are carried over **verbatim** from the PhET source — keep them unless porting fidelity changes:

- **Dragged particles** are excluded from integration (the original detached them) but still act as Coulomb sources on the others.
- **East-wall bounce** applies `vx = -|vx| - inset` — an intentional asymmetry from `FourBoundsPropagator`.
- `coulombForce` uses `direction = source − target` combined with a **negative** magnitude (`-COULOMB_K·q₁q₂ / r³`), so like charges repel / opposite attract; non-finite results are guarded to a zero vector.
- Object pools from the Backbone original are dropped — axon change notification via immutable vectors replaces them.

## Accessibility

Follows the shared [OpenPhysics accessibility convention](https://github.com/OpenPhysics/Baton/blob/main/ACCESSIBILITY.md).
`ElectricFieldOfDreamsScreenView` registers `ElectricFieldOfDreamsScreenSummaryContent` (live
current-details: charge count + play state) via the `screenSummaryContent` super-option, and
orders the PDOM through a wrapper `Node`. A11y strings live under the top-level `a11y` key in each
locale JSON, via `StringManager.getA11yStrings()`.

## Commands

```bash
npm run lint && npm run check && npm run build
```

No unit-test suite — the build/lint/check gate plus manual run substitute for tests here.

## Development notes

- **Pure client-side** — no backend or external services.
- Field arrows are recomputed from `getFieldAt(x, y)` (charges' field + external field) over a `fieldLatticeWidth²` grid; raising the density slider increases per-frame sampling cost.
