/**
 * Particle.ts
 *
 * A charged particle: its position, velocity, acceleration, charge, and mass, with
 * simple kinematic helpers. Replaces the original Backbone MotionObject + Particle.
 *
 * The original used `detach()` / `attach()` events to pull a dragged particle out of
 * the physics system; here that is a single `isDraggingProperty` the model checks
 * before applying forces and integration.
 */

import { BooleanProperty } from "scenerystack/axon";
import { Vector2, Vector2Property } from "scenerystack/dot";

let nextId = 0;

export default class Particle {
  // Stable identity so views can match a node to its model on add/remove.
  public readonly id = nextId++;

  public readonly positionProperty: Vector2Property;
  public readonly velocityProperty = new Vector2Property(new Vector2(0, 0));
  public readonly accelerationProperty = new Vector2Property(new Vector2(0, 0));

  // While true the particle is being dragged and is excluded from the physics system.
  public readonly isDraggingProperty = new BooleanProperty(false);

  public readonly charge: number;
  public readonly mass: number;

  public constructor(charge: number, mass: number, position: Vector2) {
    this.charge = charge;
    this.mass = mass;
    this.positionProperty = new Vector2Property(position);
  }

  public get position(): Vector2 {
    return this.positionProperty.value;
  }

  public get velocity(): Vector2 {
    return this.velocityProperty.value;
  }

  public get acceleration(): Vector2 {
    return this.accelerationProperty.value;
  }

  public setPosition(value: Vector2): void {
    this.positionProperty.value = value;
  }

  public setPositionXY(x: number, y: number): void {
    this.positionProperty.value = new Vector2(x, y);
  }

  public setVelocity(value: Vector2): void {
    this.velocityProperty.value = value;
  }

  public setVelocityXY(x: number, y: number): void {
    this.velocityProperty.value = new Vector2(x, y);
  }

  public setAcceleration(value: Vector2): void {
    this.accelerationProperty.value = value;
  }

  public setAccelerationXY(x: number, y: number): void {
    this.accelerationProperty.value = new Vector2(x, y);
  }

  /** position += velocity * dt */
  public updatePositionFromVelocity(dt: number): void {
    this.setPosition(this.position.plus(this.velocity.timesScalar(dt)));
  }
}
