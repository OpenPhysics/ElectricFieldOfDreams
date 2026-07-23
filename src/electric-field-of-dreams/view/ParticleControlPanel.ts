/**
 * ParticleControlPanel.ts
 *
 * Lets the user choose charge sign (Positive / Negative) and mass preset (Light / Heavy),
 * then Add a particle with those values or Remove the most recently added one.
 *
 * Every control is icon-based rather than worded: the sign selector shows a +/- charge
 * glyph, the mass selector a small vs. large body, and Add / Remove use bold +/- signs.
 * The sign and mass selectors are RectangularRadioButtonGroups, so the current choice reads
 * as a proper radio group and is fully keyboard-operable (Tab to the group, arrow keys to
 * choose); Add / Remove are push buttons reachable by Tab and activated with Enter / Space.
 * Each icon carries an accessibleName so its meaning is announced despite having no text.
 */

import { BooleanProperty } from "scenerystack/axon";
import { Dimension2 } from "scenerystack/dot";
import { Circle, HBox, Node, Text, VBox } from "scenerystack/scenery";
import { MinusNode, PhetFont, PlusNode } from "scenerystack/scenery-phet";
import { Panel, RectangularPushButton, RectangularRadioButtonGroup } from "scenerystack/sun";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import Constants from "../../ElectricFieldOfDreamsConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

const TITLE_FONT_SIZE = 16;

const PANEL_CORNER_RADIUS = 6;
const PANEL_X_MARGIN = 12;
const PANEL_Y_MARGIN = 10;
const VBOX_SPACING = 10;
const GROUP_SPACING = 10;

// Charge-glyph icon (mirrors ParticleNode): a steel-blue body with a +/- sign.
const ICON_RADIUS = 13;
const ICON_STROKE_WIDTH = 2;
const GLYPH_SIZE = new Dimension2(16, 4);

// Mass icons: same body, sized down for Light and up for Heavy.
const LIGHT_ICON_RADIUS = 8;
const HEAVY_ICON_RADIUS = 13;

// Bold +/- signs used as the Add / Remove push-button content. A shared button size
// keeps the two the same footprint even though a plus and a minus differ in height.
const ACTION_GLYPH_SIZE = new Dimension2(18, 4);
const ACTION_BUTTON_SIZE = new Dimension2(44, 34);

function chargeIcon(isPositive: boolean): Node {
  const body = new Circle(ICON_RADIUS, {
    fill: ElectricFieldOfDreamsColors.particleFillProperty,
    stroke: ElectricFieldOfDreamsColors.particleStrokeProperty,
    lineWidth: ICON_STROKE_WIDTH,
  });
  const glyph = isPositive
    ? new PlusNode({ size: GLYPH_SIZE, fill: ElectricFieldOfDreamsColors.particleSymbolProperty })
    : new MinusNode({ size: GLYPH_SIZE, fill: ElectricFieldOfDreamsColors.particleSymbolProperty });
  glyph.center = body.center;
  return new Node({ children: [body, glyph] });
}

function massIcon(radius: number): Node {
  return new Circle(radius, {
    fill: ElectricFieldOfDreamsColors.particleFillProperty,
    stroke: ElectricFieldOfDreamsColors.particleStrokeProperty,
    lineWidth: ICON_STROKE_WIDTH,
  });
}

export default class ParticleControlPanel extends Panel {
  public constructor(model: ElectricFieldOfDreamsModel) {
    const strings = StringManager.getInstance().getParticleStrings();
    const a11y = StringManager.getInstance().getA11yStrings();

    const header = new Text(strings.titleStringProperty, {
      font: new PhetFont({ size: TITLE_FONT_SIZE, weight: "bold" }),
      fill: ElectricFieldOfDreamsColors.foregroundColorProperty,
    });

    // Charge selection: Positive (+DEFAULT_CHARGE) or Negative (-DEFAULT_CHARGE).
    const chargeIsPositiveProperty = new BooleanProperty(true);
    const chargeSelector = new RectangularRadioButtonGroup<boolean>(
      chargeIsPositiveProperty,
      [
        {
          value: true,
          createNode: () => chargeIcon(true),
          options: {
            baseColor: ElectricFieldOfDreamsColors.positiveButtonColorProperty,
            accessibleName: a11y.controls.positiveChargeStringProperty,
          },
        },
        {
          value: false,
          createNode: () => chargeIcon(false),
          options: {
            baseColor: ElectricFieldOfDreamsColors.negativeButtonColorProperty,
            accessibleName: a11y.controls.negativeChargeStringProperty,
          },
        },
      ],
      {
        orientation: "horizontal",
        spacing: GROUP_SPACING,
        accessibleName: a11y.controls.chargeSelectorStringProperty,
      },
    );

    // Mass selection: Light (DEFAULT_MASS) or Heavy (HEAVY_MASS).
    const massIsLightProperty = new BooleanProperty(true);
    const massSelector = new RectangularRadioButtonGroup<boolean>(
      massIsLightProperty,
      [
        {
          value: true,
          createNode: () => massIcon(LIGHT_ICON_RADIUS),
          options: {
            baseColor: ElectricFieldOfDreamsColors.massButtonColorProperty,
            accessibleName: a11y.controls.lightMassStringProperty,
          },
        },
        {
          value: false,
          createNode: () => massIcon(HEAVY_ICON_RADIUS),
          options: {
            baseColor: ElectricFieldOfDreamsColors.massButtonColorProperty,
            accessibleName: a11y.controls.heavyMassStringProperty,
          },
        },
      ],
      {
        orientation: "horizontal",
        spacing: GROUP_SPACING,
        accessibleName: a11y.controls.massSelectorStringProperty,
      },
    );

    const addButton = new RectangularPushButton({
      content: new PlusNode({ size: ACTION_GLYPH_SIZE, fill: ElectricFieldOfDreamsColors.particleSymbolProperty }),
      size: ACTION_BUTTON_SIZE,
      baseColor: ElectricFieldOfDreamsColors.positiveButtonColorProperty,
      accessibleName: a11y.controls.addChargeStringProperty,
      listener: () => {
        const charge = chargeIsPositiveProperty.value ? Constants.DEFAULT_CHARGE : -Constants.DEFAULT_CHARGE;
        const mass = massIsLightProperty.value ? Constants.DEFAULT_MASS : Constants.HEAVY_MASS;
        model.addParticle(charge, mass);
      },
    });
    const removeButton = new RectangularPushButton({
      content: new MinusNode({ size: ACTION_GLYPH_SIZE, fill: ElectricFieldOfDreamsColors.particleSymbolProperty }),
      size: ACTION_BUTTON_SIZE,
      baseColor: ElectricFieldOfDreamsColors.negativeButtonColorProperty,
      accessibleName: a11y.controls.removeChargeStringProperty,
      listener: () => {
        model.removeParticle();
      },
    });

    const content = new VBox({
      spacing: VBOX_SPACING,
      align: "center",
      children: [
        header,
        chargeSelector,
        massSelector,
        new HBox({ spacing: GROUP_SPACING, children: [addButton, removeButton] }),
      ],
    });

    super(content, {
      fill: ElectricFieldOfDreamsColors.panelFillProperty,
      stroke: ElectricFieldOfDreamsColors.panelStrokeProperty,
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
      accessibleName: a11y.controls.particlePanelStringProperty,
      accessibleHelpText: a11y.controls.particlePanelHelpStringProperty,
    });

    // Disable Remove when there are no particles to remove.
    model.particles.lengthProperty.link((length) => {
      removeButton.enabled = length > 0;
    });
  }
}
