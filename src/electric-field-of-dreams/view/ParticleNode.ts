/**
 * ParticleNode.ts
 *
 * A draggable charged particle: a filled, outlined circle with a +/- glyph showing the
 * sign of its charge. Dragging detaches it from the physics (via isDraggingProperty)
 * and repositions it, clamped to the play-area bounds. Ported from `views/particle.js`.
 */

import { Vector2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, DragListener, KeyboardDragListener, Node, Text } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import { StringManager } from "../../i18n/StringManager.js";
import Constants from "../model/ElectricFieldOfDreamsConstants.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";
import type Particle from "../model/Particle.js";

// Outline width (view pixels) of the particle circle.
const STROKE_WIDTH = 3;

export default class ParticleNode extends Node {
  public readonly particle: Particle;

  public constructor(particle: Particle, model: ElectricFieldOfDreamsModel, modelViewTransform: ModelViewTransform2) {
    const a11y = StringManager.getInstance().getA11yStrings();
    super({
      cursor: "pointer",
      tagName: "div",
      focusable: true,
      accessibleName:
        particle.charge >= 0 ? a11y.controls.positiveChargeStringProperty : a11y.controls.negativeChargeStringProperty,
      accessibleHelpText: a11y.controls.particleHelpStringProperty,
    });
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

    const startDrag = (): void => {
      particle.isDraggingProperty.value = true;
    };
    const endDrag = (): void => {
      particle.isDraggingProperty.value = false;
    };

    this.addInputListener(
      new DragListener({
        start: startDrag,
        drag: (event) => {
          const viewPoint = this.globalToParentPoint(event.pointer.point);
          const modelPoint = modelViewTransform.viewToModelPosition(viewPoint);
          // Keep the dragged particle inside the play area.
          particle.setPosition(model.bounds.closestPointTo(modelPoint));
        },
        end: endDrag,
      }),
    );

    this.addInputListener(
      new KeyboardDragListener({
        transform: modelViewTransform,
        dragSpeed: 80,
        shiftDragSpeed: 30,
        start: startDrag,
        drag: (_event, listener) => {
          const next = particle.positionProperty.value.plusXY(listener.modelDelta.x, listener.modelDelta.y);
          particle.setPosition(model.bounds.closestPointTo(next));
        },
        end: endDrag,
      }),
    );
  }
}
