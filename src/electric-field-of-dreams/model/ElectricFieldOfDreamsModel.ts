/**
 * ElectricFieldOfDreamsModel.ts
 *
 * The simulation model. Fuses the original's `EFDSimulation` + `System` + the ordered
 * list of "laws" and "propagators" into one class. Each fixed timestep applies, in the
 * original order:
 *
 *   1. reset acceleration       5. velocity integration (speed-capped)
 *   2. bounce off the 4 walls   6. position integration
 *   3. uniform external field
 *   4. Coulomb inter-particle force
 *
 * Backbone collections/events become an axon ObservableArray + Properties, and the
 * object pools are dropped (axon handles change notification via immutable vectors).
 */

import { BooleanProperty, createObservableArray, NumberProperty, type ObservableArray } from "scenerystack/axon";
import { Bounds2, Vector2, Vector2Property } from "scenerystack/dot";
import type { TModel } from "scenerystack/joist";
import type { ElectricFieldOfDreamsPreferencesModel } from "../../preferences/ElectricFieldOfDreamsPreferencesModel.js";
import electricFieldOfDreamsQueryParameters from "../../preferences/electricFieldOfDreamsQueryParameters.js";
import ChargeFieldCalculator from "./ChargeFieldCalculator.js";
import Constants from "./ElectricFieldOfDreamsConstants.js";
import Particle from "./Particle.js";

export class ElectricFieldOfDreamsModel implements TModel {
  // Every particle in the box (observable so views can add/remove nodes).
  public readonly particles: ObservableArray<Particle> = createObservableArray<Particle>();

  // The uniform external field, set by the External Field control (model units).
  public readonly externalFieldProperty = new Vector2Property(new Vector2(0, 0));

  // Number of arrows along each axis of the field-visualization lattice.
  public readonly fieldLatticeWidthProperty = new NumberProperty(
    electricFieldOfDreamsQueryParameters.fieldLatticeWidth,
  );

  public readonly isPlayingProperty = new BooleanProperty(true);

  // System bounds (model units): a SYSTEM_WIDTH × SYSTEM_HEIGHT box at (MIN_X, MIN_Y).
  public readonly minX = Constants.SYSTEM_MIN_X;
  public readonly minY = Constants.SYSTEM_MIN_Y;
  public readonly width = Constants.SYSTEM_WIDTH;
  public readonly height = Constants.SYSTEM_HEIGHT;
  public readonly center = new Vector2(this.minX + this.width / 2, this.minY + this.height / 2);
  public readonly bounds = new Bounds2(this.minX, this.minY, this.minX + this.width, this.minY + this.height);

  private readonly fieldCalculator = new ChargeFieldCalculator(
    this.particles,
    Constants.FIELD_CALC_K,
    Constants.MAX_ARROW_LENGTH,
  );

  private timeAccumulator = 0;

  private readonly preferences: ElectricFieldOfDreamsPreferencesModel | undefined;

  public constructor(preferences?: ElectricFieldOfDreamsPreferencesModel) {
    this.preferences = preferences;
    if (preferences) {
      this.fieldLatticeWidthProperty.value = preferences.fieldLatticeWidthProperty.value;
    }
  }

  // ── Stepping ────────────────────────────────────────────────────────────────

  public step(dt: number): void {
    if (!this.isPlayingProperty.value) {
      return;
    }
    const frame = Constants.FRAME_DURATION;
    this.timeAccumulator = Math.min(this.timeAccumulator + dt, frame * Constants.MAX_CATCHUP_STEPS);
    while (this.timeAccumulator >= frame) {
      this.timeAccumulator -= frame;
      this.applyLaws(Constants.DT_PER_FRAME);
    }
  }

  /** Advance exactly one fixed physics slice (the Step button), regardless of play state. */
  public stepOnce(): void {
    this.applyLaws(Constants.DT_PER_FRAME);
  }

  /** One fixed physics slice: the six laws in their original order. */
  private applyLaws(dt: number): void {
    const all = [...this.particles];
    // Dragged particles are excluded from integration (the original detached them) but
    // still act as Coulomb sources on the others.
    const active = all.filter((p) => !p.isDraggingProperty.value);

    for (const p of active) {
      p.setAccelerationXY(0, 0);
    }
    for (const p of active) {
      this.bounceOffWalls(p);
    }
    this.applyExternalField(active);
    this.applyCoulomb(active, all);
    for (const p of active) {
      this.integrateVelocity(p, dt);
    }
    for (const p of active) {
      p.updatePositionFromVelocity(dt);
    }
  }

