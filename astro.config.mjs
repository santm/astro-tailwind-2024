import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import remarkIt from 'markdown-it';
import remarkToc from 'remark-toc';
// https://astro.build/config
export default defineConfig({
  site: 'https://santm.com',
  integrations: [tailwind(), sitemap(), mdx()],
	//  prefetch: true
  //trailingSlash: 'always', problem only - santm
  markdown: {
    // Applied to .md and .mdx files
    remarkPlugins: [ [remarkToc, { heading: "contents"} ] ],
    remarkPlugins: [remarkIt]
  }
});
