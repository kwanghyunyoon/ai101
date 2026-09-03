import { useEffect, useMemo, useState } from "preact/hooks";
import { localStoragePort } from "../lib/progress";
import { ui } from "../i18n/ui";

/**
 * A dismissable "Install AI 101" banner, shown only when the browser actually
 * offers installation (`beforeinstallprompt` fired) and the Learner has not
 * dismissed it before. An island (ADR 0003): it renders nothing on the server
 * and nothing until the event arrives, so it never affects first paint.
 *
 * Chrome fires `beforeinstallprompt` and lets us defer it; other browsers do
 * not, and there the banner simply never appears (their own UI handles install).
 */

const DISMISS_KEY = "ai101:install-dismissed";

/** The slice of the non-standard `BeforeInstallPromptEvent` we use. */
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt({ lang }: { lang?: string }) {
  const t = ui(lang).install;
  const storage = useMemo(() => localStoragePort(), []);
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(storage.read(DISMISS_KEY) === "1");

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as InstallEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [storage]);

  if (dismissed || !deferred) return null;

  const install = async () => {
    const event = deferred;
    setDeferred(null);
    try {
      await event.prompt();
      await event.userChoice;
    } catch {
      /* the prompt can only be shown once; nothing to recover */
    }
  };

  const dismiss = () => {
    setDismissed(true);
    storage.write(DISMISS_KEY, "1");
  };

  return (
    <div class="install-prompt" role="region" aria-label={t.region}>
      <p class="install-prompt-text">{t.text}</p>
      <div class="install-prompt-actions">
        <button type="button" class="install-prompt-go" onClick={install}>
          {t.go}
        </button>
        <button
          type="button"
          class="install-prompt-dismiss"
          onClick={dismiss}
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}
