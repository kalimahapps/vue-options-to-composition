type MethodType = 'method' | 'computed' | 'watch';

class MethodParser {
	/**
	 * The full input string, used to slice text directly from the input
	 */
	fullInput = '';

	/**
	 * List of methods
	 */
	methods :any[] = [];

	/**
	 * List of reactive properties
	 */
	dataIdentifiers :any = {};

	/**
	 * List of method identifiers
	 */
	methodIdentifiers :string[] = [];

	/**
	 * List of computed identifiers
	 */
	computedIdentifiers :string[] = [];

	/**
	 * List of prop identifiers
	 */
	propsIdentifiers :string[] = [];

	/**
	 * Holds the type of method (computed, watch .. etc)
	 */
	methodType: MethodType = 'method';

	/**
	 * Convert methods to regular functions
	 *
	 * @param {any}    data            Methods object
	 * @param {object} dataIdentifiers List of reactive properties
	 */
	constructor (data: any) {
		const { properties } = data.value;

		// Filter out spread elements
		this.methods = properties.filter((property: any) => {
			return property.type !== 'SpreadElement';
		});
	}

	/**
	 * Set full input string
	 *
	 * @param  {string} fullInput The full input string, used to slice text directly from the input
	 * @return {this}             The current instance
	 */
	setfullInput (fullInput: string): this {
		this.fullInput = fullInput;
		return this;
	}

	/**
	 * Set data identifiers to replace `this` keyword
	 *
	 * @param  {any}  dataIdentifiers List of reactive properties
	 * @return {this}                 The current instance
	 */
	setDataIdentifiers (dataIdentifiers: any):this {
		this.dataIdentifiers = dataIdentifiers;
		return this;
	}

	/**
	 * Set prop identifiers to replace `this` keyword
	 *
	 * @param  {string[]} propsIdentifiers List of prop identifiers
	 * @return {this}                      The current instance
	 */
	setPropsIdentifiers (propsIdentifiers: string[]):this {
		this.propsIdentifiers = propsIdentifiers;
		return this;
	}

	/**
	 * Set method identifiers to check when isComputed is true
	 *
	 * @param  {string[]} methodIdentifiers List of method identifiers
	 * @return {this}                       The current instance
	 */
	setMethodIdentifiers (methodIdentifiers: string[]): this {
		this.methodIdentifiers = methodIdentifiers;
		return this;
	}

	/**
	 * Set computed identifiers to replace `this` keyword inside  functions
	 *
	 * @param  {string[]} computedIdentifiers The computed identifiers
	 * @return {this}                         The current instance
	 */
	setComputedIdentifiers (computedIdentifiers: string[]): this {
		this.computedIdentifiers = computedIdentifiers;
		return this;
	}

	/**
	 * Set the method type (computed, watch .. etc)
	 *
	 * @param  {MethodType} type The type of method
	 * @return {this}            The current instance
	 */
	setMethodType (type: MethodType) :this{
		this.methodType = type;
		return this;
	}

	/**
	 * Get method identifiers
	 *
	 * @return {string[]} The method identifiers
	 */
	getMethodIdentifiers (): string[] {
		return this.methodIdentifiers;
	}

	/**
	 * Get computed identifiers
	 *
	 * @return {string[]} The computed identifiers
	 */
	getComputedIdentifiers (): string[] {
		return this.computedIdentifiers;
	}

	/**
	 * Replace `this` keyword inside function body with
	 * relevant reactive property. Regex is used instead of
	 * AST for simplicity. Maybe this can be improved in the future.
	 *
	 * @param  {string} functionBody The function body
	 * @return {string}              The updated function body
	 */
	replaceThisKeyword(functionBody: string) :string {
		return functionBody.replaceAll(/this.(?<id>[\w$]+)/ug, (match, identifier) => {
			const type = this.dataIdentifiers[identifier];
			if (type) {
				return (type === 'ref') ? `${identifier}.value` : identifier;
			}

			// Check if identifier is a method or computed
			const isMethod = this.methodIdentifiers.includes(identifier);
			const isComputed = this.computedIdentifiers.includes(identifier);
			if (isMethod || isComputed) {
			// if (isMethod && this.methodType === 'computed') {
				return identifier;
			}

			// Check if identifier is a prop
			const isProp = this.propsIdentifiers.includes(identifier);
			if (isProp) {
				return `props.${identifier}`;
			}

			return match;
		});
	}

	/**
	 * Convert methods object to regular functions
	 *
	 * @return {string[]} The reactive properties
	 */
	convert() :string[] {
		if (this.methods.length === 0) {
			return [];
		}

		const output :string[] = [];
		/*eslint complexity: ["warn", 7]*/
		this.methods.forEach((property: any) => {
			const { key, value } = property;

			const { start, end, type, async } = value;
			const identifier = key.name;

			// Extract method body from input string
			let methodBody = this.fullInput.slice(start, end);

			// Make sure there is a `function` keyword before the method body
			if (type !== 'ArrowFunctionExpression' && methodBody.trim().startsWith('function') === false){
				methodBody = `function${methodBody}`;
			}

			if (async){
				methodBody = `async ${methodBody}`;
			}

			// Handle different method types
			let newFunction = '';
			switch (this.methodType){
				case 'watch': {
					newFunction = `watch(${identifier}, ${methodBody})`;

					if (type !== 'ObjectExpression') {
						break;
					}

					// If watch method is an object, it means it has handler property
					// and other properties like deep, immediate .. etc
					const { properties } = value;
					const handlerProperty = properties.find((property: any) => {
						const { key } = property;
						return key.name === 'handler';
					});

					const { start, end, type: handlerType } = handlerProperty.value;
					const handlerBody = this.fullInput.slice(start, end);

					// Other properties
					const otherProperties = properties.filter((property: any) => {
						const { key } = property;
						return key.name !== 'handler';
					}).map((property: any) => {
						const { name } = property.key;
						const { value } = property.value;
						return `${name}: ${value}`;
					})
						.join(', ');

					newFunction = `watch(${identifier}, function ${handlerBody}, { ${otherProperties} })`;

					break;
				}

				case 'computed': {
					const {
						body: { start, end },
					} = value;
					const computedBody = this.fullInput.slice(start, end);

					newFunction = `const ${identifier} = computed(() => ${computedBody})`;
					break;
				}
				default: {
					// Handle regular method
					newFunction = `const ${identifier} = ${methodBody}`;
					this.methodIdentifiers.push(identifier);
					break;
				}
			}

			const updatedFunction = this.replaceThisKeyword(newFunction);

			// Push with an empty value to add a new line
			output.push(updatedFunction, '');
		});

		return output;
	}
}

export default MethodParser;