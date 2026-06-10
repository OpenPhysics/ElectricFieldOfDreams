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

## Notes

- Particles detach from physics while dragging
- External field direction/magnitude set via draggable arrow control
- Field density slider controls arrow grid resolution
