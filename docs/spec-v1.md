# Spec: AI 101 v1

## Problem Statement

Non-technical adults keep hearing that they should "use AI," but the on-ramps
are bad. Marketing pages oversell, YouTube tutorials assume a developer, and the
tools themselves drop you into a blank text box with no guidance. A curious adult
who has heard of ChatGPT — maybe tried it once, got a mediocre answer, and backed
away — has nowhere trustworthy to spend 40 minutes and come out genuinely able to
use these tools well. Existing courses are long, English-only, or paywalled.

## Solution

A free, installable Progressive Web App called **AI 101** that a Learner can
finish in one ~40-minute sitting. Six short Lessons take the Learner from "what
is an LLM, really" through practical prompting to worked everyday examples, plus
honest guidance on which of the major consumer tools to use and how to stay safe.
Each Lesson ends with a short Knowledge Check that gives immediate feedback.
The app works fully offline once opened, remembers the Learner's Progress in
their own browser with no account, and ships in English, Korean, and Spanish
(Latin America). It is deliberately compact: a Learner who finishes it is
meaningfully more capable, and nobody bounces off a 40-lesson wall.

## User Stories

1. As a curious non-technical adult, I want a single short course on AI basics, so that I can get oriented without committing to a long class.
2. As a Learner, I want the whole Course to be finishable in about 40 minutes, so that I can do it in one sitting.
3. As a Learner, I want a plain-language explanation of what an LLM actually is, so that I stop imagining it as a magic all-knowing database.
4. As a Learner, I want to understand that an LLM predicts text rather than "thinks," so that its mistakes make sense to me.
5. As a Learner, I want to know what LLMs are good and bad at, so that I use them for the right tasks.
6. As a Learner, I want to understand hallucination and why the tool sounds confident when it is wrong, so that I do not trust fluent answers blindly.
7. As a Learner, I want a practical lesson on how to prompt well (context, format, examples, iteration), so that I get useful answers instead of generic ones.
8. As a Learner, I want a before/after example of a lazy prompt versus a good one, so that I can see the technique working on a real task.
9. As a Learner, I want Try-It callouts that tell me exactly what to paste into a real tool, so that I get hands-on practice while learning.
10. As a Learner, I want a short honest profile of ChatGPT, Claude, Gemini, Grok, and Perplexity, so that I can choose one to start with.
11. As a Learner, I want to understand that Perplexity is the research/cited-sources tool while the others are general assistants, so that I pick the right kind of tool for a research task.
12. As a Learner, I want the tool-comparison lesson to show when it was last reviewed, so that I know how current the guidance is.
13. As a Learner, I want guidance on using AI safely — not pasting secrets or others' private data, verifying facts, disclosing AI use — so that I avoid the common mistakes.
14. As a Learner, I want to know that free tools may use my chats and how to opt out, so that I can control my data.
15. As a Learner, I want several fully worked everyday examples (email, planning, learning, summarizing, getting unstuck), so that I can copy the pattern into my own life.
16. As a Learner, I want a Knowledge Check at the end of each Lesson, so that I can confirm I understood the key points.
17. As a Learner, I want each quiz question to tell me immediately whether I was right and why, so that a wrong answer teaches me something.
18. As a Learner, I want to retry quiz questions freely with no score kept, so that I feel no test anxiety.
19. As a Learner, I want the app to remember which Lessons I have completed, so that I can leave and come back without losing my place.
20. As a Learner, I want a "3 of 6 done" style indicator, so that I can see my progress through the Course.
21. As a Learner, I want a resume point so the app can take me back to where I stopped, so that returning is effortless.
22. As a Learner, I want no signup or login, so that I can start immediately.
23. As a Learner on a slow or expensive connection, I want the app to work fully offline after the first visit, so that I am not blocked or charged for data mid-Lesson.
24. As a Learner, I want to install the app to my home screen, so that it feels like an app and is one tap away.
25. As a Learner, I want the app to load fast on an old phone, so that hardware is not a barrier.
26. As a Spanish-speaking Learner in Latin America, I want the entire Course in Spanish, so that I can learn in my own language.
27. As a Korean-speaking Learner, I want the entire Course in Korean, so that I can learn in my own language.
28. As a Learner, I want the app to open in my language automatically based on my browser, so that I do not have to hunt for a language setting.
29. As a Learner, I want an always-visible language switcher, so that I can override the automatic choice.
30. As a Learner, I want my language choice remembered, so that I do not re-pick it every visit.
31. As a Learner, I want Korean text to render in a proper Korean typeface, so that it is comfortable to read.
32. As a Learner using a screen reader or keyboard, I want the app to be fully navigable, so that a disability is not a barrier.
33. As a Learner, I want text that respects my reduced-motion preference, so that animations do not make me unwell.
34. As a Learner with limited literacy or limited English, I want short sentences and every technical term defined in plain words, so that I can follow along.
35. As a Learner, I want a home screen that shows the promise, the time cost, the "free, no signup," the Lesson list, and my progress, so that I know what I am getting into and can jump back in.
36. As a Learner, I want a plain-language note about what the app stores and does not store, so that I can trust a course that itself preaches data caution.
37. As the project maintainer, I want all Lesson content authored as MDX files in the repo, so that every change including translations is reviewable in a pull request.
38. As the project maintainer, I want the build to fail if a Lesson is missing in any language or has a malformed Knowledge Check, so that a broken or partial translation cannot ship silently.
39. As the project maintainer, I want English to be able to launch before Korean and Spanish are ready, so that translation does not hold up release.
40. As the project maintainer, I want each language to flip live independently when its native review is done, so that I can release incrementally.
41. As the project maintainer, I want privacy-friendly aggregate analytics (pageviews, no cookies), so that I can see whether Learners finish and which languages get used without a consent banner.
42. As the project maintainer, I want the site to host for free, so that the project has no running cost.
43. As the project maintainer, I want a public repo under an open-content license, so that people can correct mistakes and contribute translations.
44. As a translator, I want a stable content structure with a clear per-Lesson file per language, so that I know exactly what to translate.
45. As a contributor, I want a written style guide covering reading level, sentence length, tone, and jargon rules, so that my contributions match the Course voice.
46. As a Learner who finishes, I want a closing screen that acknowledges completion and points me at what to do next, so that the Course ends with momentum rather than a dead stop.

