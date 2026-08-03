import { ui } from './ui';

export const LANGUAGES = { th: 'ไทย', en: 'English' } as const;
export const DEFAULT_LANG: Lang = 'th';
export type Lang = keyof typeof ui; // 'en' | 'th'

/** Detect the active language from the request URL. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return seg === 'en' ? 'en' : 'th';
}

/** Return the full string table for a language. */
export function useTranslations(lang: Lang) {
  return ui[lang];
}

/**
 * Localize a canonical (unprefixed, Thai) path for the given language.
 * th: '/services' -> '/services'  |  en: '/services' -> '/en/services'
 * Root is handled specially so English lands on '/en/'.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '' ? '/' : path;
  if (lang === 'th') return clean;
  if (clean === '/') return '/en/';
  return `/en${clean}`;
}

/** Strip any locale prefix, returning the canonical (Thai) path. */
export function stripLocale(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname || '/';
}

/** Given the current URL, produce the equivalent URL in the other language. */
export function alternateLangPath(url: URL, target: Lang): string {
  return localizePath(stripLocale(url.pathname), target);
}
