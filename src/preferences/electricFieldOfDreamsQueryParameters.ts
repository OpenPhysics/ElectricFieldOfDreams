/**
 * electricFieldOfDreamsQueryParameters.ts
 *
 * Sim-specific startup query parameters for Electric Field of Dreams. All
 * entries are public and provide the initial values for the sim-specific
 * preferences in ElectricFieldOfDreamsPreferencesModel.
 *
 * Usage: append e.g. `?fieldLatticeWidth=10` to the sim URL.
 */

import { logGlobal } from "scenerystack/phet-core";
import { QueryStringMachine } from "scenerystack/query-string-machine";
import Constants from "../ElectricFieldOfDreamsConstants.js";
import ElectricFieldOfDreamsNamespace from "../ElectricFieldOfDreamsNamespace.js";

const electricFieldOfDreamsQueryParameters = QueryStringMachine.getAll({
  /** Width of the field-sampling lattice (grid discreteness). */
  fieldLatticeWidth: {
    type: "number" as const,
    defaultValue: Constants.DISCRETENESS_DEFAULT,
    public: true,
    isValidValue: (value: number) =>
      Number.isInteger(value) && value >= Constants.DISCRETENESS_RANGE.min && value <= Constants.DISCRETENESS_RANGE.max,
  },
});

ElectricFieldOfDreamsNamespace.register("electricFieldOfDreamsQueryParameters", electricFieldOfDreamsQueryParameters);

// Log query parameters (for the console / PhET-iO).
logGlobal("phet.chipper.queryParameters");

export default electricFieldOfDreamsQueryParameters;
