import { parse } from 'acorn';
import DataParser from './data';
import MethodParser from './methods';
import PropsParser from './props';
import Lifecycle from './lifecycle';

type CallbacksMap = {
	[key: string]: string,
};

type lifecycleType = 'created' | 'mounted' | 'beforeMount' | 'beforeUpdate' | 'updated' | 'beforeDestroy' | 'destroyed';

class Parser {
	/**
	 * The input string to parse
	 */
	input = '';

	/**
	 * The AST of the input
	 */
	ast: any = {};

	/**
	 * Map of callbacks to trigger for each property
	 */
	callbacksMap: CallbacksMap = {
		data: 'dataCallback',
		props: 'propsCallback',
		methods: 'methodsCallback',
		watch: 'watchCallback',
		computed: 'computedCallback',
		created: 'lifecycleCallback',
		mounted: 'lifecycleCallback',
		beforeDestroy: 'lifecycleCallback',
		destroyed: 'lifecycleCallback',
		beforeMount: 'lifecycleCallback',
		beforeUpdate: 'lifecycleCallback',
		updated: 'lifecycleCallback',
	};

	/**
	 * List of output lines
	 */
	output : string[] = [];

	/**
	 * List of imports (eg: ref, computed, watch ...)
	 */
	imports : string[] = [];

	/**
	 * List of data identifiers (from data object)
	 */
	dataIdentifiers : any = {};

	/**
	 * List of method identifiers (from methods)
	 */
	methodIdentifiers : string[] = [];

	/**
	 * List of props identifiers (from props object)
	 */
	propsIdentifiers : string[] = [];

	/**
	 * List of computed identifiers (from computed methods)
	 */
	computedIdentifiers : string[] = [];

	/**
	 * Constructor
	 *
	 * @param {string} input The input string
	 */
	constructor (input:string) {
		this.input = input;
	}

	/**
	 * Get import declarations from the top of the input
	 *
	 * @return {string[]} List of import declarations
	 */
	getImportDeclaration () :string[] {
		const importDeclarations = this.ast.body.filter((node: any) => {
			return node.type === 'ImportDeclaration';
		});

		const imports :string[] = [];

		for (const importDeclaration of importDeclarations) {
			const { specifiers, source } = importDeclaration;
			const { value } = source;
			const { name } = specifiers[0].local;

			imports.push(`import ${name} from '${value}';`);
		}

		return imports;
	}

	/**
	 * Get properties from the export default declaration
	 *
	 * @throws {Error} If no export declaration is found
	 * @return {object} The properties
	 */
	getProperties () {
		const exportDeclaration = this.ast.body.find((node: any) => {
			return node.type === 'ExportDefaultDeclaration';
		});

		if (!exportDeclaration) {
			throw new Error('No export declaration found');
		}

		const results : {[key: string] : any} = {};
		const propertiesName = Object.keys(this.callbacksMap);

		const { properties } = exportDeclaration.declaration;

		propertiesName.forEach((propertyName: string) => {
			const property = properties.find((property: any) => {
				const { name } = property.key;
				return name === propertyName;
			});

			results[propertyName] = property;
		});

		return results;
	}

	/**
	 * Handle lifecycle callback (created, mounted .. etc)
	 *
	 * @param {any}           data The lifecycle object
	 * @param {lifecycleType} key  The lifecycle type (created, mounted .. etc)
	 */
	lifecycleCallback (data: any, key: lifecycleType) {
		const lifecycleParser = new Lifecycle(data);
		const convertedData = lifecycleParser
			.setfullInput(this.input)
			.setDataIdentifiers(this.dataIdentifiers)
			.setPropsIdentifiers(this.propsIdentifiers)
			.setMethodIdentifiers(this.methodIdentifiers)
			.setComputedIdentifiers(this.computedIdentifiers)
			.setType(key)
			.convert();

		const title = key.charAt(0).toUpperCase() + key.slice(1);
		this.output.push('', `// ${title}`, convertedData);

		const hookImport = lifecycleParser.getImport();
		if (hookImport) {
			this.imports.push(hookImport);
		}
	}

	/**
	 * Handle data callback
	 *
	 * @param {any} data Ast related to data
	 */
	dataCallback (data:any) {
		const dataParser = new DataParser(data);
		const convertedData = dataParser.setfullInput(this.input).convert();
		const dataImports = dataParser.getImports();
		this.dataIdentifiers = dataParser.getIdentifiers();

		if (convertedData.length === 0) {
			return;
		}

		this.imports.push(...dataImports);
		this.output.push('', '// Data', ...convertedData);
	}

	/**
	 * Handle methods callback
	 *
	 * @param {any} methods Ast related to methods
	 */
	methodsCallback (methods:any) {
		const methodParser = new MethodParser(methods);
		const convertedMethods = methodParser
			.setfullInput(this.input)
			.setDataIdentifiers(this.dataIdentifiers)
			.setPropsIdentifiers(this.propsIdentifiers)
			.convert();

		this.methodIdentifiers = methodParser.getMethodIdentifiers();
		this.output.push('', '// Methods', ...convertedMethods);
	}

	/**
	 * Handle computed callback
	 *
	 * @param {any} computed Ast related to computed methods
	 */
	computedCallback (computed:any) {
		const methodParser = new MethodParser(computed);
		const convertedMethods =
		methodParser
			.setfullInput(this.input)
			.setMethodType('computed')
			.setDataIdentifiers(this.dataIdentifiers)
			.setMethodIdentifiers(this.methodIdentifiers)
			.setPropsIdentifiers(this.propsIdentifiers)
			.convert();

		this.computedIdentifiers = methodParser.getComputedIdentifiers();

		this.output.push('', '// Computed', ...convertedMethods);
		this.imports.push('computed');
	}

	/**
	 * Handle watch callback
	 *
	 * @param {any} watch Ast related to watch methods
	 */
	watchCallback (watch:any) {
		const methodParser = new MethodParser(watch);
		const convertedMethods =
		methodParser
			.setfullInput(this.input)
			.setMethodType('watch')
			.setDataIdentifiers(this.dataIdentifiers)
			.setMethodIdentifiers(this.methodIdentifiers)
			.setPropsIdentifiers(this.propsIdentifiers)
			.setComputedIdentifiers(this.computedIdentifiers)
			.convert();

		this.output.push('', '// Watch', ...convertedMethods);
		this.imports.push('watch');
	}

	/**
	 * Handle props callback
	 *
	 * @param {any} props Ast related to props
	 */
	propsCallback (props:any) {
		const dataParser = new PropsParser(props);
		const convertedData = dataParser.setfullInput(this.input).convert();

		this.propsIdentifiers = dataParser.getIdentifiers();
		this.output.push('', '// Props', convertedData);
	}

	/**
	 * Entry point
	 *
	 * @return {object} The parsed data object
	 */
	parse () {
		this.ast = parse(this.input, {
			ecmaVersion: 'latest',
			sourceType: 'module',
		});

		const properties = this.getProperties();

		// Loop through keys and trigger the related callback
		Object.entries(this.callbacksMap).forEach(([key, callbackName]) => {
			if (!properties[key]) {
				return;
			}

			const callbackFunction = this[callbackName as keyof this];

			if (typeof callbackFunction !== 'function') {
				throw new TypeError(`Parser class does not have a ${callbackName} method`);
			}

			callbackFunction.call(this, properties[key], key);
		});

		return {
			importDeclarations: this.getImportDeclaration(),
			output: this.output,
			imports: this.imports,
		};
	}
}

export default Parser;