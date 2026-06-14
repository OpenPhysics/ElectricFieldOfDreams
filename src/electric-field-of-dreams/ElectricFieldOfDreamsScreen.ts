import { Screen, type ScreenOptions } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import type { ElectricFieldOfDreamsPreferencesModel } from "../preferences/ElectricFieldOfDreamsPreferencesModel.js";
import { ElectricFieldOfDreamsModel } from "./model/ElectricFieldOfDreamsModel.js";
import { ElectricFieldOfDreamsKeyboardHelpContent } from "./view/ElectricFieldOfDreamsKeyboardHelpContent.js";
import { ElectricFieldOfDreamsScreenView } from "./view/ElectricFieldOfDreamsScreenView.js";

type ElectricFieldOfDreamsScreenOptions = ScreenOptions & {
  tandem: Tandem;
  preferences: ElectricFieldOfDreamsPreferencesModel;
};

export class ElectricFieldOfDreamsScreen extends Screen<ElectricFieldOfDreamsModel, ElectricFieldOfDreamsScreenView> {
  public constructor(options: ElectricFieldOfDreamsScreenOptions) {
    super(
      () => new ElectricFieldOfDreamsModel(options.preferences),
      (model) => new ElectricFieldOfDreamsScreenView(model, { tandem: options.tandem.createTandem("view") }),
      {
        createKeyboardHelpNode: () => new ElectricFieldOfDreamsKeyboardHelpContent(),
        ...options,
      },
    );
  }
}
