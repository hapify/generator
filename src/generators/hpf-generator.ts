import { HapifySyntax } from 'hapify-syntax';
import { Config } from '../config';
import { IGenerator, ITemplate } from '../interfaces';

const HpfOptions = { timeout: Config.Generator.timeout };

export class HpfGenerator implements IGenerator {
	constructor() {}

	async one(model: any, template: ITemplate): Promise<string> {
		// Create template function
		const cleanedContent = await this._preProcess(template.content);
		const content = HapifySyntax.run(cleanedContent, model, HpfOptions);
		return await this._postProcess(content);
	}

	async all(models: any[], template: ITemplate): Promise<string> {
		// Create template function
		const cleanedContent = await this._preProcess(template.content);
		const content = HapifySyntax.run(cleanedContent, models, HpfOptions);
		return await this._postProcess(content);
	}

	/**
	 * Cleanup code before process
	 */
	private async _preProcess(template: string) {
		const indentConditions = /^ +<<(\?|@|#)([\s\S]*?)>>/gm;
		return template.replace(indentConditions, '<<$1$2>>');
	}

	/**
	 * Cleanup code after process
	 */
	private async _postProcess(code: string) {
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
