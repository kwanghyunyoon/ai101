import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// One production build shared by every test that asserts on `dist/` output
// (app-shell, i18n-routes). Running `astro build` from two test files in
// parallel workers races on the same directory, so it happens once here.
export default function setup() {
  const root = fileURLToPath(new URL("..", import.meta.url));
  execSync("npm run build", { cwd: root, stdio: "ignore" });
}
