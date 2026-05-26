import { Screen, type ScreenOptions } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import { ElectricFieldOfDreamsModel } from "./model/ElectricFieldOfDreamsModel.js";
import { ElectricFieldOfDreamsScreenView } from "./view/ElectricFieldOfDreamsScreenView.js";

type ElectricFieldOfDreamsScreenOptions = ScreenOptions & { tandem: Tandem };

export class ElectricFieldOfDreamsScreen extends Screen<ElectricFieldOfDreamsModel, ElectricFieldOfDreamsScreenView> {
  public constructor(options: ElectricFieldOfDreamsScreenOptions) {
    super(
      () => new ElectricFieldOfDreamsModel(),
      (model) => new ElectricFieldOfDreamsScreenView(model, { tandem: options.tandem.createTandem("view") }),
      options,
    );
  }
}
