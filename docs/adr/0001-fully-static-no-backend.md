# Fully static, no backend

AI 101 is a static site (Astro, prerendered, hosted on Cloudflare Pages) with no
application server, no database, and no user accounts. The Learner's Progress
lives only in their own browser's localStorage.

We decided this because the Course is small, static teaching content and the
project's goals are "free and accessible": a backend would add hosting cost, a
privacy surface, login friction, and operational burden for no proportional
benefit.

## Consequences

- No cross-device sync of Progress; clearing browser data loses it (acceptable —
  the Course is one short sitting).
- Analytics is limited to what Cloudflare Web Analytics sees (pageviews, no
  custom events); the completion funnel is measured by comparing Lesson 1,
  Lesson 6, and "done" screen pageviews.
- Adding live LLM practice later would require introducing an edge function
  (Cloudflare Worker) — the hosting choice keeps that door open.
