/**
 * ParticleNode.ts
 *
 * A draggable charged particle: a filled, outlined circle with a +/- glyph showing the
 * sign of its charge. Dragging detaches it from the physics (via isDraggingProperty)
 * and repositions it, clamped to the play-area bounds. Ported from `views/particle.js`.
 */

import { Vector2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, DragListener, Node, Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import Constants from "../model/ElectricFieldOfDreamsConstants.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";
import type Particle from "../model/Particle.js";

// Outline width (view pixels) of the particle circle.
const STROKE_WIDTH = 3;

export default class ParticleNode extends Node {
  public readonly particle: Particle;

  public constructor(particle: Particle, model: ElectricFieldOfDreamsModel, modelViewTransform: ModelViewTransform2) {
    super({ cursor: "pointer" });
    this.particle = particle;

    const radius = modelViewTransform.modelToViewDeltaX(Constants.PARTICLE_RADIUS);

    const circle = new Circle(radius, {
      fill: ElectricFieldOfDreamsColors.particleFillProperty,
      stroke: ElectricFieldOfDreamsColors.particleStrokeProperty,
      lineWidth: STROKE_WIDTH,
    });

    const symbol = new Text(particle.charge >= 0 ? "+" : "−", {
      font: new PhetFont({ size: Math.round(radius * 1.4), weight: "bold" }),
      fill: ElectricFieldOfDreamsColors.particleSymbolProperty,
      center: Vector2.ZERO,
    });

    this.children = [circle, symbol];

    particle.positionProperty.link((position) => {
      this.translation = modelViewTransform.modelToViewPosition(position);
    });

    this.addInputListener(
      new DragListener({
        start: () => {
          particle.isDraggingProperty.value = true;
        },
        drag: (event) => {
          const viewPoint = this.globalToParentPoint(event.pointer.point);
          const modelPoint = modelViewTransform.viewToModelPosition(viewPoint);
          // Keep the dragged particle inside the play area.
          particle.setPosition(model.bounds.closestPointTo(modelPoint));
        },
        end: () => {
          particle.isDraggingProperty.value = false;
        },
      }),
    );
  }
}
