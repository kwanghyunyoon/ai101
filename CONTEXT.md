# CONTEXT

Glossary for the AI 101 project. Definitions only — no implementation details.

## Project

A free, accessible Progressive Web App that teaches AI and LLM basics to non-technical
adults. Compact by design: a learner can finish it in one sitting. Trilingual:
English (source), Korean, and Spanish (Latin America).

## Terms

### Learner
The single target persona: a non-technical adult who is curious about AI but
intimidated by it. Has heard of ChatGPT, may have tried it once. Not a student
cohort, not a developer. Examples are chosen so working professionals also get
value, but the Learner is the one the writing serves.

### Course
The whole body of teaching content. Compact: roughly 5–7 short Lessons,
finishable in a single ~30–45 minute sitting.

### Lesson
One unit of the Course. Consists of readable content (text, images, embedded
examples) followed by a Knowledge Check. May contain Try-It callouts.

### Knowledge Check
A short quiz at the end of a Lesson. Confirms understanding; not graded, not
gated. v1 has no live LLM interaction.

### Try-It callout
An inline prompt to go use a real LLM tool ("paste this into ChatGPT and see
what happens"). Gives hands-on practice without the app calling any API.

### The Five Tools
The consumer LLM products the Course orients the Learner around:
ChatGPT, Gemini, Claude, and Grok as general assistants; Perplexity as the
research / search tool. Taught as practical "what each is best at" guidance,
with the caveat that this comparison needs periodic updating.

### Mental model
The light conceptual layer the Course teaches (tokens, training, context,
hallucination) — only as deep as needed to explain why the tools behave as
they do. In service of practical confidence, not an end in itself.

### Progress
The Learner's record of which Lessons they have completed. Stored only in the
Learner's own browser (no account, no server). Drives a "3 of 6 done" indicator
and a resume point. Losing it is harmless.

### Source language
English. The single source of truth for all content. Korean and Spanish (LatAm)
are human-reviewed translations of the English. English ships first; KO and ES
land before public launch.
