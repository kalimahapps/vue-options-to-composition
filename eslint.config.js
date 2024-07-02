import fs from 'node:fs';
import kalimahAppsTailwind from '@kalimahapps/eslint-plugin-tailwind';
import eslintConfig from '@kalimahapps/eslint-config';
const vueGlobal = JSON.parse(fs.readFileSync('.eslintrc-auto-import.json', 'utf8'));
export default [
	...eslintConfig,
	{
		plugins: {
			kalimahAppsTailwind,
		},
		rules: {
			'kalimahAppsTailwind/sort': 'warn',
			'kalimahAppsTailwind/multiline': 'warn',
		},
		languageOptions: vueGlobal,
	},
];