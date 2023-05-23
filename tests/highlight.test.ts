
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assert, test } from 'vitest';
import { highlightCode } from './helpers';

// Get all text files from compare folder
const compareFolder = join(__dirname, 'compare', 'html');
const compareFiles = readdirSync(compareFolder).filter((file) => {
	return file.endsWith('input.txt');
});

// Run tests for each file
for (const inputFileName of compareFiles) {
	const fileContent = readFileSync(join(compareFolder, inputFileName), 'utf8');

	// Get output file based on input file name
	const outputFileName = inputFileName.replace('input', 'output');
	const outputFilePath = join(compareFolder, outputFileName);
	const output = readFileSync(outputFilePath, 'utf8');

	test(`should match ${inputFileName}`, async () => {
		const result = await highlightCode(fileContent);
		assert.equal(result, output);
	});
}