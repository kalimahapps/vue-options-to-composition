
module.exports = {
	jit: true,
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
	],
	theme: {
		fontFamily: {
			niramit: ['Niramit', 'sans-serif'],
			poppins: ['Poppins', 'sans-serif'],
			firaCode: ['Fira Code', 'monospace'],
		},
		extend: {
			screens: {
				desktop: '900px',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