  // ── Law 2: bounce off the four walls ──────────────────────────────────────────
  // Replicates the N → E → W → S order and per-wall reflection of the original's
  // FourBoundsPropagator. The east wall's velocity tweak (vx = -|vx| - inset) is an
  // intentional quirk carried over verbatim from the source.
  private bounceOffWalls(p: Particle): void {
    const inset = Constants.WALL_BOUNCE_INSET;
    const yMin = this.minY;
    const yMax = this.minY + this.height;
    const xMin = this.minX;
    const xMax = this.minX + this.width;

    // North (top)
    if (p.position.y < yMin) {
      p.setVelocityXY(p.velocity.x, Math.abs(p.velocity.y));
      p.setPositionXY(p.position.x, yMin + inset);
      p.setAccelerationXY(0, 0);
    }
    // East (right)
    if (p.position.x > xMax) {
      p.setVelocityXY(-Math.abs(p.velocity.x) - inset, p.velocity.y);
      p.setPositionXY(xMax - inset, p.position.y);
      p.setAccelerationXY(0, 0);
    }
    // West (left)
    if (p.position.x < xMin) {
      p.setVelocityXY(Math.abs(p.velocity.x), p.velocity.y);
      p.setPositionXY(xMin + inset, p.position.y);
      p.setAccelerationXY(0, 0);
    }
    // South (bottom)
    if (p.position.y > yMax) {
      p.setVelocityXY(p.velocity.x, -Math.abs(p.velocity.y));
      p.setPositionXY(p.position.x, yMax - inset);
      p.setAccelerationXY(0, 0);
    }
  }

  // ── Law 3: uniform external field (a += qE/m) ─────────────────────────────────
  private applyExternalField(active: ReadonlyArray<Particle>): void {
    const field = this.externalFieldProperty.value;
    for (const p of active) {
      const accel = field.timesScalar(p.charge / p.mass);
      p.setAcceleration(p.acceleration.plus(accel));
    }
  }

  // ── Law 4: Coulomb inter-particle force ───────────────────────────────────────
  private applyCoulomb(active: ReadonlyArray<Particle>, sources: ReadonlyArray<Particle>): void {
    for (const target of active) {
      let total = new Vector2(0, 0);
      for (const source of sources) {
        total = total.plus(ElectricFieldOfDreamsModel.coulombForce(source, target));
      }
      target.setAcceleration(target.acceleration.plus(total.timesScalar(1 / target.mass)));
    }
  }

  /** Force on `target` due to `source`, matching the original CoulombsLaw.getForce. */
  private static coulombForce(source: Particle, target: Particle): Vector2 {
    const dist = target.position.distance(source.position);
    const distCubed = dist ** 3;
    const forceMagnitude = (-Constants.COULOMB_K * source.charge * target.charge) / distCubed;
    // Original: direction = source − target. Combined with the negative magnitude this
    // pushes like charges apart and pulls opposite charges together.
    const direction = source.position.minus(target.position);

    if (!Number.isFinite(forceMagnitude) || Number.isNaN(direction.x) || Number.isNaN(direction.y)) {
      return new Vector2(0, 0);
    }
    return direction.timesScalar(forceMagnitude);
  }

  // ── Law 5: velocity integration with speed cap ────────────────────────────────
  private integrateVelocity(p: Particle, dt: number): void {
    let v = p.velocity.plus(p.acceleration.timesScalar(dt));
    const speed = v.magnitude;
    if (speed > Constants.MAX_VELOCITY) {
      v = v.timesScalar(Constants.MAX_VELOCITY / speed);
    }
    p.setVelocity(v);
  }

  // ── Particle management ───────────────────────────────────────────────────────

  public addParticle(charge: number, mass: number): Particle {
    const position = new Vector2(this.minX + Math.random() * this.width, this.minY + Math.random() * this.height);
    const particle = new Particle(charge, mass, position);
    this.particles.push(particle);
    return particle;
  }

  /** Removes the most-recently-added particle (matches the original Remove button). */
  public removeParticle(): void {
    if (this.particles.length > 0) {
      this.particles.pop();
    }
  }

  // ── Field sampling (for the arrow grid) ────────────────────────────────────────

  /** Total field at (x, y): the charges' field plus the uniform external field. */
  public getFieldAt(x: number, y: number): Vector2 {
    return this.fieldCalculator.getFieldAt(x, y).plus(this.externalFieldProperty.value);
  }

  // ── Controls ────────────────────────────────────────────────────────────────

  public play(): void {
    this.isPlayingProperty.value = true;
  }

  public pause(): void {
    this.isPlayingProperty.value = false;
  }

  public reset(): void {
    this.particles.clear();
    this.externalFieldProperty.reset();
    this.fieldLatticeWidthProperty.reset();
    if (this.preferences) {
      this.fieldLatticeWidthProperty.value = this.preferences.fieldLatticeWidthProperty.value;
    }
    this.isPlayingProperty.reset();
    this.timeAccumulator = 0;
  }
}
