import { localizePath } from "../i18n/routing";
import { writeStoredLanguage } from "../i18n/preference";

/**
 * The always-visible language switcher in the app chrome. Renders a real link
 * per live language to the *same* logical path under that language's prefix, so
 * it works with no JavaScript; the click handler additionally persists the
 * choice so `/` honours it on the next visit. An island (ADR 0003) only so the
 * persistence runs — the markup is server-rendered.
 */
export default function LanguageSwitcher({
  currentLang,
  logicalPath,
  languages,
}: {
  currentLang: string;
  logicalPath: string;
  languages: { code: string; label: string }[];
}) {
  return (
    <nav class="lang-switcher" aria-label="Language">
      <ul>
        {languages.map((lang) => {
          const isCurrent = lang.code === currentLang;
          return (
            <li key={lang.code}>
              <a
                href={localizePath(logicalPath, lang.code)}
                hrefLang={lang.code}
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => writeStoredLanguage(lang.code)}
              >
                {lang.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
