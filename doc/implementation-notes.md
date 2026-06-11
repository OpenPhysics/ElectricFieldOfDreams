# Implementation Notes - Electric Field of Dreams Simulation

## Architecture Overview

The Electric Field of Dreams simulation is structured using a Model-View pattern, with clear separation between Coulomb physics and visual representation. It is a SceneryStack port of the PhET *Electric Field of Dreams* simulation.

### High-Level Architecture

The simulation follows a modular architecture:

- **Model Layer (`src/electric-field-of-dreams/model/`)**: Particle state, Coulomb forces, uniform external field, and fixed-timestep integration
- **View Layer (`src/electric-field-of-dreams/view/`)**: Play area, field arrow lattice, draggable particles, and control panels

Data flows primarily from Model → View. User interactions in the View update the Model through AXON properties and drag listeners.

### Model-View Transform

A `ModelViewTransform2.createSinglePointScaleMapping()` maps model space to view space with the origin at `model.center`. The Y axis is **not inverted** (model +y points down on screen), matching the original PhET sim.

## Model Components

### Core Model Design

`ElectricFieldOfDreamsModel` serves as the central coordinator. It consolidates the original simulation, system state, and integration loop into one class.

### Component Specialization

Each model component has a single responsibility:

1. **Particle**: Charge, mass, position, velocity, and acceleration; `isDraggingProperty` excludes a particle from integration while dragged
2. **ChargeFieldCalculator**: Samples the electric field for the arrow grid only (not used for force calculations)
3. **ElectricFieldOfDreamsConstants**: System bounds, Coulomb constant, velocity cap, and field lattice density

### Physics Simulation Approach

Integration uses a fixed timestep with an accumulator (`FRAME_DURATION`, `DT_PER_FRAME`, `MAX_CATCHUP_STEPS`). Each slice applies, in order:

1. Reset acceleration
2. Wall bounce
3. Uniform external field
4. Coulomb forces between all particles
5. Velocity integration (capped)
6. Position integration

Particles remain Coulomb sources while being dragged, but their own motion is frozen until release.

Physical constants and bounds are centralized in `ElectricFieldOfDreamsConstants.ts`.

## View Components

### ElectricFieldOfDreamsScreenView as Coordinator

The screen view assembles the play area, right control column, and bottom play/step/reset controls.

Specialized view classes handle specific aspects:

1. **FieldGridNode**: Electric field arrow lattice; density driven by `fieldLatticeWidthProperty`
2. **ParticleNode**: Draggable charged particles
3. **BoundsNode**: Play-area bounding box
4. **ParticleControlPanel**: Add/remove particles, charge and mass toggles
5. **ExternalFieldControlPanel**: Draggable arrow that sets uniform external field direction and magnitude

### Color Scheme

Colors are defined in `ElectricFieldOfDreamsColors.ts` as `ProfileColorProperty` instances (background, panels, particle fill/stroke, field arrows). Views should not hardcode hex values.

### Performance Optimizations

- Field arrows are recomputed from a lattice whose density is user-adjustable
- Particles excluded from integration while dragging reduce unnecessary state updates during interaction

Note that no dispose functions have been used, which should be addressed.
