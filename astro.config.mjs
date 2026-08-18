// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages proje sayfası: https://duhannk.github.io/MotunHan/
  // Özel alan adı bağlanırsa: site'ı o alan adı yap, base'i '/' yap.
  site: 'https://duhannk.github.io',
  base: '/MotunHan',

  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  build: {
    // /oyunlar/anime-expeditions/index.html üretir -> temiz URL'ler
    format: 'directory',
  },
});
