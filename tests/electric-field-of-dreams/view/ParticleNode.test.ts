/**
 * Disposal regression for ParticleNode.
 *
 * A ParticleNode registers a manual link on its particle's positionProperty and adds two
 * drag input listeners. Node.dispose() only removes children — it does not unlink manual
 * Property links or remove/dispose input listeners — so without explicit teardown a
 * disposed node stays wired to the model, leaking listeners (and keeping the node
 * reachable from hotkeyManager) on every add/remove of a charge.
 *
 * Scenery nodes are retained by framework globals in the happy-dom test env and are never
 * GC'd here (which is why the model memory-leak suite only exercises pure-axon objects),
 * so this asserts the observable side effect instead: the particle's positionProperty has
 * no leftover listeners once the node that added one is disposed.
 */

import { Vector2 } from "scenerystack/dot";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { describe, expect, it } from "vitest";
import { ElectricFieldOfDreamsModel } from "../../../src/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.js";
import ParticleNode from "../../../src/electric-field-of-dreams/view/ParticleNode.js";

describe("ParticleNode disposal", () => {
  it("unlinks its particle listeners on dispose", () => {
    const model = new ElectricFieldOfDreamsModel();
    const mvt = ModelViewTransform2.createSinglePointScaleMapping(model.center, new Vector2(0, 0), 1);

    const particle = model.addParticle(1, 1);
    const baseline = particle.positionProperty.getListenerCount();

    const node = new ParticleNode(particle, model, mvt);
    expect(particle.positionProperty.getListenerCount()).toBe(baseline + 1);

    node.dispose();
    expect(particle.positionProperty.getListenerCount()).toBe(baseline);
  });

  it("does not accumulate listeners across repeated add/remove cycles", () => {
    const model = new ElectricFieldOfDreamsModel();
    const mvt = ModelViewTransform2.createSinglePointScaleMapping(model.center, new Vector2(0, 0), 1);

    for (let i = 0; i < 5; i++) {
      const particle = model.addParticle(i % 2 === 0 ? 1 : -1, 1);
      const node = new ParticleNode(particle, model, mvt);
      node.dispose();
      expect(particle.positionProperty.getListenerCount()).toBe(0);
      model.removeParticle();
    }
  });
});
