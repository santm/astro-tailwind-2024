import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import ExpressiveCode from 'astro-expressive-code';
import AutoImport from "astro-auto-import";
export default defineConfig({
  site: 'https://santm.com',
  integrations: [
    // example auto import component into blog post mdx files
    AutoImport({
      imports: [
        // https://github.com/delucis/astro-auto-import
        "@components/Admonition.astro",
      ],
    }),
    tailwind(),
    sitemap(),
    ExpressiveCode({
      themes: ['dracula','light-plus'],
      themeCssSelector: (theme) => `.${theme.type}`,
    }),
    mdx(),
    icon()
  ]
});