# Per-language content tree and a UI-string module

Translations live in two places, split by what the text is:

- **Lesson content** is MDX under `src/content/lessons/<lang>/<slug>.mdx`. The
  Astro glob loader gives each entry an id of `<lang>/<slug>`; `getLessons(lang)`
  groups entries by slug and returns the requested language's variant, or the
  source-language (`en`) variant when a translation for that slug does not exist
  yet. The `<slug>` is language-independent and is the routing and Progress key.
- **The app's own copy** — chrome, home, completion screen, privacy note, and
  island labels — is `src/i18n/ui.ts`: one `en` object (the complete source,
  `as const`) plus a `DeepPartial` per translation, deep-merged onto English by
  `ui(lang)` so a missing key falls back rather than showing `undefined`.
  `{name}` placeholders are filled by `fmt()`.

We decided this because the two kinds of text have different shapes and editors.
Lesson content is long-form prose a translator edits as a whole file; keeping it
as MDX (ADR 0002) means the per-language tree is just a directory. UI strings are
dozens of short fragments referenced from many components, where a key-based
lookup with an English fallback is what keeps a half-finished translation from
breaking the build. A single mechanism for both would force either prose into a
key-value file or UI fragments into MDX.

## Consequences

- A new language is a directory of MDX files plus a `DeepPartial<UiStrings>`
  entry. It renders a complete Course from the first translated file — untranslated
  slugs and keys fall back to English — so a translation can land incrementally.
- A language is not reachable until its code is in `LIVE_LANGUAGE_CODES`
  (config.ts). The content and strings can be committed and reviewed while the
  routes stay unbuilt; `ko` and `es` both sit in exactly that state. Each has
  had an AI self-QA pass (2026-09-04: re-read against the English source,
  checked for leftover-English fragments and cross-lesson term consistency,
  spot-rendered) — that is not the same review the spec calls for. Neither
  goes live until a **named native reviewer** has actually corrected it; an
  AI re-reading its own draft cannot verify idiom, register, or cultural fit.
- Islands that render translated text take a `lang` prop and call `ui(lang)`
  themselves (`ui.ts` has no `astro:*` imports). `TryIt` has no `lang` of its
  own and reads it off `Astro.url`.
- `ui.ts` is the source of truth for the string shape; `test/ui-strings.test.ts`
  asserts every configured language resolves to the full set of keys.
