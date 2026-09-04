/*
 * UI strings — the chrome, home, completion, privacy note, and island labels —
 * for every configured language. Lesson *content* lives in MDX
 * (`src/content/lessons/<lang>/`); this file is only the app's own copy.
 *
 * English is the complete source. A translation supplies a `DeepPartial` of the
 * same shape; `ui(lang)` deep-merges it onto English, so a missing key falls
 * back to English rather than showing `undefined`. Pure data with no `astro:*`
 * imports, so the islands and the string tests use it directly.
 *
 * `{name}` placeholders are filled by `fmt()`.
 */

import { DEFAULT_LANGUAGE } from "./config";

const en = {
  skipLink: "Skip to content",
  languageLabel: "Language",
  footer: {
    license:
      "Free and open. Content licensed CC BY-SA 4.0, code licensed MIT. Your progress stays in your browser — no account, no cookies.",
    privacyLink: "What we store",
  },
  home: {
    tagline: "Learn AI and LLM basics in one ~40-minute sitting. Free, no signup.",
    lessonsIntro:
      "{count} short lessons with a knowledge check after each. Your progress stays in this browser — start anywhere, come back anytime.",
  },
  toc: {
    done: "Done",
    minutes: "about {minutes} min",
    summary: "{done} of {total} done",
    start: "Start Lesson {n}",
    resume: "Resume Lesson {n}",
    seeCompletion: "See your completion",
  },
  lessons: {
    title: "Lessons",
    pageTitle: "Lessons — AI 101",
    meta: "· about {minutes} min",
  },
  lesson: {
    meta: "Lesson {order} · about {minutes} min",
    reviewed: "Last reviewed: {date}",
  },
  lessonComplete: {
    finish: "Finish the Course",
    next: "Mark complete → next Lesson",
  },
  knowledgeCheck: {
    heading: "Knowledge check",
    correct: "Correct.",
    notQuite: "Not quite.",
  },
  tryIt: {
    label: "Try it",
    lookFor: "What to look for:",
  },
  copy: {
    idle: "Copy prompt",
    done: "Copied",
  },
  install: {
    region: "Install AI 101",
    text: "Install AI 101 to your device — it works fully offline.",
    go: "Install",
    dismiss: "Not now",
  },
  done: {
    pageTitle: "You finished — AI 101",
    heading: "You finished AI 101",
    body: "You worked through every lesson. You now have a working picture of what a large language model does and where it fails. You can also get better answers out of one. That was the goal.",
    nextHeading: "Where to go next",
    revisit: "Revisit {title}",
    revisitNote: "The mental-model lesson rewards a second read.",
    practice:
      "Go practice in a tool you picked. Use ChatGPT, Gemini, Claude, or Grok for everyday help. Use Perplexity when you need sources. Bring a real task and try the before/after prompt from the lessons.",
    back: "Back to the lesson list",
  },
  privacy: {
    pageTitle: "What we store — AI 101",
    heading: "What we store",
    intro:
      "This site has no account and no login. You do not give us your name or email. Here is everything the site keeps, and where it keeps it.",
    storedHeading: "Saved in your browser",
    storedIntro:
      "Two small things are saved on your own device, so the site works the way you left it:",
    storedLessons:
      'Which lessons you have finished. This drives the "done" count and where you pick back up.',
    storedLanguage:
      "Your language choice, so the site opens in that language next time.",
    storedNote:
      "Both live in local storage — a small space your browser keeps for this site. They never leave your device and we cannot see them. Clearing your browser data erases them, and nothing breaks if you do.",
    notHeading: "What we do not do",
    notAccount: "No account, no password, no login.",
    notCookies: "No cookies.",
    notSelling: "No selling or sharing of data. There is no data to sell.",
    notTracking: "No tracking of you across other sites.",
    analyticsHeading: "Visitor counts",
    analyticsBody:
      "We use Cloudflare Web Analytics to see how the site is used. It shows aggregate numbers only: how many times each page loaded, which sites link here, and roughly which countries visitors come from.",
    analyticsNote:
      "It sets no cookies. It does not build a profile of you and does not track you across other sites.",
    questionsHeading: "Questions",
    questionsBody:
      "The code is open source. You can read exactly what it does, or open an issue, on {link}.",
    questionsLink: "GitHub",
  },
} as const;