## Implementation Decisions

### Architecture

- **Fully static site**, no application server, no database, no accounts. See ADR-0001.
- Built with **Astro**, output prerendered. Interactive pieces (Knowledge Check, language switcher, progress indicators, install prompt) are small client-side islands; the framework for islands is an implementation choice left to the build ticket, but it must be light (Preact-class or vanilla), not React-DOM-heavy.
- Hosted on **Cloudflare Pages**, free tier, on the default `*.pages.dev` subdomain. No custom domain in v1.
- **Cloudflare Web Analytics** for aggregate, cookieless pageview data. No custom events; the completion funnel is read by comparing pageviews of the first Lesson, the last Lesson, and the completion screen.

### Content

- All content authored as **MDX in-repo**, managed by **Astro Content Collections**. See ADR-0002.
- One content collection per concern; Lessons are the primary collection. Each Lesson has a language-keyed set of MDX files sharing a stable slug/id.
- Lesson frontmatter carries at minimum: stable id, order, title, estimated minutes, and the Knowledge Check (questions, options, correct answer, per-answer explanation). The exact schema is defined in the content-schema ticket.
- The Content Collection schema is a **build-time seam**: `astro build` (and a check in CI) fails if any Lesson is absent in a configured language, if frontmatter does not validate, or if a Knowledge Check is malformed (no correct answer, missing explanation, etc.).
- **Six Lessons**, in order:
  1. **What an LLM actually is** — predicts the next chunk of text; learned patterns from a large amount of human writing; not a database, not thinking or feeling; "model" = compressed patterns; why it can produce text that never existed before.
  2. **What it's good and bad at** — strong at language tasks (draft, rephrase, summarize, explain, translate, brainstorm); weak at exact facts, math, recent events, anything needing a source of truth; hallucination — confidently wrong because fluent text is the objective; it does not know what it does not know.
  3. **How to talk to it (prompting)** — the core Lesson, gets the most words and the most Try-It practice. Give context (who you are, purpose, audience); state the form you want (length, format, tone); show an example; iterate on the first answer as a draft; break big asks into steps; "act as / write for" framing; one before/after lazy-vs-good prompt on the same task.
  4. **The Five Tools** — "more alike than different" opener, then one short profile each: ChatGPT (default all-rounder, largest ecosystem, voice/image), Claude (long documents, careful writing, coding), Gemini (tied into Google apps, large context), Grok (built into X, real-time posts, looser filters), Perplexity (the research one — answers with cited sources, closer to a search engine). Capability-framed, no version numbers or benchmark claims. Ends: "pick one, stick with it for a week." Carries a visible "last reviewed" date.
  5. **Using AI safely and honestly** — don't paste secrets, passwords, or others' private data; verify anything factual; disclose AI use where it matters (school, work, publishing); it reflects training-data bias; free tools may use your chats and how to opt out; it is a tool, not an authority.
  6. **Putting it to work** — 4–5 fully worked everyday examples, each showing the actual prompt and what to check in the response: awkward email reply; planning something; learning a new topic via beginner explanation + follow-ups; summarizing a long document; getting unstuck by talking a task through. Ends pointing back to Lesson 3.
