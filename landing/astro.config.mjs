// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://sociussports.vercel.app',

  fonts: [
      {
          // Display + numerals. The lock asks for 700 only — no other weight of it ships.
          name: 'Bricolage Grotesque',
          cssVariable: '--font-bricolage',
          provider: fontProviders.google(),
          weights: [700],
          styles: ['normal'],
          // latin-ext carries ı ğ ş İ Ğ Ş — the page is Turkish, latin alone drops them.
          subsets: ['latin', 'latin-ext'],
          fallbacks: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      {
          name: 'Instrument Sans',
          cssVariable: '--font-instrument',
          provider: fontProviders.google(),
          weights: [400, 500, 600, 700],
          styles: ['normal'],
          subsets: ['latin', 'latin-ext'],
          fallbacks: ['system-ui', 'sans-serif'],
      },
    ],

  adapter: vercel(),
});