/**
 * The full string set. Every language resolves to this shape via `ui()`.
 * `Widen` drops the `as const` literal types back to `string` so a translation
 * can supply any string, not only the exact English one.
 */
type Widen<T> = T extends string
  ? string
  : { -readonly [K in keyof T]: Widen<T[K]> };
export type UiStrings = Widen<typeof en>;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? T[K] : DeepPartial<T[K]>;
};

/*
 * Korean edition. AI-drafted; awaiting correction by a named native Korean
 * reviewer before `ko` is flipped into `LIVE_LANGUAGE_CODES` (see config.ts).
 */
const ko: DeepPartial<UiStrings> = {
  skipLink: "본문으로 건너뛰기",
  languageLabel: "언어",
  footer: {
    license:
      "무료이며 오픈소스입니다. 콘텐츠는 CC BY-SA 4.0, 코드는 MIT 라이선스로 제공됩니다. 학습 기록은 이 브라우저에만 저장됩니다 — 계정도, 쿠키도 없습니다.",
    privacyLink: "저장하는 정보",
  },
  home: {
    tagline:
      "약 40분 한 자리에서 AI와 LLM의 기초를 배웁니다. 무료, 가입 없음.",
    lessonsIntro:
      "짧은 레슨 {count}개, 각 레슨 끝에 이해도 점검이 있습니다. 학습 기록은 이 브라우저에만 남으니 아무 데서나 시작하고 언제든 다시 오세요.",
  },
  toc: {
    done: "완료",
    minutes: "약 {minutes}분",
    summary: "{total}개 중 {done}개 완료",
    start: "레슨 {n} 시작하기",
    resume: "레슨 {n} 이어서 하기",
    seeCompletion: "수료 화면 보기",
  },
  lessons: {
    title: "레슨",
    pageTitle: "레슨 — AI 101",
    meta: "· 약 {minutes}분",
  },
  lesson: {
    meta: "레슨 {order} · 약 {minutes}분",
    reviewed: "마지막 확인: {date}",
  },
  lessonComplete: {
    finish: "과정 마치기",
    next: "완료 표시하고 다음 레슨으로",
  },
  knowledgeCheck: {
    heading: "이해도 점검",
    correct: "정답입니다.",
    notQuite: "아쉽네요.",
  },
  tryIt: {
    label: "직접 해보기",
    lookFor: "이런 답이 좋은 답입니다:",
  },
  copy: {
    idle: "프롬프트 복사",
    done: "복사됨",
  },
  install: {
    region: "AI 101 설치",
    text: "기기에 AI 101을 설치하세요 — 완전히 오프라인으로 작동합니다.",
    go: "설치",
    dismiss: "나중에",
  },
  done: {
    pageTitle: "다 마쳤습니다 — AI 101",
    heading: "AI 101을 다 마쳤습니다",
    body: "모든 레슨을 끝냈습니다. 이제 대규모 언어 모델이 무엇을 하고 어디에서 실패하는지 큰 그림이 잡혔을 것입니다. 더 나은 답을 끌어내는 방법도 익혔습니다. 그것이 목표였습니다.",
    nextHeading: "다음으로 할 일",
    revisit: "{title} 다시 보기",
    revisitNote: "사고 모형을 다루는 레슨은 두 번 읽을 가치가 있습니다.",
    practice:
      "고른 도구로 직접 연습해 보세요. 일상적인 도움에는 ChatGPT, Gemini, Claude, Grok을 쓰고, 출처가 필요하면 Perplexity를 쓰세요. 실제 작업을 가져와 레슨의 전후 비교 프롬프트를 시도해 보세요.",
    back: "레슨 목록으로 돌아가기",
  },
  privacy: {
    pageTitle: "저장하는 정보 — AI 101",
    heading: "저장하는 정보",
    intro:
      "이 사이트에는 계정도 로그인도 없습니다. 이름이나 이메일을 받지 않습니다. 사이트가 보관하는 모든 것과 그 위치는 다음과 같습니다.",
    storedHeading: "브라우저에 저장되는 것",
    storedIntro:
      "사이트가 떠났던 상태 그대로 작동하도록, 작은 두 가지가 사용자의 기기에 저장됩니다:",
    storedLessons:
      '끝낸 레슨. "완료" 개수와 다시 시작할 지점을 정하는 데 쓰입니다.',
    storedLanguage: "선택한 언어. 다음에 사이트가 그 언어로 열립니다.",
    storedNote:
      "둘 다 로컬 저장소 — 브라우저가 이 사이트를 위해 두는 작은 공간 — 에 있습니다. 기기를 벗어나지 않으며 우리는 볼 수 없습니다. 브라우저 데이터를 지우면 함께 지워지고, 지워도 아무 문제가 없습니다.",
    notHeading: "하지 않는 것",
    notAccount: "계정, 비밀번호, 로그인 없음.",
    notCookies: "쿠키 없음.",
    notSelling: "데이터 판매나 공유 없음. 팔 데이터 자체가 없습니다.",
    notTracking: "다른 사이트에서 사용자를 추적하지 않음.",
    analyticsHeading: "방문자 수",
    analyticsBody:
      "사이트가 어떻게 쓰이는지 보려고 Cloudflare Web Analytics를 사용합니다. 집계된 숫자만 보여줍니다: 각 페이지가 몇 번 열렸는지, 어떤 사이트가 여기로 링크하는지, 방문자가 대략 어느 나라에서 오는지.",
    analyticsNote:
      "쿠키를 설정하지 않습니다. 사용자의 프로필을 만들지 않으며 다른 사이트에서 추적하지 않습니다.",
    questionsHeading: "문의",
    questionsBody:
      "코드는 오픈소스입니다. 정확히 무슨 일을 하는지 읽어보거나 {link}에서 이슈를 열 수 있습니다.",
    questionsLink: "GitHub",
  },
};

