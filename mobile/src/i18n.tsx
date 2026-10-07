import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { TR } from './generated/strings.gen';
import { useStore } from './store';

export type Lang = 'en' | 'tr';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string) => string;
  tf: (en: string, vals: Record<string, string | number>) => string;
};

const LangContext = createContext<Ctx | null>(null);

/**
 * One app-wide language switch, driven by design/strings.json.
 * The English string is the key: t('Get started') -> 'Hemen başla'.
 * Anything absent from the map stays literal in both languages — numbers,
 * prices, levels, personal names, place names, the wordmark.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);

  const t = useCallback(
    (en: string) => (lang === 'tr' ? (TR[en] ?? en) : en),
    [lang],
  );

  /**
   * Turkish puts its words in a different order and glues its suffixes on, so a
   * sentence built by concatenating translated fragments comes out as nonsense.
   * tf() keeps the whole sentence as one key with {holes} the values drop into,
   * which is the same rule the artboards used: translate the node, not the word.
   */
  const tf = useCallback(
    (en: string, vals: Record<string, string | number>) =>
      Object.entries(vals).reduce(
        (out, [k, v]) => out.split(`{${k}}`).join(String(v)),
        t(en),
      ),
    [t],
  );

  const value = useMemo(() => ({ lang, setLang, t, tf }), [lang, setLang, t, tf]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider');
  return ctx;
}

/** Turkish uses a dot in clock times (19.30) and a comma in decimals (1,4 km). */
export function formatTime(hhmm: string, lang: Lang) {
  return lang === 'tr' ? hhmm.replace(':', '.') : hhmm;
}

export function formatDecimal(n: number, lang: Lang, digits = 1) {
  const s = n.toFixed(digits);
  return lang === 'tr' ? s.replace('.', ',') : s;
}

/** Percentages lead in Turkish: %98, not 98%. */
export function formatPercent(n: number, lang: Lang) {
  return lang === 'tr' ? `%${n}` : `${n}%`;
}

/**
 * The "you 5.0" marker label. strings.json carries the 5.0 node whole; the level
 * itself is a number, which stays literal in both languages, so any other value
 * reuses the same sentence.
 */
/**
 * "3 of 4 in". strings.json carries the 3-of-4 node whole; other counts reuse the
 * same construction. In Turkish the number takes a possessive suffix, which is
 * decided by the number's own vowel harmony, so it comes from a table.
 */
const TR_OF_SUFFIX: Record<number, string> = {
  1: "'i", 2: "'si", 3: "'ü", 4: "'ü", 5: "'i",
  6: "'sı", 7: "'si", 8: "'i", 9: "'u", 10: "'u",
};

export function ofInLabel(n: number, cap: number, lang: Lang, t: (s: string) => string) {
  if (n === 3 && cap === 4) return t('3 of 4 in');
  if (lang === 'tr') return `${cap} kişiden ${n}${TR_OF_SUFFIX[n] ?? "'i"}`;
  return `${n} of ${cap} in`;
}

export function youLevel(level: number, lang: Lang, t: (s: string) => string) {
  if (level === 5.0) return t('you 5.0');
  const n = formatDecimal(level, lang);
  return lang === 'tr' ? `sen ${n}` : `you ${n}`;
}

/**
 * "How was playing with Selin?" — strings.json carries the Selin node whole.
 * Personal names stay literal in both languages, so the other players in the queue
 * reuse the sentence. Turkish attaches the comitative with an apostrophe; Selin,
 * Mert and Deniz all take -le, which is what the queue contains.
 */
export function rateHeadline(first: string, lang: Lang, t: (s: string) => string) {
  if (first === 'Selin') return t('How was playing with Selin?');
  return lang === 'tr'
    ? `${first}'le oynamak nasıldı?`
    : `How was playing with ${first}?`;
}

/** "WAS 5.0 THE RIGHT LEVEL?" — only the level varies. */
export function levelQuestion(level: number, lang: Lang, t: (s: string) => string) {
  if (level === 5.0) return t('WAS 5.0 THE RIGHT LEVEL?');
  const n = formatDecimal(level, lang);
  return lang === 'tr' ? `${n} DOĞRU SEVİYE MİYDİ?` : `WAS ${n} THE RIGHT LEVEL?`;
}

/** "1 of 3" — the counter in the rating header. */
export function stepLabel(n: number, of: number, lang: Lang, t: (s: string) => string) {
  if (n === 1 && of === 3) return t('1 of 3');
  return lang === 'tr' ? `${of}'ten ${n}.` : `${n} of ${of}`;
}

/**
 * The two-letter day labels under the "plays on" chart.
 *
 * A plain table rather than t() lookups: t() returns its key when a string is
 * missing, so keyed labels rendered as "day.Mo" in English. Two letters rather
 * than three because the column is 13px wide.
 */
export function weekDays(lang: Lang) {
  return lang === 'tr'
    ? ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
}
