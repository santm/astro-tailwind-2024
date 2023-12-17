/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Inter var", sans-serif',
					{
					  fontFeatureSettings: '"cv11", "ss01"',
					  fontVariationSettings: '"opsz" 32'
					},
				  ],
			  },
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
