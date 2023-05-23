import * as eslint from 'eslint-linter-browserify';

/**
 * Lint and format the output code
 *
 * @param  {string} code Code to lint
 * @return {string}      Linted code
 */
const format = function(code: string): string{
	const linter = new eslint.Linter();

	const results = linter.verifyAndFix(code, {
		parserOptions: {
			sourceType: 'module',
			ecmaVersion: 'latest',
		},
		rules: {
			'indent': ['error', 'tab'],
			'object-property-newline': ['error'],
		},
	});

	return results.output;
};

export {
	format
};