/**
 * ParticleNode.ts
 *
 * A draggable charged particle: a filled, outlined circle with a +/- glyph showing the
 * sign of its charge. Dragging detaches it from the physics (via isDraggingProperty)
 * and repositions it, clamped to the play-area bounds. Ported from `views/particle.js`.
 */

import { Vector2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, Node, RichDragListener, Text } from "scenerystack/scenery";
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

    // Idiomatic positionProperty + transform; mapPosition clamps to the play area
    // (closestPointTo) the same way the previous hand-rolled drag did.
    const dragListener = new RichDragListener({
      positionProperty: particle.positionProperty,
      transform: modelViewTransform,
      mapPosition: (point) => model.bounds.closestPointTo(point),
      start: startDrag,
      end: endDrag,
      dragListenerOptions: {},
      keyboardDragListenerOptions: {
        dragSpeed: 80,
        shiftDragSpeed: 30,
      },
    });
    this.addInputListener(dragListener);

    this.disposeEmitter.addListener(() => {
      particle.positionProperty.unlink(updateTranslation);
      // Remove before disposing so hotkeyManager drops its reference to this node (the
      // RichDragListener's keyboard hotkeys otherwise keep the disposed node reachable).
      this.removeInputListener(dragListener);
      dragListener.dispose();
      circle.dispose();
      symbol.dispose();
    });
  }
}
