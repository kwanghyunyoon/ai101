import { defineConfig } from "vitest/config";

export default defineConfig({
  // JSX for the component behaviour tests resolves via tsconfig.json
  // (jsx: react-jsx, jsxImportSource: preact).
  test: {
    include: ["test/**/*.test.{ts,tsx}"],
    // Node by default (build-output and schema tests). The island behaviour
    // tests opt into jsdom with a `@vitest-environment jsdom` file docblock.
  },
});
