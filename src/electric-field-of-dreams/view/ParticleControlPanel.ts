/**
 * ParticleControlPanel.ts
 *
 * Lets the user choose a charge and mass, then Add a particle with those values or
 * Remove the most recently added one. Replaces the original sim.html "Particle" panel
 * (two number inputs + Add/Remove buttons).
 */

import { NumberProperty } from "scenerystack/axon";
import { Dimension2, Range } from "scenerystack/dot";
import { HBox, Text, VBox } from "scenerystack/scenery";
import { NumberControl, PhetFont } from "scenerystack/scenery-phet";
import { Panel, TextPushButton } from "scenerystack/sun";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import { StringManager } from "../../i18n/StringManager.js";
import Constants from "../model/ElectricFieldOfDreamsConstants.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

const TITLE_FONT_SIZE = 16;
const CONTROL_FONT_SIZE = 13;
const BUTTON_FONT_SIZE = 14;

const CHARGE_RANGE = new Range(-5, 5);
const MASS_RANGE = new Range(0.5, 5);

const PANEL_CORNER_RADIUS = 6;
const PANEL_X_MARGIN = 12;
const PANEL_Y_MARGIN = 10;
const VBOX_SPACING = 10;
const BUTTON_SPACING = 10;

export default class ParticleControlPanel extends Panel {
  public constructor(model: ElectricFieldOfDreamsModel) {
    const strings = StringManager.getInstance().getParticleStrings();

    const titleFont = new PhetFont({ size: TITLE_FONT_SIZE, weight: "bold" });
    const controlFont = new PhetFont(CONTROL_FONT_SIZE);

    const header = new Text(strings.titleStringProperty, {
      font: titleFont,
      fill: ElectricFieldOfDreamsColors.foregroundColorProperty,
    });

    // Charge/mass for the next particle the Add button will create.
    const chargeProperty = new NumberProperty(-Constants.DEFAULT_CHARGE);
    const massProperty = new NumberProperty(Constants.DEFAULT_MASS);

    const numberControlOptions = {
      titleNodeOptions: { font: controlFont, fill: ElectricFieldOfDreamsColors.foregroundColorProperty },
      numberDisplayOptions: { textOptions: { font: controlFont }, decimalPlaces: 1 },
      sliderOptions: { trackSize: new Dimension2(120, 3) },
      delta: 0.5,
    };

    const chargeControl = new NumberControl(strings.chargeStringProperty, chargeProperty, CHARGE_RANGE, {
      ...numberControlOptions,
    });
    const massControl = new NumberControl(strings.massStringProperty, massProperty, MASS_RANGE, {
      ...numberControlOptions,
    });

    const addButton = new TextPushButton(strings.addStringProperty, {
      font: new PhetFont(BUTTON_FONT_SIZE),
      baseColor: "#a5d6a7",
      listener: () => {
        model.addParticle(chargeProperty.value, massProperty.value);
      },
    });
    const removeButton = new TextPushButton(strings.removeStringProperty, {
      font: new PhetFont(BUTTON_FONT_SIZE),
      baseColor: "#ef9a9a",
      listener: () => {
        model.removeParticle();
      },
    });
    const buttons = new HBox({ spacing: BUTTON_SPACING, children: [addButton, removeButton] });

    const content = new VBox({
      spacing: VBOX_SPACING,
      align: "center",
      children: [header, chargeControl, massControl, buttons],
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
