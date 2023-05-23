import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assert, expect, test } from 'vitest';
import { formatCode, parseCode } from './helpers';
import Parser from '@/parser';

test('should throw an error for no export default', () => {
	expect(() => {
		parseCode('');
	}).toThrow('No export declaration found');
});

test('show throw syntax error for invalid export default', () => {
	expect(() => {
		parseCode('{},,}');
	}).toThrow('Unexpected token');
});

test('should throw methods not found error', () => {
	expect(() => {
		parseCode('export default {methods: {}}');
	}).toThrow('No methods found');
});

test('should not show any text if data is empty', () => {
	const result = formatCode('export default {data: {}}');
	assert.equal(result, '');
});

test('data should be empty if is a function and not returning an object', () => {
	const result = formatCode('export default { data: () => "5"}');
	assert.equal(result, '');
});

test('should throw an error if lifcycle callback is not a function', () => {
	expect(() => {
		const ParseInput = new Parser('export default {created: () => {}}');
		ParseInput.callbacksMap = {
			created: 'created',
		};

		ParseInput.parse();
	}).toThrow('Parser class does not have a created method');
});