- Each Knowledge Check has **3–4 questions**, immediate per-question feedback (correct/incorrect + a one-line "why"), unlimited retry, nothing scored or persisted.
- **Try-It callouts** are an inline content component: a labelled block with a copyable prompt and a one-line note on what to look for in the result. They never call an API.
- A **STYLE.md** at the repo root codifies: ~8th-grade English reading level; sentences mostly under 20 words; every technical term defined in plain words on first use; second person, warm not cutesy; concrete everyday examples over abstractions; no hype, no doom. Writers and translators both follow it.

### Internationalisation

- **Path-prefix routing for all three languages**: `/en/...`, `/ko/...`, `/es/...`. No language is privileged in the URL structure.
- `/` performs first-visit language detection from the browser `Accept-Language` and redirects to the matching prefix, defaulting to `/en/` when no supported language matches.
- The chosen language is persisted in `localStorage` and takes precedence over `Accept-Language` on later visits.
- An **always-visible language switcher** in the app chrome; switching navigates to the same Lesson in the target language and updates the stored preference.
- `hreflang` alternate links on every page for SEO.
- Korean uses a bundled Korean-capable typeface (e.g. Pretendard) or a system CJK stack; Latin script covers English and Spanish.
- The set of "live" languages is configuration: English is live at launch; Korean and Spanish are enabled per-language when their native review completes. A language that is configured but not yet complete must not be reachable and must not break the build (the build check runs against live languages).

### Progress

- A **`progress` module** with a small interface (mark a Lesson complete, query completion state, compute "N of M", get the resume point) over a storage **port** that is `localStorage` in production and swappable in tests. This is the second seam.
- Progress is per-browser, unauthenticated, and safe to lose.
- The home screen doubles as table of contents and resume screen: shows each Lesson with its completion state, a "N of 6 done" summary, and a primary action that is "Start Lesson 1" or "Resume Lesson X".
- A **completion screen** shown when all six Lessons are complete: acknowledges completion, points at next steps (revisit Lesson 3, go practice in a chosen tool).

### PWA

- Web app manifest with name, theme, and icons. **App icon is a simple generated SVG wordmark** ("AI 101") — no designer dependency in v1.
- A service worker that **precaches the entire Course** (all Lessons for all live languages, images, quiz data, app shell) on first load, so the app works fully offline and is installable.
- An **install prompt** surfaced in the UI when the browser offers one.

### Home & chrome

- Home screen content: one-sentence promise; "~40 minutes, free, no signup"; the Lesson list with progress indicators; language switcher; install prompt when available; primary start/resume button. No marketing copy, no about page in v1.
- A **footer privacy note** — a one-screen plain-language page describing what the app stores (completed-Lesson state and language choice in your browser) and what it does not (no account, no cookies, aggregate pageview analytics only).

### Repo & licensing

- Public GitHub repo. **Content licensed CC BY-SA, code licensed MIT.** LICENSE files for both.

### Accessibility

