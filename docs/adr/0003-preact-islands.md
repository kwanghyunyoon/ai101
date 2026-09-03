# Preact for interactive islands

The interactive pieces of AI 101 — Knowledge Checks, the language switcher,
progress indicators, the install prompt — are built as Astro islands using
**Preact** (`@astrojs/preact`). Static content is plain Astro components with no
client JavaScript.

We decided this because the v1 spec (issue #1) requires the island framework to
be "light (Preact-class or vanilla), not React-DOM-heavy", and the interactive
surface is small and self-contained. Preact gives a familiar JSX/hooks authoring
model and a testing-library ecosystem for the component behaviour tests the spec
calls for, at a ~4 kB runtime instead of React-DOM's ~40 kB. Plain vanilla JS was
the alternative; it was rejected because the Knowledge Check has enough state
(per-question answered/feedback) that a component model keeps it maintainable and
testable.

## Consequences

- Component behaviour tests (Knowledge Check, later tickets) use a Preact
  testing-library renderer, matching the spec's testing decisions.
- Contributors write JSX with `preact` as the JSX import source (see
  `tsconfig.json`); React-specific libraries are off the table unless they work
  through `preact/compat`, which we avoid to keep the bundle small.
- Any island that grows genuinely complex is a signal to reconsider, not to
  reach for `preact/compat`.
