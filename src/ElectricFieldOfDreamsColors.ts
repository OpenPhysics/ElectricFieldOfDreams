import { Color, ProfileColorProperty } from "scenerystack/scenery";
import ElectricFieldOfDreamsNamespace from "./ElectricFieldOfDreamsNamespace.js";

const { BLACK, WHITE } = Color;

function profileColor(name: string, def: Color | string, projector: Color | string): ProfileColorProperty {
  return new ProfileColorProperty(ElectricFieldOfDreamsNamespace, name, { default: def, projector });
}

// ── Panel fills ───────────────────────────────────────────────────────────────
// Near-black / near-white neutral fills so panels contrast with both themes.
const PANEL_FILL_DARK = new Color(40, 40, 40);
const PANEL_FILL_LIGHT = new Color(240, 240, 240);

// Semi-transparent borders (40 % opacity) that stay visible on either fill.
const PANEL_STROKE_DARK = "rgba(255, 255, 255, 0.4)";
const PANEL_STROKE_LIGHT = "rgba(0, 0, 0, 0.4)";

// White overlay used for the external-field drag pad, at different opacities so
// it reads clearly on both themes.
const PAD_FILL_DARK = "rgba(255, 255, 255, 0.12)";
const PAD_FILL_LIGHT = "rgba(255, 255, 255, 0.65)";

const ElectricFieldOfDreamsColors = {
  backgroundColorProperty: profileColor("background", BLACK, WHITE),
  foregroundColorProperty: profileColor("foreground", WHITE, BLACK),

  panelFillProperty: profileColor("panelFill", PANEL_FILL_DARK, PANEL_FILL_LIGHT),
  panelStrokeProperty: profileColor("panelStroke", PANEL_STROKE_DARK, PANEL_STROKE_LIGHT),
  padFillProperty: profileColor("padFill", PAD_FILL_DARK, PAD_FILL_LIGHT),

  // The bounding box around the play area.
  boundsStrokeProperty: profileColor("boundsStroke", "rgba(255, 255, 255, 0.35)", "rgba(0, 0, 0, 0.25)"),

  // Particles — a mid steel-blue body that reads on both themes (matches the original),
  // with a dark navy outline and a contrasting +/- charge glyph.
  particleFillProperty: profileColor("particleFill", "#7986A6", "#7986A6"),
  particleStrokeProperty: profileColor("particleStroke", "#21366B", "#21366B"),
  particleSymbolProperty: profileColor("particleSymbol", WHITE, BLACK),

  // Electric-field sample arrows (the lattice grid). Lighter on the dark theme so the
  // navy stays visible; the original navy is used in projector mode.
  fieldArrowProperty: profileColor("fieldArrow", "#6FA8DC", "#21366B"),

  // The user-draggable external-field arrow — a warm accent so it is clearly distinct
  // from the field-sample arrows.
  externalFieldArrowProperty: profileColor("externalFieldArrow", "#F4B860", "#B06A00"),

  // Particle-control panel buttons: green for positive/add, red for negative/remove,
  // blue for the mass (light/heavy) selectors.
  positiveButtonColorProperty: profileColor("positiveButton", "#A5D6A7", "#A5D6A7"),
  negativeButtonColorProperty: profileColor("negativeButton", "#EF9A9A", "#EF9A9A"),
  massButtonColorProperty: profileColor("massButton", "#B3E0FF", "#B3E0FF"),

  // Fleet-standard aliases for shared Panel + ButtonOptions modules.
  panelBackgroundColorProperty: profileColor("panelBackground", PANEL_FILL_DARK, PANEL_FILL_LIGHT),
  panelBorderColorProperty: profileColor("panelBorder", PANEL_STROKE_DARK, PANEL_STROKE_LIGHT),
  textColorProperty: profileColor("text", WHITE, BLACK),

  // ── Light control surfaces ───────────────────────────────────────────────────
  // White chrome (combo boxes, flat push buttons, editable input fields) stays light
  // in both profiles; its text stays dark.

  /** Fill of light control surfaces: combo-box button/list, editable input fields. */
  controlSurfaceColorProperty: profileColor("controlSurface", "#ffffff", "#ffffff"),

  /** Fill of a disabled control surface (grayed-out editable input field). */
  controlSurfaceDisabledColorProperty: profileColor("controlSurfaceDisabled", "#cccccc", "#cccccc"),

  /** Text on light control surfaces: combo items, flat-button labels, field values, preferences. */
  controlSurfaceTextColorProperty: profileColor("controlSurfaceText", "#1a1a1a", "#1a1a1a"),
};

export default ElectricFieldOfDreamsColors;
