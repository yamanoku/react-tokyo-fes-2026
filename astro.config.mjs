// @ts-check

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://react-tokyo-fes-2026.yamanoku.net',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
