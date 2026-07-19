import { Vector2 } from "scenerystack/dot";
import { afterEach, describe, expect, it } from "vitest";
import Constants from "../../../src/ElectricFieldOfDreamsConstants.js";
import { ElectricFieldOfDreamsModel } from "../../../src/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.js";
import { ElectricFieldOfDreamsPreferencesModel } from "../../../src/preferences/ElectricFieldOfDreamsPreferencesModel.js";

describe("ElectricFieldOfDreamsModel", () => {
  let model: ElectricFieldOfDreamsModel;

  afterEach(() => {
    model.reset();
  });

  it("constructs with or without preferences", () => {
    model = new ElectricFieldOfDreamsModel();
    expect(model.particles.length).toBe(0);

    const preferences = new ElectricFieldOfDreamsPreferencesModel();
    model = new ElectricFieldOfDreamsModel(preferences);
    expect(model.fieldLatticeWidthProperty.value).toBe(preferences.fieldLatticeWidthProperty.value);
  });

  it("reset clears particles", () => {
    model = new ElectricFieldOfDreamsModel();
    model.addParticle(1, 1);
    model.addParticle(-1, 1);
    expect(model.particles.length).toBe(2);

    model.reset();
    expect(model.particles.length).toBe(0);
  });

  it("does not move particles while paused", () => {
    model = new ElectricFieldOfDreamsModel();
    model.pause();
    model.externalFieldProperty.value = new Vector2(10, 0);

    const particle = model.addParticle(1, 1);
    particle.setPositionXY(model.center.x, model.center.y);
    particle.setVelocityXY(0, 0);

    model.step(1);

    expect(particle.position.x).toBeCloseTo(model.center.x, 6);
    expect(particle.position.y).toBeCloseTo(model.center.y, 6);
    expect(particle.velocity.x).toBeCloseTo(0, 6);
    expect(particle.velocity.y).toBeCloseTo(0, 6);
  });

  it("applies external field acceleration qE/m to a unit charge", () => {
    model = new ElectricFieldOfDreamsModel();
    const fieldStrength = 7;
    model.externalFieldProperty.value = new Vector2(fieldStrength, 0);

    const particle = model.addParticle(1, 1);
    particle.setPositionXY(model.center.x, model.center.y);
    particle.setVelocityXY(0, 0);

    model.stepOnce();

    expect(particle.acceleration.x).toBeCloseTo(fieldStrength, 4);
    expect(particle.acceleration.y).toBeCloseTo(0, 4);
    expect(particle.velocity.x).toBeCloseTo(fieldStrength * Constants.DT_PER_FRAME, 3);
  });
});
