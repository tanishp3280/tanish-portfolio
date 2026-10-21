# Existing portfolio audit — 2026-10-11

Baseline: restored ZIP, source 8e844685f82a936a7d4fed75e593abe33fd52ded. No replacement project or new framework.

## Connected in the current UI
- Homepage and main routes: ImmersivePage → Shell → ExperienceSystem, SkyChrome, buildWorld. Three-shot homepage; notebook, district, train, workshop and mail scenes each have direct routes.
- Shell owns accessible menu, command search, motion/sound preferences, keyboard shortcuts. ExperienceSystem owns Lenis and shared frame listeners.
- Sky models include residents, cars, penguin, articulated arm and procedural cartoon buildings. They remain the visual foundation.
- KeyboardTour at /keyboard loads the original skills-keyboard.spline with GSAP assembly, physical key events, selection, sounds and Bongo Cat. Preserve asset and controls.
- WorldExplorer at /world: orbit, zoom, selection, Shift-drag, keyboard controls and ten modes.
- Quant, algorithms, journal, graph, community, API routes and GitHub activity remain reachable through direct routes/search.

## Retained code is not the same as working access
- Portfolio's original six-section homepage only serves /overview. Homepage uses three isolated cinematic shots instead.
- Games are present in components/play, but LifeTour is not mounted by current Shell; /secret, /arcade and /play return notFound.
- Current /work is an immersive scene, not the retained searchable catalog. Homepage must expose the actual catalog/filter data.
- MathStudio is retained; LifeTour currently imports MathAchievements instead.

## Motion findings
- ExperienceSystem is the suitable single scroll/RAF coordinator; no second Lenis controller is needed.
- FunCursor runs its own spring loop; ExperienceSystem also renders a legacy spatial cursor. Remove the redundant visual cursor and share the frame clock.
- Keyboard animation uses fixed per-frame time/inertia. Convert to delta time and avoid idle motion fighting explode/reassemble.
- ImmersivePage already interpolates camera shots exponentially; reuse that approach across the journey.
- MotionDirector and TimelineProgress are local effects, not mounted global controllers. Keep useful counters and scoped GSAP reveals; do not stack extra scroll engines.
- PageAtmosphere mixes ocean/lunar decoration. Replace its atmosphere with one cartoon space palette while retaining its route reveal responsibilities.
- CSS has accumulated theme overrides. Add a deliberate final palette layer and migrate model constants, rather than deleting route styles blindly.

## Validation scope
Typecheck/build; browser check homepage chapter navigation, original keyboard selection and explosion, project/notes filters, award content, menu, preset chat and restored games. Keep reduced motion, input typing, native links, direct routes and fallback content functional.
