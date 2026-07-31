// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://leafsp.com',
  // English is served at the root (/), Thai under /th/
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'th'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', th: 'th' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // Clean, static output for cPanel / any static host
  build: {
    format: 'directory',
  },
});
