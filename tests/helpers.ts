import Parser from '@/parser';
import { highlight, format } from '@/utils';

const parseCode = (input: string) => {
	const ParseInput = new Parser(input);
	const { imports, output, importDeclarations } = ParseInput.parse();

	// Add required imports (e.g. ref, computed, etc.)
	if (imports.length > 0) {
		output.unshift(`import { ${imports.join(', ')} } from 'vue';\n`);
	}

	// Add original import declarations to the top
	if (importDeclarations) {
		output.unshift(...importDeclarations);
	}

	return output.join('\n');
};

const formatCode = (input: string) => {
	return format(parseCode(input));
};

const highlightCode = (input: string) => {
	return highlight(formatCode(input));
};

export {
	parseCode,
	formatCode,
	highlightCode
};