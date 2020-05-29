import { HapifySyntax } from 'hapify-syntax';
import { Config } from '../config';
import {ExplicitModel, GeneratorWorker, Template} from '../interfaces';

const HpfOptions = { timeout: Config.Generator.timeout };

export class HpfGenerator implements GeneratorWorker {
	constructor() {}

	async one(model: ExplicitModel, template: Template): Promise<string> {
		// Create template function
		const cleanedContent = await this.preProcess(template.content);
		const content = HapifySyntax.run(cleanedContent, model, HpfOptions);
		return await this.postProcess(content);
	}

	async all(models: ExplicitModel[], template: Template): Promise<string> {
		// Create template function
		const cleanedContent = await this.preProcess(template.content);
		const content = HapifySyntax.run(cleanedContent, models, HpfOptions);
		return await this.postProcess(content);
	}

	/**
	 * Cleanup code before process
	 */
	private async preProcess(template: string) {
		const indentConditions = /^ +<<(\?|@|#)([\s\S]*?)>>/gm;
		return template.replace(indentConditions, '<<$1$2>>');
	}

	/**
	 * Cleanup code after process
	 */
	private async postProcess(code: string) {
		const doubleLine = /\r?\n\r?\n/g;
		while (code.match(doubleLine)) {
			code = code.replace(doubleLine, '\n');
		}

		const doubleLineWithSpace = /\r?\n *\r?\n/g;
		code = code.replace(doubleLineWithSpace, '\n\n');
		code = code.replace(doubleLineWithSpace, '\n\n');

		return code;
	}
}
