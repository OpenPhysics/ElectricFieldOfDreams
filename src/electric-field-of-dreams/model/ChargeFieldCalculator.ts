/**
 * ChargeFieldCalculator.ts
 *
 * Computes the electric field produced by a set of charged particles at an arbitrary
 * point. Used only for the field-arrow visualization (it does not affect the physics).
 * Ported from the original `charge-field-calculator.js` (a.k.a. ChargeFieldSource).
 */

import { Vector2 } from "scenerystack/dot";
import type Particle from "./Particle.js";

export default class ChargeFieldCalculator {
  private readonly particles: ReadonlyArray<Particle>;
  private readonly k: number;
  private readonly max: number;

  public constructor(particles: ReadonlyArray<Particle>, k: number, max: number) {
    this.particles = particles;
    this.k = k;
    this.max = max;
  }

  /** Sum of the field contributions of every particle at (x, y). */
  public getFieldAt(x: number, y: number): Vector2 {
    let field = new Vector2(0, 0);
    for (const particle of this.particles) {
      field = field.plus(this.getParticleFieldAt(particle, x, y));
    }
    return field;
  }

  private getParticleFieldAt(particle: Particle, x: number, y: number): Vector2 {
    const q = particle.charge;
    const r = new Vector2(x, y).minus(particle.position);

    const dist = r.magnitude;
    if (dist === 0) {
      return new Vector2(0, 0);
    }

    // E ∝ k·q / r²  in the r̂ direction → here scaled by dist^-3 since r is unnormalized.
    let scaled = r.timesScalar(dist ** -3 * this.k * q);

    const mag = scaled.magnitude;
    if (mag > this.max) {
      scaled = scaled.timesScalar(this.max / mag);
    }
    return scaled;
  }
}
