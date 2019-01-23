import { IGenerator, ITemplate } from '../interfaces';
import { Service } from 'typedi';
const { SaferEval } = require('safer-eval');
import { Config } from '../../config';
import { TimeoutError, EvaluationError } from '../Errors';
import * as ErrorStackParser from 'error-stack-parser';

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
		return this.eval(template.content, {
			model: model,
			m: model
		});
	}

	/**
	 * @inheritDoc
	 */
	async all(models: any[], template: ITemplate): Promise<string> {
		// Create template function
		return this.eval(template.content, {
			models: models,
			m: models
		});
	}
	/** Run eval */
	private eval(content: string, context: any) {
		try {
			const final = `(function() { \n${content}\n })()`;
			return new SaferEval(context, {
				filename: 'js-generator.js',
				timeout: Config.Generator.timeout,
				lineOffset: -1,
				contextCodeGeneration: {
					strings: false,
					wasm: false,
				}
			}).runInContext(final);
		} catch (error) {
			if  (error.message === 'Script execution timed out.') {
				throw new TimeoutError(`Template processing timed out (${Config.Generator.timeout}ms)`);
			}
			// Format error
			const { lineNumber, columnNumber } = ErrorStackParser.parse(error)[0];
			const evalError = new EvaluationError(error.message);
			evalError.stack = `Error: ${evalError.message}. Line: ${lineNumber}, Column: ${columnNumber}`;
			evalError.lineNumber = lineNumber;
			evalError.columnNumber = columnNumber;
			throw evalError;
		}
	}
}
