/**
 * Fleet-standard memory-leak regression suite.
 * Creates an ElectricFieldOfDreamsModel, steps it, resets, drops the reference.
 */

import { Vector2 } from "scenerystack/dot";
import { describe, expect, it } from "vitest";
import { ElectricFieldOfDreamsModel } from "../src/electric-field-of-dreams/model/ElectricFieldOfDreamsModel.js";

async function forceGC(earlyExitRef?: WeakRef<object>): Promise<void> {
  for (let i = 0; i < 15; i++) {
    globalThis.gc?.();
    await new Promise<void>((r) => setTimeout(r, 50));
    if (earlyExitRef !== undefined && earlyExitRef.deref() === undefined) {
      return;
    }
    if (earlyExitRef !== undefined) {
      await new Promise<void>((r) => setTimeout(r, 0));
    }
  }
}

function createAndDropModel(): WeakRef<object> {
  const model = new ElectricFieldOfDreamsModel();
  model.externalFieldProperty.value = new Vector2(5, 0);
  const particle = model.addParticle(1, 1);
  particle.setPositionXY(model.center.x, model.center.y);
  model.stepOnce();
  model.reset();
  return new WeakRef<object>(model);
}

describe("Memory leak regression", () => {
  it("global.gc is available (--expose-gc)", () => {
    expect(globalThis.gc).toBeDefined();
  });

  it("sanity: plain object is collected", async () => {
    const ref = (() => new WeakRef({ hello: "world" }))();
    await forceGC(ref);
    expect(ref.deref()).toBeUndefined();
  });

  it("ElectricFieldOfDreamsModel is collected after drop", async () => {
    const ref = createAndDropModel();
    await forceGC(ref);
    expect(ref.deref()).toBeUndefined();
  });

  it("repeated create/drop cycles leave no survivors", async () => {
    const refs: WeakRef<object>[] = [];
    for (let i = 0; i < 10; i++) {
      refs.push(createAndDropModel());
    }
    await forceGC();
    expect(refs.filter((r) => r.deref() !== undefined).length).toBe(0);
  });
});
