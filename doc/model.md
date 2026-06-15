# Model - Electric Field of Dreams

This document describes the model (the underlying physics, math, and behavior) for the simulation, in
terms appropriate for an educator. It is the companion to
[implementation-notes.md](./implementation-notes.md), which targets developers.

## Overview

The simulation lets students build a system of charged particles and watch them interact through the
**Coulomb force**, while visualizing the resulting **electric field** as a grid of arrows. A uniform
**external field** can be added and adjusted, so students can explore how charges respond to both each
other and to an applied field, and how the superposition of all sources shapes the total field.

## Quantities and units

The model uses scaled simulation units chosen for clear on-screen behavior rather than calibrated SI
values; the relationships below are what matter pedagogically.

| Quantity | Symbol | Notes |
|---|---|---|
| Charge | q | Positive or negative, selectable; fixed magnitude per particle |
| Mass | m | Light or heavy, selectable; sets inertia |
| Position / velocity | r, v | Per particle, in 2-D |
| Particle field | E_particle | Field produced by each charge |
| External field | E_ext | Uniform field set by a draggable arrow |
| Total field | E | Vector sum sampled on a lattice |

## Governing equations

**Coulomb's law** — the force between two point charges:

```
F = k · q₁ q₂ / r²   (along the line joining them; repulsive for like charges)
```

**Field of a point charge** sampled at a location:

```
E_particle = k · q / r²   (directed away from positive, toward negative charge)
```

**Superposition** — the field drawn at each lattice point is the vector sum of every particle's field
plus the uniform external field:

```
E_total = Σ E_particle + E_ext
```

**Motion** — each particle obeys Newton's second law, `a = F_net / m`, integrated through the model's
`step(dt)`. While a particle is being dragged it is detached from the physics and follows the pointer.

## Simplifications and assumptions

- Two-dimensional, non-relativistic point charges; no magnetic effects or radiation.
- Constants are scaled for visualization; absolute SI magnitudes are not the teaching goal.
- The external field is perfectly uniform across the play area.
- Optional damping/boundary handling keeps particles within the visible bounds.

## References

- Coulomb's law and electric fields, any introductory E&M text (e.g. Griffiths, *Introduction to
  Electrodynamics*, Ch. 2).
- Based on the PhET *Electric Field of Dreams* teaching model.
</content>
