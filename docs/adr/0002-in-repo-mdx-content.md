# In-repo MDX content, no CMS

All Lesson content — for every language — is authored as MDX files in this
repository, managed through Astro Content Collections. There is no headless CMS
and no external translation platform as the source of truth.

We decided this because the Course is only ~6 Lessons across 3 languages: a CMS
would add a service dependency, a cost tier, and a second place where content can
drift out of sync with code. Keeping content in git means every change —
including translations — is reviewable in a pull request alongside the code that
renders it.

## Consequences

- Translators work directly on MDX files or through a PR-based tool layered on
  top of the repo (e.g. Crowdin). If non-technical reviewers find raw MDX too
  awkward, adopting Crowdin is the escape hatch — it syncs to the same files
  rather than replacing them.
- Content updates require a deploy (fast and free on Cloudflare Pages), not a
  publish button.
