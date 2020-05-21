import { HapifyVM } from 'hapify-vm';
import { Config } from '../config';
import { IGenerator, ITemplate } from '../interfaces';
import { TimeoutError, EvaluationError } from '../errors';

export class JavascriptGenerator implements IGenerator {
	constructor() {}

	async one(model: any, template: ITemplate): Promise<string> {
		// Eval template content
		return this.eval(template.content, {
			model: model,
			m: model,
		});
	}

	async all(models: any[], template: ITemplate): Promise<string> {
		// Create template function
		return this.eval(template.content, {
			models: models,
			m: models,
		});
	}

	/** Run eval */
	private eval(content: string, context: any): string {
		try {
			return new HapifyVM({ timeout: Config.Generator.timeout }).run(content, context);
		} catch (error) {
			if (error.code === 6003) {
				throw new TimeoutError(`Template processing timed out (${Config.Generator.timeout}ms)`);
			}
			if (error.code === 6002) {
				// Clone error
				const evalError = new EvaluationError(error.message);
				evalError.details = `Error: ${evalError.message}. Line: ${error.lineNumber}, Column: ${error.columnNumber}`;
				evalError.lineNumber = error.lineNumber;
				evalError.columnNumber = error.columnNumber;
				throw evalError;
			}
			throw error;
		}
	}
}
