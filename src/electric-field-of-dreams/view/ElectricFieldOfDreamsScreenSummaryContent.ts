/**
 * ElectricFieldOfDreamsScreenSummaryContent.ts
 *
 * Accessible screen summary (SceneryStack Interactive Description). Describes the
 * play area and controls, gives an interaction hint, and exposes a LIVE
 * "current details" paragraph derived from the model (the number of charges in
 * the field and the play/pause state).
 *
 * Follows the OpenPhysics accessibility convention; see the canonical
 * TemplateSingleSim/SimScreenSummaryContent.ts.
 */
import { DerivedProperty } from "scenerystack/axon";
import { StringUtils } from "scenerystack/phetcommon";
import { ScreenSummaryContent } from "scenerystack/sim";
import { StringManager } from "../../i18n/StringManager.js";
import type { ElectricFieldOfDreamsModel } from "../model/ElectricFieldOfDreamsModel.js";

export class ElectricFieldOfDreamsScreenSummaryContent extends ScreenSummaryContent {
  public constructor(model: ElectricFieldOfDreamsModel) {
    const a11y = StringManager.getInstance().getA11yStrings();

    const currentDetailsProperty = new DerivedProperty(
      [
        a11y.currentDetailsStringProperty,
        a11y.playingLabelStringProperty,
        a11y.pausedLabelStringProperty,
        model.particles.lengthProperty,
        model.isPlayingProperty,
      ],
      (template, playingLabel, pausedLabel, count, isPlaying) =>
        StringUtils.fillIn(template, {
          count: count,
          state: isPlaying ? playingLabel : pausedLabel,
        }),
    );

    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsProperty,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
    });
  }
}
