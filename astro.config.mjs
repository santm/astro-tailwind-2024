import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from '@astrojs/svelte';
// https://astro.build/config
export default defineConfig({
  site: 'https://santm.com',
  integrations: [tailwind(), sitemap(), mdx(),svelte()]
	//  prefetch: true
});