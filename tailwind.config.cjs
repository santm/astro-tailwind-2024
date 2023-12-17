/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}','./node_modules/preline/preline.js'],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				// heading: ['Montserrat', 'sans-serif'],
				// code: ['Inconsolata', 'monospace'],
				sans: [
					'"Inter var", sans-serif',
					{
					  fontFeatureSettings: '"cv11", "ss01"',
					  fontVariationSettings: '"opsz" 32'
					},
				  ],
			  },
			// colors: {
			// 	// body: "rgb(var(--color-bg))",
			// 	// "box-bg": "rgb(var(--color-box))",
			// 	// "box-shadow": "rgb(var(--box-sd))",
			// 	// "box-border": "rgb(var(--box-border))",
			// 	// primary: "#1d4ed8",
			// 	// "heading-1": "rgb(var(--heading-1))",
			// 	// "heading-2": "rgb(var(--heading-2))",
			// 	// "heading-3": "rgb(var(--heading-3))",
			// },
			// screens:{
			// 	// midmd:"880px"
			// }
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('preline/plugin'),
	],
}
