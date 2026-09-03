// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";

// Preact is our island framework (not React-DOM). See docs/adr/0003-preact-islands.md.
// MDX backs the Lesson content collection. See docs/adr/0002-in-repo-mdx-content.md.
export default defineConfig({
  site: "https://ai101.pages.dev",
  integrations: [preact(), mdx()],
});
