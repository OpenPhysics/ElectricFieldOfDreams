/**
 * ElectricFieldOfDreamsKeyboardHelpContent.ts
 *
 * Content for the keyboard-help dialog (the "?" button in the navigation bar).
 * Composed from the standard scenery-phet help sections so every row stays in
 * sync with the real interaction model: a slider section for the adjustable
 * controls and the basic-actions section for tab navigation and buttons.
 */

import {
  BasicActionsKeyboardHelpSection,
  SliderControlsKeyboardHelpSection,
  TwoColumnKeyboardHelpContent,
} from "scenerystack/scenery-phet";

export class ElectricFieldOfDreamsKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  public constructor() {
    // Left: adjusting sliders. Right: Tab/button navigation.
    super([new SliderControlsKeyboardHelpSection()], [new BasicActionsKeyboardHelpSection()]);
  }
}
