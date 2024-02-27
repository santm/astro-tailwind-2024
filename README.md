- [] pnpm create astro@latest v2-tailwind-astro
- [] choose empty , strict 
- [] pnpm astro add tailwind
- [] pnpm astro add mdx
- [] pnpm astro add sitemap
- [] pnpm add --save-dev --save-exact prettier
- [] pnpm add --save-dev --save-exact prettier-plugin-tailwindcss 
- pnpm install -D @tailwindcss/typography
- ~~pnpm install preline~~
- pnpm astro add astro-icon
- pnpm install sharp (had to install separately , to fix - build failed,  could be related to preline and strict mode )
- pnpm add @astrojs/rss
- pnpm add dayjs **modify time** of markdown

```
$ cat .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```
```
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			darkMode: 'selector',
		},
	},
	plugins: [],
}
```
```
$ cat tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "paths": {
    "@layouts/*": ["src/layouts/*"],
    "@components/*": ["src/components/*"],
    "@assets/*": ["src/assets/*"],
    "@/*": ["src/*"]
  },

}
```
```
// /** @type {import('tailwindcss').Config} */
export default {
	content: ['./node_modules/preline/preline.js','./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			
		},
	},
	plugins: [
		require('preline/plugin'),
	],
}

```
**Wasted so much time as darkMode was added wrongly in Tailwind config**
> The key is **darkMode** should be within **export** but within other element(s) 
> ~~looks like we need to remove preline **Build Issue**~~

# Goals

- use only pnpm ✅
- tsconfig.json using alias @✅
- container ✅
	- Header and Footer not within container in BaseLayout, only slot is they  have this 
		- *class="max-w-[85rem] flex flex-wrap basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"* 
- ensure light and dark work ✅
- Footer ✅ ~~coffee part is missing ⚒️ ; rest done~~ 
	- 📖 pay close attentions for icon line and its closing the last /
	- 
		``` 
		<Icon name="phosphor/copyright" class="text-xl inline-flex" /> 
		```
- 404 custom error handling ✅
- ensure menu section is highlighted ✅
- ensure **search pagefind** is working 
- ensure **compress/minify**  is part of build before deploying to firebase 
- ensure **_blank** for external site ; add an icon to signify the same
- rss , sitemap ✅
- modification time ✅
- different font for h1 and text and code ✅
	- we added **global.css** in **Basehead.astro** ; this way no more playing with tailwind.config.mjs
	- ```
	<h1 class="text-6xl font-serif" > 
	- h1 has diff light and dark mode
	```
	works but the tailwind config DEFAULT css not working 

- content collection using the image 
- gallery landing to be like astro-movies - animation and transition and data needs to be added to make it work 
- astro icon 
	- **Footer** ✅
	- **Header** 
		- no we are back to basic from astro documentation
		- Also only one button is working for mobile menu  open/close is not working ; 
- expressive code 
- https://cruip.com/create-dynamic-blog-layouts-using-negative-margins/ ; the idea and some input is saved blog_layouts_negative_margins.md
- site.webmanifest
- astro-auto-import , Admonition components 
- better about page ; tech section separate
- ~~baselayout we had preline in the bottom ; removing it <script src="../../node_modules/preline/dist/preline.js"></script>~~
- ~~copy the structure from other themes like dante evo~~ did not work 
✅ added the vertical bar for mobile menu as well teh code is 
	```
	<div class="mx-2 lg:before:hidden before:block before:w-px before:h-4 before:bg-gray-500 dark:before:bg-gray-300">
	```
H1 - bg-gradient-to-r from-blue-300 via-violet-600 to-rose-500 bg-clip-text text-transparent
H1 Dark bg-gradient-to-l from-blue-300 via-violet-600 to-rose-500 bg-clip-text text-transparent

✅ **About page** done for now -- ⚒️ new one  later  ; https://codepen.io/mobalti/full/Jjxqjxe
✅ **Tags page** done for now -- ⚒️ new one Gradient text and simple  
⚒️ need to add gap between navigation and content 
⚒️ the container stuff not center aligned ; over spilling on mobile ; instead of wrapping 
⚒️ Analytics plausible.io
⚒️ switcher icon https://toggles.dev/
⚒️ blog card border bottom ; for now we added gradient border