import { ITemplate } from './IObjects';

export interface IGenerator {
	/**
	 * Run generation process for one model
	 */
	one(model: any, template: ITemplate): Promise<string>;

	/**
	 * Run generation process for all models
	 */
	all(models: any[], template: ITemplate): Promise<string>;
}
