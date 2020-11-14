import { HapifySyntax } from '@hapify/syntax';
import { Config } from '../config';
import { ExplicitModel, GeneratorWorker, Template } from '../interfaces';
import { EvaluationError } from '../errors';

const HpfOptions = { timeout: Config.Generator.timeout };

export class HpfGenerator implements GeneratorWorker {
	constructor() {}

	async one(model: ExplicitModel, template: Template): Promise<string> {
		try {
			return HapifySyntax.run(template.content, model, HpfOptions);
		} catch (error) {
			throw this.appendFileName(error, template);
		}
	}

	async all(models: ExplicitModel[], template: Template): Promise<string> {
		try {
			return HapifySyntax.run(template.content, models, HpfOptions);
		} catch (error) {
			throw this.appendFileName(error, template);
		}
	}

	/** Append file name to error details if applicable */
	private appendFileName(error: Error, template: Template): Error {
		if (typeof (<EvaluationError>error).lineNumber !== 'undefined') {
			// Append file name
			(<EvaluationError>error).details += `, File: ${template.path}`;
		}
		return error;
	}
}
