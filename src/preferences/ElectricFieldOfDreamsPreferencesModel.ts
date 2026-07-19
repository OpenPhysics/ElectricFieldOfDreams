/**
 * ElectricFieldOfDreamsPreferencesModel.ts
 *
 * Sim-specific preferences (Preferences → Simulation) for Electric Field of
 * Dreams. Each preference Property takes its initial value from the
 * corresponding query parameter in electricFieldOfDreamsQueryParameters.
 */

import { NumberProperty } from "scenerystack/axon";
import type { Tandem } from "scenerystack/tandem";
import Constants from "../ElectricFieldOfDreamsConstants.js";
import ElectricFieldOfDreamsNamespace from "../ElectricFieldOfDreamsNamespace.js";
import electricFieldOfDreamsQueryParameters from "./electricFieldOfDreamsQueryParameters.js";

export const FIELD_LATTICE_WIDTH_RANGE = Constants.DISCRETENESS_RANGE;

export class ElectricFieldOfDreamsPreferencesModel {
  /** Width of the field-sampling lattice (grid discreteness). */
  public readonly fieldLatticeWidthProperty: NumberProperty;

  public constructor(tandem?: Tandem) {
    this.fieldLatticeWidthProperty = new NumberProperty(electricFieldOfDreamsQueryParameters.fieldLatticeWidth, {
      range: FIELD_LATTICE_WIDTH_RANGE,
      numberType: "Integer",
      ...(tandem && { tandem: tandem.createTandem("fieldLatticeWidthProperty") }),
    });
  }

  public reset(): void {
    this.fieldLatticeWidthProperty.reset();
  }
}

ElectricFieldOfDreamsNamespace.register("ElectricFieldOfDreamsPreferencesModel", ElectricFieldOfDreamsPreferencesModel);
