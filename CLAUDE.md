# CLAUDE.md — Electric Field of Dreams

Sim-specific context for AI assistants. General SceneryStack guidance: [OpenPhysics/.github/CLAUDE.md](https://github.com/OpenPhysics/.github/blob/main/CLAUDE.md).

## Project

SceneryStack port of the PhET *Electric Field of Dreams* simulation. Place charged particles, observe Coulomb forces, and visualize the field with an adjustable uniform external field.

## Key files

| Area | Location |
|---|---|
| Screen | `src/electric-field-of-dreams/ElectricFieldOfDreamsScreen.ts` |
| Model | `src/electric-field-of-dreams/model/` |
| View | `src/electric-field-of-dreams/view/ElectricFieldOfDreamsScreenView.ts` |

## Accessibility

Follows the shared [OpenPhysics accessibility convention](https://github.com/OpenPhysics/Baton/blob/main/ACCESSIBILITY.md).
`ElectricFieldOfDreamsScreenView` registers `ElectricFieldOfDreamsScreenSummaryContent` (live
current-details: charge count + play state) via the `screenSummaryContent` super-option, and
orders the PDOM through a wrapper `Node`. A11y strings live under the top-level `a11y` key in each
locale JSON, via `StringManager.getA11yStrings()`.

## Notes

- Particles detach from physics while dragging
- External field direction/magnitude set via draggable arrow control
- Field density slider controls arrow grid resolution
