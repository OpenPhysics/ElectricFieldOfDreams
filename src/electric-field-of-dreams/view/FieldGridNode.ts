/**
 * FieldGridNode.ts
 *
 * Visualizes the total electric field as an n×n lattice of arrows (n = the field
 * density). Each frame it samples the model's field at every lattice point and draws
 * an arrow there, or a small dot where the field is negligible. A CanvasNode is used
 * so the whole grid is painted in immediate mode each frame, matching the original
 * PIXI Graphics approach and staying fast even at the maximum density (30 × 30).
 *
 * Ported from `views/electric-field.js`.
 */

import type { Bounds2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { CanvasNode } from "scenerystack/scenery";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import Constants from "../../ElectricFieldOfDreamsConstants.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

export default class FieldGridNode extends CanvasNode {
  private readonly model: ElectricFieldOfDreamsModel;
  private readonly modelViewTransform: ModelViewTransform2;

  public constructor(
    model: ElectricFieldOfDreamsModel,
    modelViewTransform: ModelViewTransform2,
    canvasBounds: Bounds2,
  ) {
    super({ canvasBounds });
    this.model = model;
    this.modelViewTransform = modelViewTransform;

    // Repaint immediately on the discrete changes (density, external field, theme).
    model.fieldLatticeWidthProperty.link(() => this.invalidatePaint());
    model.externalFieldProperty.link(() => this.invalidatePaint());
    ElectricFieldOfDreamsColors.fieldArrowProperty.link(() => this.invalidatePaint());
  }

  /** Called by the screen view every animation frame so moving charges update the field. */
  public update(): void {
    this.invalidatePaint();
  }

  public override paintCanvas(context: CanvasRenderingContext2D): void {
    const mvt = this.modelViewTransform;
    const model = this.model;

    const x = Math.round(mvt.modelToViewX(model.minX));
    const y = Math.round(mvt.modelToViewY(model.minY));
    const w = Math.round(mvt.modelToViewDeltaX(model.width));
    const h = Math.round(mvt.modelToViewDeltaY(model.height));

    const tailWidth = Math.max(1, Math.round(mvt.modelToViewDeltaX(Constants.ARROW_TAIL_WIDTH)));
    const headWidth = Math.round(mvt.modelToViewDeltaX(Constants.ARROW_HEAD_WIDTH));
    const headLength = Math.round(mvt.modelToViewDeltaX(Constants.ARROW_HEAD_LENGTH));
    const minComponent = Constants.ARROW_MIN_COMPONENT;

    const n = model.fieldLatticeWidthProperty.value;
    const xStep = w / n;
    const yStep = h / n;

    const color = ElectricFieldOfDreamsColors.fieldArrowProperty.value.toCSS();
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = tailWidth;

    let ox = x + xStep / 2;
    for (let i = 0; i < n; i++) {
      let oy = y + yStep / 2;
      for (let j = 0; j < n; j++) {
        const field = model.getFieldAt(mvt.viewToModelX(ox), mvt.viewToModelY(oy));
        const tx = mvt.modelToViewDeltaX(field.x);
        const ty = mvt.modelToViewDeltaY(field.y);

        if (Math.abs(tx) < minComponent && Math.abs(ty) < minComponent) {
          context.beginPath();
          context.arc(Math.floor(ox), Math.floor(oy), minComponent / 2, 0, 2 * Math.PI);
          context.fill();
        } else {
          FieldGridNode.drawArrow(context, ox, oy, ox + tx, oy + ty, headWidth, headLength);
        }
        oy += yStep;
      }
      ox += xStep;
    }
  }

  private static drawArrow(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    headWidth: number,
    headLength: number,
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (length < 1e-6) {
      return;
    }
    const ux = dx / length;
    const uy = dy / length;
    // Base of the arrowhead (head pulled back from the tip along the shaft).
    const effectiveHead = Math.min(headLength, length);
    const baseX = x2 - ux * effectiveHead;
    const baseY = y2 - uy * effectiveHead;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(baseX, baseY);
    context.stroke();

    // Perpendicular unit vector for the head's two back corners.
    const px = -uy;
    const py = ux;
    const half = headWidth / 2;
    context.beginPath();
    context.moveTo(x2, y2);
    context.lineTo(baseX + px * half, baseY + py * half);
    context.lineTo(baseX - px * half, baseY - py * half);
    context.closePath();
    context.fill();
  }
}
