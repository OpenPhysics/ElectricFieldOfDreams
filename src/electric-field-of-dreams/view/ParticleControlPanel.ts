/**
 * ParticleControlPanel.ts
 *
 * Lets the user choose charge sign (Positive / Negative) and mass preset (Light / Heavy),
 * then Add a particle with those values or Remove the most recently added one.
 * Toggle buttons show the current selection via opacity; the dimmed button is inactive.
 */

import { BooleanProperty } from "scenerystack/axon";
import { HBox, Text, VBox } from "scenerystack/scenery";
import { PhetFont } from "scenerystack/scenery-phet";
import { Panel, TextPushButton } from "scenerystack/sun";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import { StringManager } from "../../i18n/StringManager.js";
import Constants from "../model/ElectricFieldOfDreamsConstants.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

const TITLE_FONT_SIZE = 16;
const BUTTON_FONT_SIZE = 14;

const PANEL_CORNER_RADIUS = 6;
const PANEL_X_MARGIN = 12;
const PANEL_Y_MARGIN = 10;
const VBOX_SPACING = 10;
const BUTTON_SPACING = 10;

const SELECTED_OPACITY = 1.0;
const UNSELECTED_OPACITY = 0.45;

export default class ParticleControlPanel extends Panel {
  public constructor(model: ElectricFieldOfDreamsModel) {
    const strings = StringManager.getInstance().getParticleStrings();

    const font = new PhetFont(BUTTON_FONT_SIZE);
    const header = new Text(strings.titleStringProperty, {
      font: new PhetFont({ size: TITLE_FONT_SIZE, weight: "bold" }),
      fill: ElectricFieldOfDreamsColors.foregroundColorProperty,
    });

    // Charge selection: Positive (+DEFAULT_CHARGE) or Negative (-DEFAULT_CHARGE).
    const chargeIsPositiveProperty = new BooleanProperty(true);

    const positiveButton = new TextPushButton(strings.positiveStringProperty, {
      font,
      baseColor: ElectricFieldOfDreamsColors.positiveButtonColorProperty,
      listener: () => {
        chargeIsPositiveProperty.value = true;
      },
    });
    const negativeButton = new TextPushButton(strings.negativeStringProperty, {
      font,
      baseColor: ElectricFieldOfDreamsColors.negativeButtonColorProperty,
      listener: () => {
        chargeIsPositiveProperty.value = false;
      },
    });
    chargeIsPositiveProperty.link((isPositive) => {
      positiveButton.opacity = isPositive ? SELECTED_OPACITY : UNSELECTED_OPACITY;
      negativeButton.opacity = isPositive ? UNSELECTED_OPACITY : SELECTED_OPACITY;
    });

    // Mass selection: Light (DEFAULT_MASS) or Heavy (HEAVY_MASS).
    const massIsLightProperty = new BooleanProperty(true);

    const lightButton = new TextPushButton(strings.lightStringProperty, {
      font,
      baseColor: ElectricFieldOfDreamsColors.massButtonColorProperty,
      listener: () => {
        massIsLightProperty.value = true;
      },
    });
    const heavyButton = new TextPushButton(strings.heavyStringProperty, {
      font,
      baseColor: ElectricFieldOfDreamsColors.massButtonColorProperty,
      listener: () => {
        massIsLightProperty.value = false;
      },
    });
    massIsLightProperty.link((isLight) => {
      lightButton.opacity = isLight ? SELECTED_OPACITY : UNSELECTED_OPACITY;
      heavyButton.opacity = isLight ? UNSELECTED_OPACITY : SELECTED_OPACITY;
    });

    const addButton = new TextPushButton(strings.addStringProperty, {
      font,
      baseColor: ElectricFieldOfDreamsColors.positiveButtonColorProperty,
      listener: () => {
        const charge = chargeIsPositiveProperty.value ? Constants.DEFAULT_CHARGE : -Constants.DEFAULT_CHARGE;
        const mass = massIsLightProperty.value ? Constants.DEFAULT_MASS : Constants.HEAVY_MASS;
        model.addParticle(charge, mass);
      },
    });
    const removeButton = new TextPushButton(strings.removeStringProperty, {
      font,
      baseColor: ElectricFieldOfDreamsColors.negativeButtonColorProperty,
      listener: () => {
        model.removeParticle();
      },
    });

    const content = new VBox({
      spacing: VBOX_SPACING,
      align: "center",
      children: [
        header,
        new HBox({ spacing: BUTTON_SPACING, children: [positiveButton, negativeButton] }),
        new HBox({ spacing: BUTTON_SPACING, children: [lightButton, heavyButton] }),
        new HBox({ spacing: BUTTON_SPACING, children: [addButton, removeButton] }),
      ],
    });

    super(content, {
      fill: ElectricFieldOfDreamsColors.panelFillProperty,
      stroke: ElectricFieldOfDreamsColors.panelStrokeProperty,
      cornerRadius: PANEL_CORNER_RADIUS,
      xMargin: PANEL_X_MARGIN,
      yMargin: PANEL_Y_MARGIN,
    });

    // Disable Remove when there are no particles to remove.
    model.particles.lengthProperty.link((length) => {
      removeButton.enabled = length > 0;
    });
  }
}
