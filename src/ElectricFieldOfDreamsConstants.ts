/**
 * ElectricFieldOfDreamsConstants.ts
 *
 * All tunable model and view constants, ported verbatim from the original sim's
 * `constants.js` so the physics behaves identically. Lengths are in the original's
 * arbitrary model units; the model-view transform scales them to view pixels.
 */

import { Range } from "scenerystack/dot";

const ElectricFieldOfDreamsConstants = {
  // ── System bounds (model units) ─────────────────────────────────────────────
  SYSTEM_WIDTH: 300,
  SYSTEM_HEIGHT: 300,
  SYSTEM_MIN_X: 50,
  SYSTEM_MIN_Y: 50,

  // ── Fixed-timestep loop ─────────────────────────────────────────────────────
  // The original advances the model in fixed 0.15 s slices, taking one slice every
  // 0.035 s of wall-clock time (≈ 28.6 physics steps per real second).
  FRAME_DURATION: 35 / 1000, // wall-clock seconds per fixed slice
  DT_PER_FRAME: 0.15, // model seconds advanced per slice
  MAX_CATCHUP_STEPS: 5, // cap slices per frame so a stutter can't spiral

  // ── Field-arrow lattice ─────────────────────────────────────────────────────
  // Number of arrows along each axis of the field-visualization grid.
  DISCRETENESS_RANGE: new Range(1, 30),
  DISCRETENESS_DEFAULT: 6,
  MAX_ARROW_LENGTH: 25, // model-unit cap on a field-sample arrow's length

  // ── Forces ──────────────────────────────────────────────────────────────────
  COULOMB_K: 100000, // Coulomb constant used for inter-particle forces
  FIELD_CALC_K: 120000, // larger constant used only for the field visualization
  MAX_VELOCITY: 100, // speed cap applied each step (model units / s)
  WALL_BOUNCE_INSET: 1.2, // how far inside a wall a bounced particle is placed

  // ── Particle ────────────────────────────────────────────────────────────────
  PARTICLE_RADIUS: 10, // model-unit radius of a particle
  DEFAULT_CHARGE: 1,
  DEFAULT_MASS: 1,
  HEAVY_MASS: 5, // preset mass for the "Heavy" toggle in the particle panel

  // ── Field-arrow geometry (view pixels) ──────────────────────────────────────
  ARROW_TAIL_WIDTH: 2,
  ARROW_HEAD_WIDTH: 6,
  ARROW_HEAD_LENGTH: 8,
  ARROW_MIN_COMPONENT: 4, // below this the arrow is drawn as a small dot
};

export default ElectricFieldOfDreamsConstants;
