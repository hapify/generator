import { IGenerator, ITemplate } from '../';
import { Service } from 'typedi';
const SafeEval = require('safe-eval');

@Service()
export class JavaScriptGeneratorService implements IGenerator {
	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * @inheritDoc
	 */
	async one(model: any, template: ITemplate): Promise<string> {
		// Eval template content
		return SafeEval(this.evalString(template.content), {
			model: model,
			m: model
		});
	}

	/**
	 * @inheritDoc
	 */
	async all(models: any[], template: ITemplate): Promise<string> {
		// Create template function
		return SafeEval(this.evalString(template.content), {
			models: models,
			m: models
		});
	}

	/**
	 * Return the function to be evaluated
	 * @param {string} content
	 * @return {string}
	 */
	private evalString(content: string): string {
		return `(function() { ${content} })()`;
	}
}
