import { useState } from "preact/hooks";

/**
 * Copy-to-clipboard button for a Try-It prompt. A small Preact island rather
 * than a hand-rolled script (ADR-0003). The prompt text is also visible and
 * selectable in the block above, so this is pure enhancement.
 */
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      class="try-it-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked (permissions, insecure context) — select manually */
        }
      }}
    >
      {copied ? "Copied" : "Copy prompt"}
    </button>
  );
}