- **WCAG 2.2 AA is a hard requirement**: semantic HTML, full keyboard navigation, visible focus, sufficient contrast in light and dark, `prefers-reduced-motion` respected, screen-reader sanity-checked.
- Plus audience-specific accommodations baked into STYLE.md and the content: plain language, short sentences, defined jargon, and verified performance on low-end devices.
- Light and dark themes via `prefers-color-scheme`.

## Testing Decisions

A good test here exercises **external behavior a Learner or maintainer can observe**, never internal wiring. Tests are written against the four seams and nothing below them.

### Content schema (build-time seam)

- Tests feed the Content Collection schema valid and invalid Lesson fixtures and assert that valid ones pass and each invalid shape fails: missing language, unparseable frontmatter, Knowledge Check with no correct answer, Knowledge Check option missing its explanation, duplicate Lesson order.
- Prior art: Astro Content Collections' own `zod` schema validation; this is the standard pattern. A CI step runs `astro build` and fails the pipeline on any content error.

### `progress` module

- Tested through its public interface with an in-memory fake storage port (no real `localStorage`, no DOM).
- Behaviors: marking a Lesson complete makes it report complete; completing Lessons updates the "N of M" count; the resume point is the first incomplete Lesson in order, and is the completion screen when all are done; unknown/again-marked Lessons are idempotent; a corrupt or empty storage value is treated as "nothing completed" rather than throwing.

### `KnowledgeCheck` component

- Behavior test with a testing-library-style renderer for the chosen island framework.
- Behaviors: selecting the correct option shows the positive feedback and its explanation; selecting a wrong option shows negative feedback and that option's explanation; the question can be answered again after a wrong answer; no score is displayed anywhere; nothing is written to the storage port (a Knowledge Check result is never persisted).

### i18n routing

- Route-level render tests against the built route table.
- Behaviors: `/en/`, `/ko/`, `/es/` and each Lesson under them resolve; `/` redirects to the prefix matching a given `Accept-Language`, and to `/en/` when none matches; a stored language preference overrides `Accept-Language`; the language switcher on a Lesson page links to the same Lesson under the other prefixes; every page emits `hreflang` alternates; a configured-but-not-live language is not routable.

### Out of automated scope, verified manually

- Service worker offline behavior and installability: manual smoke test (load, go offline, navigate the whole Course; install to home screen).
- Real screen-reader pass and low-end-device performance check.

## Out of Scope

- Any live LLM interaction, API keys, or a prompt playground that calls a model. Try-It callouts point at real external tools instead.
- User accounts, authentication, and cross-device sync of Progress.
- A custom domain.
- A CMS or an external translation platform as the source of truth (Crowdin may be layered on later per ADR-0002).
- Custom illustrations or a character/illustration set; v1 ships a handful of purpose-built SVG diagrams at most, with text kept as real text.
- Marketing pages, an about page, a blog, email capture, or a newsletter.
- Additional languages beyond English, Korean, and Spanish (LatAm).
- Custom analytics events and any dashboard beyond Cloudflare Web Analytics.
- Certificates, badges, or any formal assessment.
- Audio narration or video.

## Further Notes

- **Launch sequencing**: English is the release gate. Korean and Spanish are drafted with AI assistance and corrected by a named native reviewer per language; each flips live independently via the live-languages configuration when its review lands. Nothing about the build or deploy should assume all three are present.
- **Maintenance trigger**: Lesson 4 ("The Five Tools") carries a visible "last reviewed" date and should be checked roughly quarterly; the content is written capability-first specifically to slow its staleness.
- **Content authorship**: the English first pass is drafted for the maintainer to review line by line; the maintainer owns factual accuracy. This is a process note, not a build requirement.
- **The number "four"**: the original idea said "the main 4 LLMs" but listed five tools. The Course teaches all five, grouped as four general assistants plus Perplexity as the research tool.
- This spec describes the whole of v1. `/to-tickets` will split it into tracer-bullet tickets — likely: project/Astro/PWA scaffold; content schema + build check; `progress` module; `KnowledgeCheck` component; i18n routing + switcher; home + completion screens; service worker precache; STYLE.md + English Lesson content (possibly one ticket per Lesson); privacy note; licensing + repo docs; Cloudflare Pages deploy + analytics wiring.
