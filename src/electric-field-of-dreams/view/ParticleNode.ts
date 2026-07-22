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
import Constants from "../../ElectricFieldOfDreamsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
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

    // Particle nodes are created and destroyed as charges are added/removed. Node.dispose()
    // only *removes* children — it does not unlink manually-added Property links, remove
    // input listeners, or dispose children — so each of those is torn down explicitly below
    // (see the disposeEmitter handler) to avoid leaking a node per add/remove.
    const updateTranslation = (position: Vector2): void => {
      this.translation = modelViewTransform.modelToViewPosition(position);
    };
    particle.positionProperty.link(updateTranslation);

    const startDrag = (): void => {
      particle.isDraggingProperty.value = true;
    };
    const endDrag = (): void => {
      particle.isDraggingProperty.value = false;
    };

    const dragListener = new DragListener({
      start: startDrag,
      drag: (event) => {
        const viewPoint = this.globalToParentPoint(event.pointer.point);
        const modelPoint = modelViewTransform.viewToModelPosition(viewPoint);
        // Keep the dragged particle inside the play area.
        particle.setPosition(model.bounds.closestPointTo(modelPoint));
      },
      end: endDrag,
    });
    this.addInputListener(dragListener);

    const keyboardDragListener = new KeyboardDragListener({
      transform: modelViewTransform,
      dragSpeed: 80,
      shiftDragSpeed: 30,
      start: startDrag,
      drag: (_event, listener) => {
        const next = particle.positionProperty.value.plusXY(listener.modelDelta.x, listener.modelDelta.y);
        particle.setPosition(model.bounds.closestPointTo(next));
      },
      end: endDrag,
    });
    this.addInputListener(keyboardDragListener);

    this.disposeEmitter.addListener(() => {
      particle.positionProperty.unlink(updateTranslation);
      // Remove before disposing so hotkeyManager drops its reference to this node (the
      // KeyboardDragListener's hotkeys otherwise keep the disposed node reachable).
      this.removeInputListener(dragListener);
      this.removeInputListener(keyboardDragListener);
      dragListener.dispose();
      keyboardDragListener.dispose();
      circle.dispose();
      symbol.dispose();
    });
  }
}
