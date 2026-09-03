import type { Language } from "../i18n/config";
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
  lang,
  logicalPath,
  languages,
}: {
  lang: string;
  logicalPath: string;
  languages: Language[];
}) {
  return (
    <nav class="lang-switcher" aria-label="Language">
      <ul>
        {languages.map((language) => {
          const isCurrent = language.code === lang;
          return (
            <li key={language.code}>
              <a
                href={localizePath(logicalPath, language.code)}
                hrefLang={language.htmlLang}
                aria-current={isCurrent ? "true" : undefined}
                onClick={() =>
                  isCurrent || writeStoredLanguage(language.code)
                }
              >
                {language.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
