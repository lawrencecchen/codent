const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts,md}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			sans: ['Inter var', ...defaultTheme.fontFamily.sans]
		}
	},
	variants: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/typography')
	]
};
