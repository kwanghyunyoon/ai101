// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Preact is our island framework (not React-DOM). See docs/adr/0003-preact-islands.md.
export default defineConfig({
  site: "https://ai101.pages.dev",
  integrations: [preact()],
});
