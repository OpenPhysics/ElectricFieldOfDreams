/**
 * ElectricFieldOfDreamsPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Controls are bound to
 * ElectricFieldOfDreamsPreferencesModel Properties (initial values from query
 * parameters).
 */

import { Text, VBox } from "scenerystack/scenery";
import { NumberControl, PhetFont } from "scenerystack/scenery-phet";
import type { Tandem } from "scenerystack/tandem";
import ElectricFieldOfDreamsNamespace from "../ElectricFieldOfDreamsNamespace.js";
import { StringManager } from "../i18n/StringManager.js";
import {
  type ElectricFieldOfDreamsPreferencesModel,
  FIELD_LATTICE_WIDTH_RANGE,
} from "./ElectricFieldOfDreamsPreferencesModel.js";

export class ElectricFieldOfDreamsPreferencesNode extends VBox {
  public constructor(preferencesModel: ElectricFieldOfDreamsPreferencesModel, tandem?: Tandem) {
    const prefStrings = StringManager.getInstance().getPreferences();

    const header = new Text(prefStrings.titleStringProperty, {
      font: new PhetFont({ size: 18, weight: "bold" }),
    });

    const fieldLatticeWidthControl = new NumberControl(
      prefStrings.fieldLatticeWidthStringProperty,
      preferencesModel.fieldLatticeWidthProperty,
      FIELD_LATTICE_WIDTH_RANGE,
      {
        delta: 1,
        numberDisplayOptions: { decimalPlaces: 0 },
        titleNodeOptions: { font: new PhetFont(14), maxWidth: 200 },
        arrowButtonOptions: { scale: 0.75 },
        layoutFunction: NumberControl.createLayoutFunction4({ sliderPadding: 5 }),
        ...(tandem && { tandem: tandem.createTandem("fieldLatticeWidthControl") }),
      },
    );

    super({
      align: "left",
      spacing: 12,
      children: [header, fieldLatticeWidthControl],
    });
  }
}

ElectricFieldOfDreamsNamespace.register("ElectricFieldOfDreamsPreferencesNode", ElectricFieldOfDreamsPreferencesNode);
