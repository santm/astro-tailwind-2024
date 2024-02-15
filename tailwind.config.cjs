/** @type {import('tailwindcss').Config} */
// const colors = require("tailwindcss/colors");
// colors worked but we are still not using the variable name in our code - santm 
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {
		extend: {
			// colors: {
			// 	primary: colors.blue,
			// 	base: colors.gray,
			// 	info: "#7dd3fc",
			// 	"info-content": "#082f49",
			// 	success: "#6ee7b7",
			// 	"success-content": "#022c22",
			// 	warning: "#fcd34d",
			// 	"warning-content": "#111827",
			// 	error: "#fca5a5",
			// 	"error-content": "#450a0a",
			//   },
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
