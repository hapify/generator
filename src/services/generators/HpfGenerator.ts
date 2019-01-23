import { IGenerator, ITemplate } from '../interfaces';
import { Service } from 'typedi';
import HapifySyntax from 'hapify-syntax';
import { Config } from '../../config';

const HpfOptions = { timeout: Config.Generator.timeout };

@Service()
export class HpfGeneratorService implements IGenerator {
	/**
	 * Constructor
	 */
	constructor() {}

	/**
	 * @inheritDoc
	 */
	async one(model: any, template: ITemplate): Promise<string> {
		// Create template function
		const cleanedContent = await this._preProcess(template.content);
		const content = HapifySyntax.run(cleanedContent, model, HpfOptions);
		return await this._postProcess(content);
	}

	/**
	 * @inheritDoc
	 */
	async all(models: any[], template: ITemplate): Promise<string> {
		// Create template function
		const cleanedContent = await this._preProcess(template.content);
		const content = HapifySyntax.run(cleanedContent, models, HpfOptions);
		return await this._postProcess(content);
	}

	/**
	 * Cleanup code before process
	 *
	 * @param {string} template
	 * @return {Promise<string>}
	 * @private
	 */
	private async _preProcess(template: string) {
		const indentConditions = /^ +<<(\?|@|#)([\s\S]*?)>>/gm;
		return template.replace(indentConditions, '<<$1$2>>');
	}

	/**
	 * Cleanup code after process
	 *
	 * @param {string} code
	 * @return {Promise<string>}
	 * @private
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
