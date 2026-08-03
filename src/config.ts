/**
 * Site-wide, language-agnostic configuration:
 * company facts, contact details, navigation structure, and the
 * ordered list of service pillars (with icon keys). Translatable text
 * lives in src/i18n/ui.ts and is looked up by these keys.
 */

export const SITE = {
  domain: 'leafsp.com',
  url: 'https://leafsp.com',
  companyEn: 'LEAF Software and Production Co., Ltd.',
  companyTh: 'บริษัท ลีฟ ซอฟต์แวร์ แอนด์ โปรดักชัน จำกัด',
  shortName: 'LEAF',
  email: 'leaf.sandp@gmail.com',
  phone: '087-726-2909',
  phoneIntl: '+66877262909',
  addressEn:
    '222/92 Nawarat Village, Moo 3, Nong Kaeo Subdistrict, Hang Dong District, Chiang Mai 50230',
  addressTh:
    '222/92 หมู่บ้านนวรัตน์ หมู่ที่ 3 ตำบลหนองแก๋ว อำเภอหางดง จังหวัดเชียงใหม่ 50230',
  city: 'Chiang Mai, Thailand',
  cityTh: 'เชียงใหม่ ประเทศไทย',
  foundedYear: 2025,
} as const;

/** Canonical (English) paths for each route. Thai variants are derived. */
export const ROUTES = {
  home: '/',
  services: '/services',
  about: '/about',
  contact: '/contact',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Header navigation order. */
export const NAV_ITEMS: RouteKey[] = ['home', 'services', 'about', 'contact'];

/** Ordered service pillars. Titles/descriptions come from i18n by `key`. */
export const SERVICES = [
  { key: 'software', icon: 'code' },
  { key: 'uxui', icon: 'sparkle' },
  { key: 'ai', icon: 'chip' },
  { key: 'qa', icon: 'shield' },
  { key: 'media', icon: 'play' },
  { key: 'consulting', icon: 'compass' },
] as const;

export type ServiceKey = (typeof SERVICES)[number]['key'];

/**
 * Decision tree behind the contact-page project picker: visitors pick a
 * service pillar, then a narrower option from that pillar's branch, so the
 * enquiry arrives already categorised instead of as free text.
 * Labels are resolved from i18n (`projectPicker.*`) by these keys.
 */
export const PROJECT_TREE = {
  software: ['web', 'mobile', 'internal', 'ecommerce', 'website', 'integration'],
  uxui: ['newDesign', 'redesign', 'designSystem', 'research'],
  ai: ['chatbot', 'dataPlatform', 'automation', 'iot'],
  qa: ['testing', 'testAutomation', 'security', 'performance'],
  media: ['video', 'brand', 'shooting', 'content'],
  consulting: ['advisory', 'architecture', 'training', 'transformation'],
} as const satisfies Record<ServiceKey, readonly string[]>;

/** How far along the visitor already is. */
export const PROJECT_STAGES = [
  'idea',
  'spec',
  'design',
  'existing',
  'rescue',
] as const;

/** Desired delivery window. */
export const PROJECT_TIMELINES = [
  'urgent',
  'short',
  'medium',
  'long',
  'flexible',
] as const;

/** Ordered "why LEAF" value props (keys resolved in i18n). */
export const VALUES = ['endToEnd', 'modern', 'secure', 'partnership'] as const;

/** Ordered process steps (keys resolved in i18n). */
export const PROCESS = ['discover', 'design', 'build', 'grow'] as const;

/**
 * Contact form endpoint (Web3Forms — free, no server needed).
 * Replace the access key with your own from https://web3forms.com
 * (create a key with your email; submissions are sent to that inbox).
 */
export const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY';
