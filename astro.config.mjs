import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import ExpressiveCode from 'astro-expressive-code';
export default defineConfig({
  site: 'https://santm.com',
  integrations: [
    tailwind(),
    sitemap(),
    ExpressiveCode({
      themes: ['rose-pine-dawn','dracula'],
    }),
    mdx(),
    icon()
  ]
});