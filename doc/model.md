# Model - Electric Field of Dreams

This document describes the model (the underlying physics, math, and behavior) for the simulation,
in terms appropriate for an educator. It is the companion to
[implementation-notes.md](./implementation-notes.md), which targets developers.

## Overview

The simulation lets students place **positive and negative point charges** in a box and watch them
interact through the **Coulomb force**, while a grid of arrows visualizes the **electric field**.
A uniform **external field** (direction and magnitude set by a draggable arrow control) can be
superposed, so students explore how charges respond to each other and to an applied field, and how
individual source fields add vectorially.

Key ideas a student should take away:

- Like charges repel and opposite charges attract, with force strength falling off with separation.
- The field at any point is the **vector sum** of contributions from every charge plus the
  external field (**superposition**).
- Heavier particles accelerate more slowly under the same force; dragging a particle pauses its
  motion but it still acts as a field source for the others.

## Quantities and units

The model uses **scaled simulation units** (a 300 × 300 play box) tuned for on-screen behavior,
not laboratory SI calibration.

| Quantity | Symbol | Notes |
|---|---|---|
| Charge | q | ±1 per particle (sign selectable) |
| Mass | m | Light (1) or heavy (5) — sets inertia |
| Position / velocity | **r**, **v** | 2-D per particle |
| Inter-particle force | **F** | Coulomb law between pairs |
| External field | **E**_ext | Uniform, user-set vector |
| Total field (display) | **E** | Sampled on an adjustable arrow lattice |

Model coordinates use **y increasing downward** on screen ("north" is smaller y).

## Governing equations

**Coulomb force** between two point charges (magnitude, along the line joining them):

```
|F| = k · |q₁ q₂| / r²     (like charges repel, opposites attract)
```

In the simulation the pairwise force is implemented with a direction from target toward source and
a signed magnitude proportional to q₁ q₂ / r³, equivalent to the usual inverse-square law.

**Force on a charge in a field:**

```
F = q · E        →        a = F / m
```

**Superposition** — field arrows at each lattice point:

```
E_total = Σ E_particle + E_ext
```

Each particle's contribution follows a 1/r² falloff from that charge (visualization uses a
slightly larger constant than the force law for clearer arrows).

**Motion** — explicit Euler integration each fixed step: reset acceleration → wall bounces →
apply external field → sum Coulomb forces → update velocity (speed-capped) → update position.

While a particle is **dragged**, it does not integrate (velocity frozen) but still exerts Coulomb
forces on other particles.

## Simplifications and assumptions

- **2-D, non-relativistic point charges** — no magnetic forces, radiation, or charge transfer.
- **Scaled constants** — `k` values are chosen for lively motion in the box, not Coulomb's constant
  in SI units.
- **Perfectly uniform external field** across the entire play area.
- **Wall bounces** — inelastic reflection keeps particles inside the box (with a deliberate
  east-wall velocity quirk carried from the PhET original).
- **No air drag** beyond the velocity cap applied each step.

## References

- Coulomb's law, electric field, and superposition, introductory E&M (e.g. Griffiths, *Introduction
  to Electrodynamics*, Ch. 2; Young & Freedman, *University Physics*, Ch. 21).
- PhET Interactive Simulations, [*Electric Field of Dreams*](https://phet.colorado.edu/en/simulations/electric-field-of-dreams)
  (University of Colorado) — original Java simulation this port reimplements.