/*
 * Spanish (Latin America) edition. AI-drafted; awaiting correction by a named
 * native Latin American Spanish reviewer before `es` is flipped into
 * `LIVE_LANGUAGE_CODES` (see config.ts). LatAm register, not European.
 */
const es: DeepPartial<UiStrings> = {
  skipLink: "Saltar al contenido",
  languageLabel: "Idioma",
  footer: {
    license:
      "Gratis y de código abierto. Contenido bajo licencia CC BY-SA 4.0, código bajo licencia MIT. Tu progreso se queda en tu navegador: sin cuenta, sin cookies.",
    privacyLink: "Qué guardamos",
  },
  home: {
    tagline:
      "Aprende lo básico de la IA y los LLM en una sola sesión de unos 40 minutos. Gratis, sin registro.",
    lessonsIntro:
      "{count} lecciones cortas con una comprobación de conocimientos después de cada una. Tu progreso se queda en este navegador: empieza donde quieras, vuelve cuando quieras.",
  },
  toc: {
    done: "Hecho",
    minutes: "unos {minutes} min",
    summary: "{done} de {total} hechas",
    start: "Empezar la lección {n}",
    resume: "Retomar la lección {n}",
    seeCompletion: "Ver tu finalización",
  },
  lessons: {
    title: "Lecciones",
    pageTitle: "Lecciones — AI 101",
    meta: "· unos {minutes} min",
  },
  lesson: {
    meta: "Lección {order} · unos {minutes} min",
    reviewed: "Última revisión: {date}",
  },
  lessonComplete: {
    finish: "Terminar el curso",
    next: "Marcar como hecha → siguiente lección",
  },
  knowledgeCheck: {
    heading: "Comprobación de conocimientos",
    correct: "Correcto.",
    notQuite: "No exactamente.",
  },
  tryIt: {
    label: "Pruébalo",
    lookFor: "Qué buscar:",
  },
  copy: {
    idle: "Copiar instrucción",
    done: "Copiado",
  },
  install: {
    region: "Instalar AI 101",
    text: "Instala AI 101 en tu dispositivo: funciona por completo sin conexión.",
    go: "Instalar",
    dismiss: "Ahora no",
  },
  done: {
    pageTitle: "Terminaste — AI 101",
    heading: "Terminaste AI 101",
    body: "Recorriste todas las lecciones. Ahora tienes una imagen práctica de qué hace un modelo grande de lenguaje y dónde falla. También puedes sacarle mejores respuestas. Ese era el objetivo.",
    nextHeading: "Adónde ir después",
    revisit: "Volver a {title}",
    revisitNote: "La lección del modelo mental compensa una segunda lectura.",
    practice:
      "Ve a practicar en una herramienta que hayas elegido. Usa ChatGPT, Gemini, Claude o Grok para la ayuda de todos los días. Usa Perplexity cuando necesites fuentes. Trae una tarea real y prueba la instrucción de antes y después de las lecciones.",
    back: "Volver a la lista de lecciones",
  },
  privacy: {
    pageTitle: "Qué guardamos — AI 101",
    heading: "Qué guardamos",
    intro:
      "Este sitio no tiene cuenta ni inicio de sesión. No nos das tu nombre ni tu correo. Esto es todo lo que el sitio guarda, y dónde lo guarda.",
    storedHeading: "Guardado en tu navegador",
    storedIntro:
      "Se guardan dos cosas pequeñas en tu propio dispositivo, para que el sitio funcione tal como lo dejaste:",
    storedLessons:
      'Qué lecciones has terminado. Esto alimenta el conteo de "hecho" y el punto donde retomas.',
    storedLanguage:
      "Tu elección de idioma, para que el sitio se abra en ese idioma la próxima vez.",
    storedNote:
      "Ambas viven en el almacenamiento local: un espacio pequeño que tu navegador reserva para este sitio. Nunca salen de tu dispositivo y no podemos verlas. Borrar los datos de tu navegador las elimina, y no se rompe nada si lo haces.",
    notHeading: "Qué no hacemos",
    notAccount: "Sin cuenta, sin contraseña, sin inicio de sesión.",
    notCookies: "Sin cookies.",
    notSelling: "No vendemos ni compartimos datos. No hay datos que vender.",
    notTracking: "No te rastreamos por otros sitios.",
    analyticsHeading: "Conteo de visitas",
    analyticsBody:
      "Usamos Cloudflare Web Analytics para ver cómo se usa el sitio. Solo muestra números agregados: cuántas veces se cargó cada página, qué sitios enlazan aquí y de qué países vienen los visitantes a grandes rasgos.",
    analyticsNote:
      "No pone cookies. No arma un perfil de ti y no te rastrea por otros sitios.",
    questionsHeading: "Preguntas",
    questionsBody:
      "El código es de código abierto. Puedes leer exactamente qué hace, o abrir un issue, en {link}.",
    questionsLink: "GitHub",
  },
};

const TRANSLATIONS: Record<string, DeepPartial<UiStrings>> = { en, ko, es };

function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (!override) return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const o = (override as any)[key];
    if (o === undefined) continue;
    const b = (base as any)[key];
    out[key] =
      b && typeof b === "object" && typeof o === "object" && !Array.isArray(b)
        ? deepMerge(b, o)
        : o;
  }
  return out;
}

/** The UI strings for `lang`, with English filling any untranslated key. */
export function ui(lang: string = DEFAULT_LANGUAGE): UiStrings {
  return deepMerge(en as UiStrings, TRANSLATIONS[lang]);
}

/** Fill `{name}` placeholders: `fmt("약 {n}분", { n: 6 })` → `"약 6분"`. */
export function fmt(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
