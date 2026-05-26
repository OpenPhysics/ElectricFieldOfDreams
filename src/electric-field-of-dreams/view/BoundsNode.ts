/**
 * BoundsNode.ts
 *
 * The rectangular wall the particles bounce off. The drawn rectangle is the model
 * bounds dilated by one particle radius, so a particle's edge meets the wall just as
 * its center reaches the bounce line. Ported from `views/bounds.js`.
 */

import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Rectangle } from "scenerystack/scenery";
import ElectricFieldOfDreamsColors from "../../ElectricFieldOfDreamsColors.js";
import Constants from "../model/ElectricFieldOfDreamsConstants.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

const LINE_WIDTH = 6;

export default class BoundsNode extends Rectangle {
  public constructor(model: ElectricFieldOfDreamsModel, modelViewTransform: ModelViewTransform2) {
    const dilated = model.bounds.dilated(Constants.PARTICLE_RADIUS);
    const viewBounds = modelViewTransform.modelToViewBounds(dilated);
    super(viewBounds, {
      stroke: ElectricFieldOfDreamsColors.boundsStrokeProperty,
      lineWidth: LINE_WIDTH,
    });
  }
}
