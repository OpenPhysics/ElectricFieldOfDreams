/**
 * ExternalFieldControlPanel.ts
 *
 * A panel with a square drag-pad. Dragging the knob sets the direction and magnitude
 * of the uniform external field; the arrow visualizes the current field whenever the
 * user isn't dragging. The pad-pixel ↔ model-field mapping uses the same model-view
 * transform as the play area, so a field arrow here matches one of the same length in
 * the field grid. Ported from `views/external-field-control.js`.
 */

import { Bounds2, clamp, Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, DragListener, Node, Rectangle, Text, VBox } from "scenerystack/scenery";
import { ArrowNode, PhetFont } from "scenerystack/scenery-phet";
import { Panel } from "scenerystack/sun";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

// Side length (view pixels) of the square drag-pad.
const PAD_SIZE = 170;
const HALF = PAD_SIZE / 2;

const TITLE_FONT_SIZE = 16;
const PAD_CORNER_RADIUS = 4;
const PANEL_CORNER_RADIUS = 6;
const PANEL_X_MARGIN = 12;
const PANEL_Y_MARGIN = 10;
const VBOX_SPACING = 8;

const ARROW_HEAD_WIDTH = 14;
const ARROW_HEAD_HEIGHT = 14;
const ARROW_TAIL_WIDTH = 5;

const KNOB_RADIUS = 9;
const KNOB_STROKE = "rgba(0,0,0,0.4)";

export default class ExternalFieldControlPanel extends Panel {
  // The panel's width is fixed by the drag pad (the transform only affects the field
  // mapping, not the layout), so the screen view can reserve column space before the
  // panel itself is constructed.
  public static readonly ESTIMATED_WIDTH = PAD_SIZE + 2 * PANEL_X_MARGIN;

  public constructor(model: ElectricFieldOfDreamsModel, modelViewTransform: ModelViewTransform2) {
    const strings = StringManager.getInstance().getExternalFieldStrings();
    const a11y = StringManager.getInstance().getA11yStrings();

    const header = new Text(strings.titleStringProperty, {
      font: new PhetFont({ size: TITLE_FONT_SIZE, weight: "bold" }),
      fill: ElectricFieldOfDreamsColors.foregroundColorProperty,
    });

    const padBackground = new Rectangle(-HALF, -HALF, PAD_SIZE, PAD_SIZE, {
      fill: ElectricFieldOfDreamsColors.padFillProperty,
      cornerRadius: PAD_CORNER_RADIUS,
    });
    const arrow = new ArrowNode(0, 0, 0, 0, {
      headWidth: ARROW_HEAD_WIDTH,
      headHeight: ARROW_HEAD_HEIGHT,
      tailWidth: ARROW_TAIL_WIDTH,
      stroke: null,
      fill: ElectricFieldOfDreamsColors.externalFieldArrowProperty,
    });
    const knob = new Circle(KNOB_RADIUS, {
      cursor: "pointer",
      fill: ElectricFieldOfDreamsColors.externalFieldArrowProperty,
      stroke: KNOB_STROKE,
    });
    const padLayer = new Node({
      clipArea: Shape.bounds(new Bounds2(-HALF, -HALF, HALF, HALF)),
      children: [arrow, knob],
    });
    const pad = new Node({
      cursor: "pointer",
      children: [padBackground, padLayer],
      tagName: "div",
      focusable: true,
      accessibleName: a11y.controls.externalFieldStringProperty,
      accessibleHelpText: a11y.controls.externalFieldHelpStringProperty,
    });

    const content = new VBox({ spacing: VBOX_SPACING, children: [header, pad] });
    super(content, {
      fill: ElectricFieldOfDreamsColors.panelFillProperty,
      stroke: ElectricFieldOfDreamsColors.panelStrokeProperty,
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
    });

    let isDragging = false;

    const setTip = (tip: Vector2): void => {
      arrow.setTailAndTip(0, 0, tip.x, tip.y);
      knob.center = tip;
    };

    // pad-pixel tip → model field (same transform as the play area).
    const applyTipToModel = (tip: Vector2): void => {
      model.externalFieldProperty.value = new Vector2(
        modelViewTransform.viewToModelDeltaX(tip.x),
        modelViewTransform.viewToModelDeltaY(tip.y),
      );
    };

    // model field → pad-pixel tip (clamped to the pad).
    const reflectFromModel = (): void => {
      if (isDragging) {
        return;
      }
      const field = model.externalFieldProperty.value;
      setTip(
        new Vector2(
          clamp(modelViewTransform.modelToViewDeltaX(field.x), -HALF, HALF),
          clamp(modelViewTransform.modelToViewDeltaY(field.y), -HALF, HALF),
        ),
      );
    };

    pad.addInputListener(
      new DragListener({
        start: () => {
          isDragging = true;
        },
        drag: (event) => {
          const local = padLayer.globalToLocalPoint(event.pointer.point);
          const tip = new Vector2(clamp(local.x, -HALF, HALF), clamp(local.y, -HALF, HALF));
          setTip(tip);
          applyTipToModel(tip);
        },
        end: () => {
          isDragging = false;
        },
      }),
    );

    model.externalFieldProperty.link(reflectFromModel);
  }
}
