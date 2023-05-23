module.exports = {
	extends: ['@kalimahapps', './.eslintrc-auto-import.json'],
	plugins: ['@kalimahapps/eslint-plugin-tailwind'],
	rules: {
		'@kalimahapps/tailwind/sort': 'warn',
		'@kalimahapps/tailwind/multiline': 'warn',
		'no-multi-spaces': ['error', { ignoreEOLComments: true }],
	},
};