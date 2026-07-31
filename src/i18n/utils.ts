import { ui } from './ui';

export const LANGUAGES = { en: 'English', th: 'ไทย' } as const;
export const DEFAULT_LANG: Lang = 'en';
export type Lang = keyof typeof ui; // 'en' | 'th'

/** Detect the active language from the request URL. */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return seg === 'th' ? 'th' : 'en';
}

/** Return the full string table for a language. */
export function useTranslations(lang: Lang) {
  return ui[lang];
}

/**
 * Localize a canonical (English) path for the given language.
 * en: '/services' -> '/services'  |  th: '/services' -> '/th/services'
 * Root is handled specially so Thai lands on '/th/'.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '' ? '/' : path;
  if (lang === 'en') return clean;
  if (clean === '/') return '/th/';
  return `/th${clean}`;
}

/** Strip any locale prefix, returning the canonical (English) path. */
export function stripLocale(pathname: string): string {
  if (pathname === '/th' || pathname === '/th/') return '/';
  if (pathname.startsWith('/th/')) return pathname.slice(3);
  return pathname || '/';
}

/** Given the current URL, produce the equivalent URL in the other language. */
export function alternateLangPath(url: URL, target: Lang): string {
  return localizePath(stripLocale(url.pathname), target);
}
